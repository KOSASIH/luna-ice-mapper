"""SQLAlchemy ORM models for Luna Ice Mapper backend."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Text, JSON
from geoalchemy2 import Geometry

from ..database import Base


class Mission(Base):
    """Mission entity model representing lunar orbital or surface missions."""

    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    lead_country = Column(String(100))
    partner = Column(String(255))
    launch_target = Column(String(100))
    mission_duration = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)


class Dataset(Base):
    """Scientific dataset model collected by spacecraft instruments."""

    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    instrument = Column(String(100), index=True)
    region = Column(String(100), index=True)
    date_acquired = Column(DateTime)
    file_format = Column(String(50))
    file_size_mb = Column(Float)
    download_url = Column(String(512))
    ice_probability = Column(Float)
    description = Column(Text)
    data_points_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Telemetry(Base):
    """Spacecraft engineering telemetry model.

    Designed for TimescaleDB hypertable partitioning on timestamp.
    """

    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    satellite_id = Column(String(50), nullable=False, index=True)
    battery_pct = Column(Float)
    solar_power_w = Column(Float)
    core_temp_c = Column(Float)
    signal_dbm = Column(Float)
    orbit_phase = Column(String(50))
    pitch = Column(Float)
    roll = Column(Float)
    yaw = Column(Float)
    ns_status = Column(String(50))  # Neutron Spectrometer status
    nir_status = Column(String(50))  # Near-Infrared Spectrometer status
    overall_status = Column(String(50))


class LandingSite(Base):
    """Candidate lunar south polar landing site for Artemis missions."""

    __tablename__ = "landing_sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_km = Column(Float)
    psr_proximity_km = Column(Float)
    ice_concentration_pct = Column(Float)
    artemis_priority = Column(Integer, default=1)
    description = Column(Text)
    key_features = Column(JSON, default=list)
    geometry = Column(Geometry("POINT", srid=4326))


class PSRRegion(Base):
    """Permanently Shadowed Region (PSR) mapping model."""

    __tablename__ = "psr_regions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    diameter_km = Column(Float)
    area_km2 = Column(Float)
    estimated_ice_mass_tons = Column(Float)
    avg_temp_k = Column(Float)
    max_depth_m = Column(Float)
    description = Column(Text)
    geometry = Column(Geometry("POINT", srid=4326))


class User(Base):
    """Registered platform user model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(50), default="researcher")
    organization = Column(String(255))
    orcid_id = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class Paper(Base):
    """Lunar ice mapping research publication paper model."""

    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(512), nullable=False)
    authors = Column(JSON, default=list)
    journal = Column(String(255))
    pub_date = Column(Date)
    doi = Column(String(100), unique=True, index=True)
    abstract = Column(Text)
    pdf_url = Column(String(512))
    tags = Column(JSON, default=list)
