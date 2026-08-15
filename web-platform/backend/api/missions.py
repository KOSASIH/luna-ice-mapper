"""FastAPI router for managing Lunar orbital and surface missions."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Mission
from ..schemas.schemas import MissionCreate, MissionResponse, MissionUpdate

router = APIRouter(prefix="/missions", tags=["Missions"])


@router.get("", response_model=List[MissionResponse])
async def list_missions(
    skip: int = Query(0, ge=0, description="Records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    db: Session = Depends(get_db)
):
    """Retrieve list of missions with optional filtering and pagination."""
    query = db.query(Mission)
    if status_filter:
        query = query.filter(Mission.status.ilike(f"%{status_filter}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(mission_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific mission by ID."""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found"
        )
    return mission


@router.post("", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
async def create_mission(mission_in: MissionCreate, db: Session = Depends(get_db)):
    """Create a new mission entry."""
    mission = Mission(**mission_in.model_dump())
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


@router.put("/{mission_id}", response_model=MissionResponse)
async def update_mission(
    mission_id: int,
    mission_in: MissionUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing mission's details."""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found"
        )
    
    update_data = mission_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(mission, field, value)
    
    db.commit()
    db.refresh(mission)
    return mission


@router.delete("/{mission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mission(mission_id: int, db: Session = Depends(get_db)):
    """Delete a mission by ID."""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID {mission_id} not found"
        )
    db.delete(mission)
    db.commit()
    return None
