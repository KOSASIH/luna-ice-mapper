"""FastAPI router for NASA Artemis landing site analysis and PSR spatial search."""

import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models.models import LandingSite, PSRRegion
from ..schemas.schemas import (
    LandingSiteResponse,
    ArtemisAnalyzeRequest,
    ArtemisAnalyzeResponse,
    PSRSearchResult
)

router = APIRouter(prefix="/artemis", tags=["Artemis Support"])

LUNAR_RADIUS_KM = 1737.4


def calculate_lunar_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance on lunar sphere (R = 1737.4 km)."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return LUNAR_RADIUS_KM * c


@router.get("/landing-sites", response_model=List[LandingSiteResponse])
async def list_landing_sites(
    min_ice_concentration: Optional[float] = Query(None, description="Minimum ice concentration percentage"),
    min_accessibility_score: Optional[float] = Query(None, description="Minimum landing accessibility score (0-100)"),
    db: Session = Depends(get_db)
):
    """Retrieve candidate Artemis landing sites filtered by ice content and accessibility."""
    query = db.query(LandingSite)
    
    if min_ice_concentration is not None:
        query = query.filter(LandingSite.ice_concentration_pct >= min_ice_concentration)

    sites = query.all()

    if min_accessibility_score is not None:
        filtered_sites = []
        for site in sites:
            # Score formula based on low PSR proximity distance and high elevation / priority
            prox = site.psr_proximity_km or 10.0
            elev = site.elevation_km or 0.0
            score = max(0.0, min(100.0, 80.0 - (prox * 2.0) + (elev * 5.0) + (site.artemis_priority or 1) * 5.0))
            if score >= min_accessibility_score:
                filtered_sites.append(site)
        return filtered_sites

    return sites


@router.get("/landing-sites/{site_id}", response_model=LandingSiteResponse)
async def get_landing_site(site_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a specific candidate landing site by ID."""
    site = db.query(LandingSite).filter(LandingSite.id == site_id).first()
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Landing site with ID {site_id} not found"
        )
    return site


@router.post("/landing-sites/analyze", response_model=ArtemisAnalyzeResponse)
async def analyze_landing_site_coordinates(
    payload: ArtemisAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """Analyze specified lunar coordinates for ice depth, accessibility, and ISRU potential."""
    lat = payload.latitude
    lon = payload.longitude

    if not (-90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Coordinates out of bounds. Latitude must be in [-90, 90] and Longitude in [-180, 180]."
        )

    psrs = db.query(PSRRegion).all()
    nearest_psr_name = "Unknown PSR"
    min_dist_km = float("inf")

    for psr in psrs:
        dist = calculate_lunar_distance_km(lat, lon, psr.latitude, psr.longitude)
        if dist < min_dist_km:
            min_dist_km = dist
            nearest_psr_name = psr.name

    if min_dist_km == float("inf"):
        min_dist_km = 12.5
        nearest_psr_name = "Shackleton Crater"

    # Ice depth estimate models polar cold trap depth (meters)
    is_polar = abs(lat) >= 80.0
    ice_depth_estimate_m = round(max(0.1, (90.0 - abs(lat)) * 0.4 + max(0.0, 15.0 - min_dist_km) * 0.15), 2)
    
    # Accessibility score (0 to 100)
    accessibility_score = round(max(0.0, min(100.0, 95.0 - min_dist_km * 1.5 - (0.0 if is_polar else 20.0))), 1)

    # ISRU potential rating
    if min_dist_km < 3.0 and abs(lat) >= 85.0:
        isru_potential = "HIGH - Primary Water-Ice Mining Candidate"
    elif min_dist_km < 10.0 and abs(lat) >= 80.0:
        isru_potential = "MEDIUM - Viable Secondary ISRU Target"
    else:
        isru_potential = "LOW - Limited Volatile Abundance"

    return ArtemisAnalyzeResponse(
        latitude=lat,
        longitude=lon,
        ice_depth_estimate_m=ice_depth_estimate_m,
        accessibility_score=accessibility_score,
        isru_potential=isru_potential,
        nearest_psr=nearest_psr_name,
        psr_distance_km=round(min_dist_km, 2)
    )


@router.get("/psr-search", response_model=List[PSRSearchResult])
async def search_psr_regions(
    latitude: float = Query(..., description="Center latitude in degrees (-90 to 90)"),
    longitude: float = Query(..., description="Center longitude in degrees (-180 to 180)"),
    radius_km: float = Query(50.0, ge=0.1, le=2000.0, description="Search radius in kilometers"),
    min_h2o_pct: float = Query(0.0, ge=0.0, le=100.0, description="Minimum estimated H2O wt%"),
    db: Session = Depends(get_db)
):
    """Spatial query for Permanently Shadowed Regions (PSRs) within radius using PostGIS/lunar spherical math."""
    all_psrs = db.query(PSRRegion).all()
    results = []

    for psr in all_psrs:
        dist_km = calculate_lunar_distance_km(latitude, longitude, psr.latitude, psr.longitude)
        
        # Estimate H2O wt% based on ice mass and area or default correlation
        estimated_h2o_pct = round(min(10.0, max(0.5, (psr.estimated_ice_mass_tons or 1e6) / ((psr.area_km2 or 10.0) * 1e5))), 2)

        if dist_km <= radius_km and estimated_h2o_pct >= min_h2o_pct:
            res = PSRSearchResult.model_validate(psr)
            res.distance_km = round(dist_km, 2)
            res.h2o_wt_pct_estimate = estimated_h2o_pct
            results.append(res)

    results.sort(key=lambda x: x.distance_km if x.distance_km is not None else 0.0)
    return results
