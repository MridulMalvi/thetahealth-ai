from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.operational_state import (
    InventoryTransaction,
    InventoryTransactionCreate,
    BedUpdateEvent,
    StaffAttendanceEvent,
    OperationalAlert,
)
from app.services.operational_state_service import operational_state_service
from app.schemas.auth import UserProfile
from app.security.rbac import get_current_user

router = APIRouter()

@router.post("/inventory/transactions", response_model=InventoryTransaction, summary="Record Inventory Transaction")
async def record_inventory_transaction(
    payload: InventoryTransactionCreate,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Records an inventory mutation event (consumption, receipt, transfer) in Firestore
    and dynamically updates facility Digital Twin operational state.
    """
    return operational_state_service.record_inventory_transaction(
        payload=payload,
        created_by=current_user.name
    )

@router.get("/inventory/transactions", response_model=List[InventoryTransaction], summary="List Recent Operational Transactions")
async def get_recent_transactions(
    facility_id: Optional[str] = Query(None, description="Optional facility ID filter"),
    limit: int = Query(20, ge=1, le=100),
    current_user: UserProfile = Depends(get_current_user)
):
    return operational_state_service.get_recent_transactions(facility_id=facility_id)

@router.post("/beds/update", summary="Update Facility Bed Occupancy")
async def update_bed_occupancy(
    payload: BedUpdateEvent,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Updates live bed occupancy counts and evaluates threshold surge alerts.
    """
    payload.updated_by = current_user.name
    return operational_state_service.update_bed_state(payload)

@router.post("/attendance/log", summary="Log Staff Attendance Event")
async def log_staff_attendance(
    payload: StaffAttendanceEvent,
    current_user: UserProfile = Depends(get_current_user)
):
    return operational_state_service.record_attendance(payload)

@router.get("/alerts", response_model=List[OperationalAlert], summary="Get Live System Alerts")
async def get_live_alerts(
    facility_id: Optional[str] = Query(None, description="Filter by facility"),
    current_user: UserProfile = Depends(get_current_user)
):
    return operational_state_service.get_live_alerts(facility_id=facility_id)
