from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ForecastPoint(BaseModel):
    date: str
    predicted_quantity: float
    p10_lower: float
    p90_upper: float
    actual_quantity: Optional[float] = None

class MedicineForecast(BaseModel):
    medicine_id: str
    medicine_name: str
    facility_id: str
    facility_name: str
    horizon_days: int
    current_stock: int
    predicted_burn_rate_daily: float
    days_until_stockout: float
    predicted_stockout_date: Optional[str]
    forecast_points: List[ForecastPoint]
    historical_points: List[ForecastPoint]
    confidence_score: float
    anomaly_detected: bool = False
    anomaly_reason: Optional[str] = None

class HourlyBedForecastPoint(BaseModel):
    timestamp: str
    general_beds_demand: int
    icu_beds_demand: int
    emergency_beds_demand: int
    surge_risk_score: float

class BedDemandForecast(BaseModel):
    facility_id: str
    facility_name: str
    horizon_hours: int = 72
    points: List[HourlyBedForecastPoint]
    peak_general_demand: int
    peak_icu_demand: int
    icu_saturation_risk_pct: float

class ConsumptionTrend(BaseModel):
    category: str
    total_consumed_30d: int
    growth_rate_pct: float
    seasonal_multiplier: float

class AnalyticsOverview(BaseModel):
    total_consumed_ytd: int
    predicted_demand_next_14d: int
    model_accuracy_pct: float
    active_anomalies_count: int
    monitored_medicines_count: int
    categories_trend: List[ConsumptionTrend]
