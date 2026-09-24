from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from app.schemas.pharmacy import (
    MedicineSKU,
    MedicineBatch,
    TherapeuticCategory,
    DispenseRequest,
    DispenseResult,
    ExpiryRiskReport,
)
from app.services.pharmacy_service import pharmacy_service
from app.schemas.auth import UserProfile
from app.security.rbac import get_current_user

router = APIRouter()

@router.get("/medicines", response_model=List[MedicineSKU], summary="List Medicine Catalog with Inventory Status")
async def list_medicines(
    category: Optional[TherapeuticCategory] = Query(None, description="Filter by therapeutic category"),
    stock_status: Optional[str] = Query(None, description="Filter by stock status: SAFE, REORDER_NEEDED, CRITICAL_STOCKOUT"),
    search: Optional[str] = Query(None, description="Search medicine name, generic name, SKU code"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns essential medicine inventory with real-time days-of-supply metrics.
    """
    return pharmacy_service.get_medicines(category=category, search=search, stock_status=stock_status)

@router.get("/medicines/{medicine_id}", response_model=MedicineSKU, summary="Get Medicine SKU Details")
async def get_medicine(
    medicine_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    medicine = pharmacy_service.get_medicine_by_id(medicine_id)
    if not medicine:
        raise HTTPException(status_code=404, detail=f"Medicine '{medicine_id}' not found.")
    return medicine

@router.get("/batches/{medicine_id}", response_model=List[MedicineBatch], summary="Get Batches in FEFO Order")
async def get_batches_fefo(
    medicine_id: str,
    facility_id: Optional[str] = Query(None, description="Filter by facility"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns batches sorted strictly by First-Expiry-First-Out (FEFO) rules.
    """
    return pharmacy_service.get_fefo_batches(medicine_id=medicine_id, facility_id=facility_id)

@router.get("/expiring", response_model=ExpiryRiskReport, summary="Get Expiring Batches Risk Report")
async def get_expiring_batches(
    days_threshold: int = Query(30, ge=7, le=180, description="Expiry warning threshold in days"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns at-risk medicine batches approaching or past expiry with financial loss estimate.
    """
    return pharmacy_service.get_expiry_risk_report(days_threshold=days_threshold)

@router.post("/dispense", response_model=DispenseResult, summary="Dispense Medicine with FEFO Allocation")
async def dispense_medicine(
    payload: DispenseRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Dispenses medication from the facility inventory using automated FEFO batch allocation.
    """
    try:
        return pharmacy_service.dispense_medicine(payload, dispensed_by=current_user.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
