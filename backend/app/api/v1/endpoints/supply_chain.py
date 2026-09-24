from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.supply_chain import (
    SupplyChainSummary,
    TransferRecommendation,
    FacilityResourceBalance,
    Shipment,
)
from app.services.redistribution_service import redistribution_service
from app.schemas.auth import UserProfile
from app.security.rbac import get_current_user

router = APIRouter()

@router.get("/summary", response_model=SupplyChainSummary, summary="Get Full Supply Chain Summary")
async def get_supply_chain_summary(current_user: UserProfile = Depends(get_current_user)):
    return redistribution_service.get_summary()

@router.get("/recommendations", response_model=List[TransferRecommendation], summary="List AI Redistribution Recommendations")
async def list_recommendations(current_user: UserProfile = Depends(get_current_user)):
    return redistribution_service.get_summary().recommendations

@router.post("/recommendations/{recommendation_id}/approve", response_model=TransferRecommendation, summary="Approve Transfer Recommendation")
async def approve_transfer_recommendation(
    recommendation_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Human Authorization Gate: Approves AI-generated transfer, dispatches shipment,
    and updates recipient inventory buffer.
    """
    rec = redistribution_service.approve_recommendation(
        recommendation_id=recommendation_id,
        decided_by=current_user.name
    )
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return rec

@router.post("/recommendations/{recommendation_id}/reject", response_model=TransferRecommendation, summary="Reject Transfer Recommendation")
async def reject_transfer_recommendation(
    recommendation_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    rec = redistribution_service.reject_recommendation(
        recommendation_id=recommendation_id,
        decided_by=current_user.name
    )
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return rec

@router.get("/balances", response_model=List[FacilityResourceBalance], summary="Get Surplus/Deficit Node Balances")
async def get_facility_balances(current_user: UserProfile = Depends(get_current_user)):
    return redistribution_service.get_facility_balances()
