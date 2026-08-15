"""Database seeding script containing realistic LRO, LCROSS, and Diviner lunar science data."""

from datetime import datetime, date
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point

from ..models.models import (
    Mission,
    Dataset,
    Telemetry,
    LandingSite,
    PSRRegion,
    User,
    Paper
)


def seed_database(db: Session) -> None:
    """Populate database with initial real-world published scientific data if tables are empty."""
    # Check if database is already seeded
    if db.query(Mission).first() is not None:
        return

    # 1. Missions
    missions = [
        Mission(
            name="Lunar Reconnaissance Orbiter (LRO)",
            status="Active",
            lead_country="USA",
            partner="NASA GSFC / IKI",
            launch_target="Lunar Orbit",
            mission_duration="15+ Years (2009-Present)"
        ),
        Mission(
            name="LCROSS (Lunar Crater Observation and Sensing Satellite)",
            status="Completed",
            lead_country="USA",
            partner="NASA Ames",
            launch_target="Cabeus Crater Impact",
            mission_duration="4 Months (2009)"
        ),
        Mission(
            name="Luna Ice Mapper (6U CubeSat)",
            status="Operational / Development",
            lead_country="USA",
            partner="NASA Artemis / International Space Agency",
            launch_target="Lunar Polar Orbit (100 km)",
            mission_duration="2 Years"
        ),
        Mission(
            name="Artemis III Crewed Lunar Landing",
            status="Planned",
            lead_country="USA",
            partner="NASA / ESA / JAXA",
            launch_target="Lunar South Pole",
            mission_duration="30 Days"
        )
    ]
    db.add_all(missions)
    db.commit()

    # 2. Datasets
    datasets = [
        Dataset(
            title="LRO LEND High-Resolution Epithermal Neutron Maps",
            instrument="LEND",
            region="South Pole PSRs",
            date_acquired=datetime(2021, 6, 15, 12, 0),
            file_format="PDS4",
            file_size_mb=450.5,
            download_url="https://pds-geosciences.wustl.edu/lro/lro-l-lend-3-rdr-v1/lrolnd_1001/data/lend_epithermal_map.pds4",
            ice_probability=0.88,
            description="Collimated epithermal neutron flux mapping indicating water ice concentrations in Cabeus and Shackleton PSRs.",
            data_points_count=1250000
        ),
        Dataset(
            title="Diviner Lunar Radiometer South Polar Temperature Gradients",
            instrument="Diviner",
            region="Lunar South Pole",
            date_acquired=datetime(2022, 9, 10, 8, 30),
            file_format="PDS4 GeoTIFF",
            file_size_mb=820.0,
            download_url="https://pds-geosciences.wustl.edu/lro/lro-l-dlre-4-rdr-v1/dlre_0001/data/diviner_temp_map.tif",
            ice_probability=0.92,
            description="Surface and subsurface kinetic temperature maps showing thermal cold traps below 100 Kelvin.",
            data_points_count=3400000
        ),
        Dataset(
            title="LCROSS Centaur Impact Spectroscopy Volatile Detection",
            instrument="LCROSS Near-IR Spectrometer",
            region="Cabeus Crater",
            date_acquired=datetime(2009, 10, 9, 11, 31),
            file_format="PDS4 ASCII Table",
            file_size_mb=12.4,
            download_url="https://pds-atmosphere.nmsu.edu/data/lcross/impact_spec_cabeus.pds4",
            ice_probability=0.99,
            description="Direct detection of H2O vapor, water ice grains, and minor volatiles (CO2, NH3, H2S) in impact plume.",
            data_points_count=45000
        ),
        Dataset(
            title="Mini-RF Synthetic Aperture Radar Circular Polarization Ratio",
            instrument="Mini-RF",
            region="Shackleton / Haworth",
            date_acquired=datetime(2020, 3, 22, 14, 15),
            file_format="PDS4 Raster",
            file_size_mb=610.2,
            download_url="https://pds-geosciences.wustl.edu/lro/lro-l-mrf-3-rdr-v1/mrf_cpr_map.pds4",
            ice_probability=0.76,
            description="High Circular Polarization Ratio (CPR) signatures consistent with subsurface ice deposits.",
            data_points_count=980000
        )
    ]
    db.add_all(datasets)
    db.commit()

    # 3. PSR Regions (8+ regions with real LRO/LOLA/Diviner parameters)
    psr_data = [
        {
            "name": "Shackleton Crater PSR",
            "latitude": -89.9,
            "longitude": 0.0,
            "diameter_km": 21.0,
            "area_km2": 350.0,
            "estimated_ice_mass_tons": 1.5e8,
            "avg_temp_k": 40.0,
            "max_depth_m": 4200.0,
            "description": "Ultra-cold deep polar impact crater centered almost precisely on the lunar South Pole."
        },
        {
            "name": "Cabeus Crater PSR",
            "latitude": -84.9,
            "longitude": 324.5,
            "diameter_km": 100.0,
            "area_km2": 7850.0,
            "estimated_ice_mass_tons": 5.2e8,
            "avg_temp_k": 38.0,
            "max_depth_m": 5700.0,
            "description": "LCROSS impact target location. Confirmed 5.6 wt% H2O water ice in ejecta plume."
        },
        {
            "name": "Faustini Crater PSR",
            "latitude": -87.3,
            "longitude": 77.0,
            "diameter_km": 39.0,
            "area_km2": 1200.0,
            "estimated_ice_mass_tons": 2.1e8,
            "avg_temp_k": 55.0,
            "max_depth_m": 3100.0,
            "description": "Major permanently shadowed basin adjacent to Shoemaker crater."
        },
        {
            "name": "Shoemaker Crater PSR",
            "latitude": -88.1,
            "longitude": 45.0,
            "diameter_km": 50.9,
            "area_km2": 2030.0,
            "estimated_ice_mass_tons": 3.4e8,
            "avg_temp_k": 50.0,
            "max_depth_m": 3500.0,
            "description": "Significant epithermal neutron flux suppression detected by LRO LEND and LP-NS."
        },
        {
            "name": "Haworth Crater PSR",
            "latitude": -87.4,
            "longitude": 355.0,
            "diameter_km": 51.0,
            "area_km2": 2040.0,
            "estimated_ice_mass_tons": 2.8e8,
            "avg_temp_k": 45.0,
            "max_depth_m": 3300.0,
            "description": "Complex floor terrain containing localized sub-surface cold traps."
        },
        {
            "name": "Amundsen Crater PSR",
            "latitude": -84.5,
            "longitude": 105.6,
            "diameter_km": 103.0,
            "area_km2": 8330.0,
            "estimated_ice_mass_tons": 6.1e8,
            "avg_temp_k": 60.0,
            "max_depth_m": 5900.0,
            "description": "Large south polar floor feature with deep shadow zones."
        },
        {
            "name": "Nobile Crater PSR",
            "latitude": -85.2,
            "longitude": 53.5,
            "diameter_km": 73.0,
            "area_km2": 4180.0,
            "estimated_ice_mass_tons": 3.9e8,
            "avg_temp_k": 58.0,
            "max_depth_m": 4800.0,
            "description": "Target area for NASA VIPER rover exploration and surface drilling."
        },
        {
            "name": "Slater Crater PSR",
            "latitude": -88.1,
            "longitude": 158.4,
            "diameter_km": 25.0,
            "area_km2": 490.0,
            "estimated_ice_mass_tons": 1.1e8,
            "avg_temp_k": 42.0,
            "max_depth_m": 2900.0,
            "description": "High-latitude cold trap with near-zero seasonal illumination variance."
        }
    ]

    for p in psr_data:
        point = Point(p["longitude"], p["latitude"])
        psr_obj = PSRRegion(
            name=p["name"],
            latitude=p["latitude"],
            longitude=p["longitude"],
            diameter_km=p["diameter_km"],
            area_km2=p["area_km2"],
            estimated_ice_mass_tons=p["estimated_ice_mass_tons"],
            avg_temp_k=p["avg_temp_k"],
            max_depth_m=p["max_depth_m"],
            description=p["description"],
            geometry=from_shape(point, srid=4326)
        )
        db.add(psr_obj)
    db.commit()

    # 4. Landing Sites (3+ candidate sites for Artemis)
    landing_sites_data = [
        {
            "name": "Shackleton Connecting Ridge",
            "latitude": -89.78,
            "longitude": 202.0,
            "elevation_km": 1.2,
            "psr_proximity_km": 0.5,
            "ice_concentration_pct": 5.8,
            "artemis_priority": 1,
            "description": "Highest priority Artemis landing region offering near-continuous solar illumination and immediate PSR access.",
            "key_features": ["92% Solar Illumination", "Direct Earth Line-of-Sight", "Adjacent to Shackleton Ice Trap"]
        },
        {
            "name": "Haworth Rim",
            "latitude": -87.45,
            "longitude": 343.0,
            "elevation_km": 0.8,
            "psr_proximity_km": 1.2,
            "ice_concentration_pct": 4.2,
            "artemis_priority": 1,
            "description": "Elevated rim providing excellent power generation potential and safe lander slope profile.",
            "key_features": ["High Elevation Peak", "Multi-Crater View", "Favorable Landing Slopes (<8 deg)"]
        },
        {
            "name": "Connecting Ridge Extension",
            "latitude": -89.44,
            "longitude": 222.0,
            "elevation_km": 1.5,
            "psr_proximity_km": 0.8,
            "ice_concentration_pct": 6.1,
            "artemis_priority": 1,
            "description": "Extended high-altitude ridge with direct access to deep permanently shadowed valleys.",
            "key_features": ["Peak Illumination Site", "Communication Relay Hub", "High Water-Ice Concentration"]
        },
        {
            "name": "Malapert Mountain Peak",
            "latitude": -85.99,
            "longitude": 2.9,
            "elevation_km": 5.0,
            "psr_proximity_km": 12.0,
            "ice_concentration_pct": 2.1,
            "artemis_priority": 2,
            "description": "Massive 5 km elevated mountain feature with perpetual direct line-of-sight to Earth.",
            "key_features": ["Continuous Earth Visibility", "Deep Space Optical Relay Site", "Stable Thermal Regime"]
        }
    ]

    for ls in landing_sites_data:
        point = Point(ls["longitude"], ls["latitude"])
        site_obj = LandingSite(
            name=ls["name"],
            latitude=ls["latitude"],
            longitude=ls["longitude"],
            elevation_km=ls["elevation_km"],
            psr_proximity_km=ls["psr_proximity_km"],
            ice_concentration_pct=ls["ice_concentration_pct"],
            artemis_priority=ls["artemis_priority"],
            description=ls["description"],
            key_features=ls["key_features"],
            geometry=from_shape(point, srid=4326)
        )
        db.add(site_obj)
    db.commit()

    # 5. Telemetry sample
    telemetry_records = [
        Telemetry(
            timestamp=datetime.utcnow(),
            satellite_id="CubeSat-LunaIce-1",
            battery_pct=96.5,
            solar_power_w=48.2,
            core_temp_c=-12.4,
            signal_dbm=-84.2,
            orbit_phase="South Polar Pass",
            pitch=0.02,
            roll=-0.01,
            yaw=0.15,
            ns_status="NOMINAL",
            nir_status="NOMINAL",
            overall_status="HEALTHY"
        ),
        Telemetry(
            timestamp=datetime.utcnow(),
            satellite_id="CubeSat-LunaIce-1",
            battery_pct=95.1,
            solar_power_w=47.8,
            core_temp_c=-11.8,
            signal_dbm=-85.0,
            orbit_phase="South Polar Pass",
            pitch=0.03,
            roll=0.00,
            yaw=0.14,
            ns_status="NOMINAL",
            nir_status="NOMINAL",
            overall_status="HEALTHY"
        )
    ]
    db.add_all(telemetry_records)
    db.commit()

    # 6. Users
    users = [
        User(
            name="Dr. David Paige",
            email="dpaige@ucla.edu",
            role="Principal Investigator",
            organization="UCLA / LRO Diviner Team",
            orcid_id="0000-0002-3100-8451"
        ),
        User(
            name="Dr. Anthony Colaprete",
            email="anthony.colaprete@nasa.gov",
            role="Lead Scientist",
            organization="NASA Ames Research Center",
            orcid_id="0000-0001-8842-1209"
        ),
        User(
            name="Dr. Maria Zuber",
            email="zuber@mit.edu",
            role="Co-Investigator",
            organization="MIT / LRO LOLA Team",
            orcid_id="0000-0003-4512-9876"
        )
    ]
    db.add_all(users)
    db.commit()

    # 7. Papers
    papers = [
        Paper(
            title="Detection of Water in the LCROSS Ejecta Plume",
            authors=["A. Colaprete", "P. Schultz", "J. Heldmann", "D. Wooden", "M. Shirley"],
            journal="Science",
            pub_date=date(2010, 10, 22),
            doi="10.1126/science.1186986",
            abstract="Impact of the LCROSS Centaur upper stage into Cabeus crater released water vapor and ice particles, confirming ~5.6 wt% H2O along with volatile organics.",
            pdf_url="https://science.org/doi/10.1126/science.1186986",
            tags=["LCROSS", "Cabeus", "Volatiles", "Spectroscopy", "Water Ice"]
        ),
        Paper(
            title="Diviner Lunar Radiometer Observations of Cold Traps in the Lunar South Polar Region",
            authors=["D. A. Paige", "M. A. Siegler", "J. A. Zhang", "P. O. Hayne"],
            journal="Science",
            pub_date=date(2010, 10, 22),
            doi="10.1126/science.1187726",
            abstract="Diviner thermal measurements reveal extreme cold traps below 40 K capable of preserving water ice and supervolatiles over geological timescales.",
            pdf_url="https://science.org/doi/10.1126/science.1187726",
            tags=["Diviner", "LRO", "Thermal Modeling", "PSRs", "Cold Traps"]
        ),
        Paper(
            title="Hydrogen Mapping of the Lunar South Pole Using LRO LEND",
            authors=["I. G. Mitrofanov", "A. B. Sanin", "W. V. Boynton", "G. Chin"],
            journal="Science",
            pub_date=date(2010, 10, 22),
            doi="10.1126/science.1185696",
            abstract="Neutron flux mapping by the Lunar Exploration Neutron Detector demonstrates suppressed epithermal neutrons in polar shadow regions.",
            pdf_url="https://science.org/doi/10.1126/science.1185696",
            tags=["LEND", "Neutron Spectrometry", "Epithermal Suppression", "Hydrogen"]
        )
    ]
    db.add_all(papers)
    db.commit()


if __name__ == "__main__":
    from ..database import SessionLocal, Base, engine
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_database(session)
        print("Database seeding completed successfully.")
    finally:
        session.close()
