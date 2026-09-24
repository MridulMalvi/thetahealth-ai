from fastapi import APIRouter, Query, Depends
from typing import Optional
from app.schemas.analytics import (
    AnalyticsOverview,
    MedicineForecast,
    BedDemandForecast,
)
from app.services.analytics_service import analytics_service
from app.schemas.auth import UserProfile
from app.security.rbac import get_current_user

router = APIRouter()

@router.get("/overview", response_model=AnalyticsOverview, summary="Get Historical BigQuery Analytics Overview")
async def get_analytics_overview(current_user: UserProfile = Depends(get_current_user)):
    return analytics_service.get_overview()

@router.get("/forecasts/medicine", response_model=MedicineForecast, summary="Get Vertex AI AutoML Medicine Forecast")
async def get_medicine_forecast(
    medicine_id: str = Query("MED-DOX-100", description="Medicine SKU ID"),
    facility_id: str = Query("FAC-UP-MEE-003", description="Facility ID"),
    horizon_days: int = Query(14, ge=7, le=30, description="Forecast horizon in days (7, 14, 30)"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns time-series AutoML forecast with P10/P50/P90 confidence intervals and stockout predictions.
    """
    return analytics_service.get_medicine_forecast(
        medicine_id=medicine_id,
        facility_id=facility_id,
        horizon_days=horizon_days
    )

@router.get("/forecasts/beds", response_model=BedDemandForecast, summary="Get Vertex AI Bed & ICU Occupancy Forecast")
async def get_bed_forecast(
    facility_id: str = Query("FAC-UP-MEE-001", description="Facility ID"),
    horizon_hours: int = Query(72, ge=24, le=168, description="Forecast horizon in hours"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Returns 72-hour clinical bed and ICU capacity forecasts.
    """
    return analytics_service.get_bed_forecast(
        facility_id=facility_id,
        horizon_hours=horizon_hours
    )
