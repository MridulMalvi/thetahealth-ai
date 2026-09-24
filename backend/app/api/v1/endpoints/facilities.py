from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from app.schemas.facility import (
    Facility,
    FacilityType,
    FacilityStatus,
    StateSummary,
    NetworkOverviewStats,
)
from app.services.facility_service import facility_service
from app.schemas.auth import UserProfile
from app.security.rbac import get_current_user

router = APIRouter()

@router.get("", response_model=List[Facility], summary="List Healthcare Facilities with Filters")
async def list_facilities(
    state_id: Optional[str] = Query(None, description="Filter by State ID"),
    district_id: Optional[str] = Query(None, description="Filter by District ID"),
    facility_type: Optional[FacilityType] = Query(None, description="Filter by facility type"),
    status: Optional[FacilityStatus] = Query(None, description="Filter by facility status"),
    max_resilience: Optional[float] = Query(None, description="Filter facilities with resilience <= value"),
    search: Optional[str] = Query(None, description="Search by name, district, code"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns list of healthcare facilities with their real-time Digital Twin state.
    """
    return facility_service.get_facilities(
        state_id=state_id,
        district_id=district_id,
        facility_type=facility_type,
        status=status,
        max_resilience=max_resilience,
        search=search,
    )

@router.get("/stats/overview", response_model=NetworkOverviewStats, summary="Get National Network Overview Stats")
async def get_network_overview_stats(current_user: UserProfile = Depends(get_current_user)):
    """
    Returns aggregate national telemetry (total beds, occupancy, resilience index).
    """
    return facility_service.get_network_overview()

@router.get("/hierarchy/tree", response_model=List[StateSummary], summary="Get Geographical Hierarchy Tree")
async def get_geographical_hierarchy(current_user: UserProfile = Depends(get_current_user)):
    """
    Returns nested Country -> State -> District facility counts.
    """
    return facility_service.get_hierarchy_tree()

@router.get("/{facility_id}", response_model=Facility, summary="Get Facility Digital Twin by ID")
async def get_facility_digital_twin(
    facility_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns real-time digital twin state for a specific facility.
    """
    facility = facility_service.get_facility_by_id(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail=f"Facility '{facility_id}' not found.")
    return facility
