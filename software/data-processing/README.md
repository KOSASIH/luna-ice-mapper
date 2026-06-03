# Data Processing Pipeline

**Agent Owner:** ANALYTICA (Data Scientist)

## Overview

The data processing pipeline transforms raw instrument telemetry into science-grade ice abundance maps. It implements a multi-level processing chain conforming to NASA PDS Level 0–3 standards.

## Processing Levels

| Level | Name | Description | Format |
|-------|------|-------------|--------|
| L0 | Raw | Depacketized instrument data, no processing | CCSDS packets → FITS |
| L1a | Calibrated | Radiometric calibration applied | FITS |
| L1b | Georeferenced | Mapped to lunar lat/lon grid | GeoTIFF + HDF5 |
| L2 | Science Product | Ice signature detection results | NetCDF |
| L3 | Ice Abundance Map | Quantitative H₂O abundance grid | NetCDF + GeoTIFF |

## Pipeline Architecture

```
data-processing/
├── pipeline/
│   ├── l0_ingestion.py        # CCSDS packet depacketizer
│   ├── l1a_calibration.py     # Radiometric calibration (NS + NIR)
│   ├── l1b_georeferencing.py  # SPICE kernels → lat/lon mapping
│   ├── l2_ice_detection.py    # Spectral + neutron ice signatures
│   └── l3_abundance_map.py    # ML-based abundance quantification
├── models/
│   ├── neutron_ice_model.py   # Neutron flux → H₂O abundance model
│   ├── nir_spectral_model.py  # NIR band ratio ice detection
│   └── ml_classifier/         # Trained ice/no-ice classifier
├── utils/
│   ├── spice_utils.py         # NAIF SPICE kernel utilities
│   ├── pds_writer.py          # NASA PDS4 archive writer
│   └── visualization.py       # Ice map plotting utilities
├── notebooks/                 # Jupyter analysis notebooks
├── tests/
├── requirements.txt
└── pipeline.py                # Main pipeline entrypoint
```

## Key Dependencies

```txt
numpy>=1.26
scipy>=1.12
astropy>=6.0
spiceypy>=6.0         # NAIF SPICE for geometry
pandas>=2.0
scikit-learn>=1.4     # ML models
netCDF4>=1.6
rasterio>=1.3         # GeoTIFF I/O
matplotlib>=3.8
cartopy>=0.23         # Lunar map projections
```

## Running the Pipeline

```bash
# Full pipeline from L0 raw data
python pipeline.py --input data/raw/ --output data/products/ --level L3

# Simulation mode (synthetic test data)
python pipeline.py --mode sim --output data/products/

# Single instrument
python pipeline.py --instrument NS --level L1a
```

## Status

📋 **Planned** — Architecture being designed by ANALYTICA (Phase 1)

---
*Owner: ANALYTICA • Luna Ice Mapper*
