"""FastAPI router for spacecraft engineering telemetry stream."""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Telemetry
from ..schemas.schemas import TelemetryCreate, TelemetryResponse

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])


@router.get("", response_model=List[TelemetryResponse])
async def get_latest_telemetry(
    limit: int = Query(10, ge=1, le=100, description="Number of recent telemetry records"),
    db: Session = Depends(get_db)
):
    """Retrieve the latest spacecraft engineering telemetry entries."""
    records = db.query(Telemetry).order_by(Telemetry.timestamp.desc()).limit(limit).all()
    return records


@router.get("/history", response_model=List[TelemetryResponse])
async def get_telemetry_history(
    satellite_id: Optional[str] = Query(None, description="Satellite identifier e.g. CubeSat-1"),
    start_time: Optional[datetime] = Query(None, description="Start timestamp (ISO format)"),
    end_time: Optional[datetime] = Query(None, description="End timestamp (ISO format)"),
    limit: int = Query(100, ge=1, le=1000, description="Max records to return"),
    db: Session = Depends(get_db)
):
    """Query historical telemetry time-series within a given time range."""
    query = db.query(Telemetry)
    if satellite_id:
        query = query.filter(Telemetry.satellite_id == satellite_id)
    if start_time:
        query = query.filter(Telemetry.timestamp >= start_time)
    if end_time:
        query = query.filter(Telemetry.timestamp <= end_time)
    
    return query.order_by(Telemetry.timestamp.desc()).limit(limit).all()


@router.get("/{satellite_id}", response_model=TelemetryResponse)
async def get_satellite_latest_telemetry(satellite_id: str, db: Session = Depends(get_db)):
    """Retrieve the most recent telemetry entry for a specific satellite."""
    record = (
        db.query(Telemetry)
        .filter(Telemetry.satellite_id == satellite_id)
        .order_by(Telemetry.timestamp.desc())
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No telemetry data found for satellite '{satellite_id}'"
        )
    return record


@router.post("", response_model=TelemetryResponse, status_code=status.HTTP_201_CREATED)
async def ingest_telemetry(telemetry_in: TelemetryCreate, db: Session = Depends(get_db)):
    """Ingest a new real-time spacecraft engineering telemetry frame."""
    telemetry = Telemetry(**telemetry_in.model_dump())
    db.add(telemetry)
    db.commit()
    db.refresh(telemetry)
    return telemetry
