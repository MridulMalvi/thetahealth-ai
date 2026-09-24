export interface ForecastPoint {
  date: string
  predicted_quantity: number
  p10_lower: number
  p90_upper: number
  actual_quantity?: number | null
}

export interface MedicineForecast {
  medicine_id: string
  medicine_name: string
  facility_id: string
  facility_name: string
  horizon_days: number
  current_stock: number
  predicted_burn_rate_daily: number
  days_until_stockout: number
  predicted_stockout_date?: string | null
  forecast_points: ForecastPoint[]
  historical_points: ForecastPoint[]
  confidence_score: number
  anomaly_detected: boolean
  anomaly_reason?: string | null
}

export interface HourlyBedForecastPoint {
  timestamp: string
  general_beds_demand: number
  icu_beds_demand: number
  emergency_beds_demand: number
  surge_risk_score: number
}

export interface BedDemandForecast {
  facility_id: string
  facility_name: string
  horizon_hours: number
  points: HourlyBedForecastPoint[]
  peak_general_demand: number
  peak_icu_demand: number
  icu_saturation_risk_pct: number
}

export interface ConsumptionTrend {
  category: string
  total_consumed_30d: number
  growth_rate_pct: number
  seasonal_multiplier: number
}

export interface AnalyticsOverview {
  total_consumed_ytd: number
  predicted_demand_next_14d: number
  model_accuracy_pct: number
  active_anomalies_count: number
  monitored_medicines_count: number
  categories_trend: ConsumptionTrend[]
}
