"""Pydantic v2 schemas for API requests, responses, and data validation."""

from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# -------------------------------------------------------------------
# Mission Schemas
# -------------------------------------------------------------------

class MissionBase(BaseModel):
    name: str
    status: str
    lead_country: Optional[str] = None
    partner: Optional[str] = None
    launch_target: Optional[str] = None
    mission_duration: Optional[str] = None


class MissionCreate(MissionBase):
    pass


class MissionUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    lead_country: Optional[str] = None
    partner: Optional[str] = None
    launch_target: Optional[str] = None
    mission_duration: Optional[str] = None


class MissionResponse(MissionBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------------
# Dataset Schemas
# -------------------------------------------------------------------

class DatasetBase(BaseModel):
    title: str
    instrument: str
    region: str
    date_acquired: Optional[datetime] = None
    file_format: Optional[str] = "PDS4"
    file_size_mb: Optional[float] = 0.0
    download_url: Optional[str] = None
    ice_probability: Optional[float] = None
    description: Optional[str] = None
    data_points_count: Optional[int] = 0


class DatasetCreate(DatasetBase):
    pass


class DatasetUpdate(BaseModel):
    title: Optional[str] = None
    instrument: Optional[str] = None
    region: Optional[str] = None
    date_acquired: Optional[datetime] = None
    file_format: Optional[str] = None
    file_size_mb: Optional[float] = None
    download_url: Optional[str] = None
    ice_probability: Optional[float] = None
    description: Optional[str] = None
    data_points_count: Optional[int] = None


class DatasetResponse(DatasetBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DatasetCalibrateResponse(BaseModel):
    dataset_id: int
    task_id: str
    status: str
    message: str


class DatasetDoiResponse(BaseModel):
    dataset_id: int
    doi: str
    registered_at: datetime


# -------------------------------------------------------------------
# Telemetry Schemas
# -------------------------------------------------------------------

class TelemetryBase(BaseModel):
    timestamp: datetime
    satellite_id: str
    battery_pct: float
    solar_power_w: float
    core_temp_c: float
    signal_dbm: float
    orbit_phase: str
    pitch: float
    roll: float
    yaw: float
    ns_status: str
    nir_status: str
    overall_status: str


class TelemetryCreate(TelemetryBase):
    pass


class TelemetryResponse(TelemetryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------------
# LandingSite Schemas
# -------------------------------------------------------------------

class LandingSiteBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    elevation_km: Optional[float] = None
    psr_proximity_km: Optional[float] = None
    ice_concentration_pct: Optional[float] = None
    artemis_priority: Optional[int] = 1
    description: Optional[str] = None
    key_features: Optional[List[str]] = Field(default_factory=list)


class LandingSiteCreate(LandingSiteBase):
    pass


class LandingSiteUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    elevation_km: Optional[float] = None
    psr_proximity_km: Optional[float] = None
    ice_concentration_pct: Optional[float] = None
    artemis_priority: Optional[int] = None
    description: Optional[str] = None
    key_features: Optional[List[str]] = None


class LandingSiteResponse(LandingSiteBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------------
# PSRRegion Schemas
# -------------------------------------------------------------------

class PSRRegionBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    diameter_km: Optional[float] = None
    area_km2: Optional[float] = None
    estimated_ice_mass_tons: Optional[float] = None
    avg_temp_k: Optional[float] = None
    max_depth_m: Optional[float] = None
    description: Optional[str] = None


class PSRRegionCreate(PSRRegionBase):
    pass


class PSRRegionUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    diameter_km: Optional[float] = None
    area_km2: Optional[float] = None
    estimated_ice_mass_tons: Optional[float] = None
    avg_temp_k: Optional[float] = None
    max_depth_m: Optional[float] = None
    description: Optional[str] = None


class PSRRegionResponse(PSRRegionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------------
# User Schemas
# -------------------------------------------------------------------

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "researcher"
    organization: Optional[str] = None
    orcid_id: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    organization: Optional[str] = None
    orcid_id: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------------
# Paper Schemas
# -------------------------------------------------------------------

class PaperBase(BaseModel):
    title: str
    authors: List[str] = Field(default_factory=list)
    journal: Optional[str] = None
    pub_date: Optional[date] = None
    doi: Optional[str] = None
    abstract: Optional[str] = None
    pdf_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class PaperCreate(PaperBase):
    pass


class PaperUpdate(BaseModel):
    title: Optional[str] = None
    authors: Optional[List[str]] = None
    journal: Optional[str] = None
    pub_date: Optional[date] = None
    doi: Optional[str] = None
    abstract: Optional[str] = None
    pdf_url: Optional[str] = None
    tags: Optional[List[str]] = None


class PaperResponse(PaperBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# -------------------------------------------------------------------
# Artemis & Analytics Custom Schemas
# -------------------------------------------------------------------

class ArtemisAnalyzeRequest(BaseModel):
    latitude: float
    longitude: float


class ArtemisAnalyzeResponse(BaseModel):
    latitude: float
    longitude: float
    ice_depth_estimate_m: float
    accessibility_score: float
    isru_potential: str
    nearest_psr: str
    psr_distance_km: float


class PSRSearchResult(PSRRegionResponse):
    distance_km: Optional[float] = None
    h2o_wt_pct_estimate: Optional[float] = None
