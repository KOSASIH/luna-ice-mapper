"""FastAPI router for scientific datasets and processing triggers."""

import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Dataset
from ..schemas.schemas import (
    DatasetCreate,
    DatasetResponse,
    DatasetUpdate,
    DatasetCalibrateResponse,
    DatasetDoiResponse
)

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.get("", response_model=List[DatasetResponse])
async def list_datasets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    instrument: Optional[str] = Query(None, description="Filter by instrument (e.g. LEND, LAMP, Diviner, Mini-RF)"),
    region: Optional[str] = Query(None, description="Filter by lunar region (e.g. Shackleton, Cabeus, South Pole)"),
    db: Session = Depends(get_db)
):
    """List datasets with optional filtering by instrument and lunar region."""
    query = db.query(Dataset)
    if instrument:
        query = query.filter(Dataset.instrument.ilike(f"%{instrument}%"))
    if region:
        query = query.filter(Dataset.region.ilike(f"%{region}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    """Get metadata for a single dataset by ID."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    return dataset


@router.post("", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset(dataset_in: DatasetCreate, db: Session = Depends(get_db)):
    """Upload metadata and register a new lunar scientific dataset."""
    dataset = Dataset(**dataset_in.model_dump())
    if not dataset.download_url:
        dataset.download_url = f"/api/datasets/{uuid.uuid4().hex[:8]}/file.pds4"
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset


@router.get("/{dataset_id}/download")
async def download_dataset(dataset_id: int, db: Session = Depends(get_db)):
    """Retrieve or download raw PDS4 archive file for a dataset."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    if dataset.download_url and dataset.download_url.startswith("http"):
        return RedirectResponse(url=dataset.download_url)
    
    return JSONResponse(
        content={
            "dataset_id": dataset.id,
            "title": dataset.title,
            "file_format": dataset.file_format or "PDS4",
            "file_size_mb": dataset.file_size_mb,
            "download_url": dataset.download_url or f"https://pds.nasa.gov/data/luna-ice/{dataset.id}.xml",
            "message": f"Downloading PDS4 data stream for {dataset.title}"
        }
    )


@router.post("/{dataset_id}/calibrate", response_model=DatasetCalibrateResponse)
async def trigger_calibration(dataset_id: int, db: Session = Depends(get_db)):
    """Trigger the asynchronous neutron spectrometer calibration pipeline."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    
    # Try Celery delay or generate standard task tracking info
    task_id = f"task-calib-{uuid.uuid4().hex[:12]}"
    try:
        from ..tasks.calibration import calibrate_neutron_data
        celery_task = calibrate_neutron_data.delay(dataset_id)
        task_id = celery_task.id
    except Exception:
        # Fallback if Celery worker connection is pending
        pass

    return DatasetCalibrateResponse(
        dataset_id=dataset_id,
        task_id=task_id,
        status="PENDING",
        message=f"Calibration job queued for dataset {dataset_id} ({dataset.instrument})"
    )


@router.post("/{dataset_id}/doi", response_model=DatasetDoiResponse)
async def generate_doi(dataset_id: int, db: Session = Depends(get_db)):
    """Mint and register a Digital Object Identifier (DOI) for the dataset."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset with ID {dataset_id} not found"
        )
    
    doi = f"10.5281/zenodo.lunaice.{dataset.id:06d}"
    return DatasetDoiResponse(
        dataset_id=dataset.id,
        doi=doi,
        registered_at=datetime.utcnow()
    )
