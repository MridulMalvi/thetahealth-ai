import math
from datetime import datetime, date, timedelta, timezone
from typing import List, Optional
from app.schemas.analytics import (
    MedicineForecast,
    ForecastPoint,
    HourlyBedForecastPoint,
    BedDemandForecast,
)

TODAY = date.today()

class VertexForecaster:
    def generate_medicine_forecast(
        self,
        medicine_id: str = "MED-DOX-100",
        facility_id: str = "FAC-UP-MEE-003",
        horizon_days: int = 14
    ) -> MedicineForecast:
        # Base parameters based on medicine ID
        is_doxy = "DOX" in medicine_id
        is_art = "ART" in medicine_id
        is_pcm = "PCM" in medicine_id
        is_saline = "IVF" in medicine_id

        if is_doxy:
            med_name = "Doxycycline 100mg Capsules"
            current_stock = 80
            base_burn = 38.0
            anomaly = True
            anomaly_reason = "Outbreak vector surge: Dengue vector season in Meerut district cluster (+68% vs baseline)"
            fac_name = "PHC Rampur"
        elif is_art:
            med_name = "Artesunate 60mg Injection"
            current_stock = 25
            base_burn = 5.5
            anomaly = False
            anomaly_reason = None
            fac_name = "PHC Rampur"
        elif is_pcm:
            med_name = "Paracetamol 500mg Tablets"
            current_stock = 650
            base_burn = 32.5
            anomaly = False
            anomaly_reason = None
            fac_name = "PHC Anandpur"
        else:
            med_name = "Normal Saline 0.9% IV Infusion"
            current_stock = 320
            base_burn = 22.0
            anomaly = False
            anomaly_reason = None
            fac_name = "District Hospital Meerut"

        # Generate 14 historical points
        historical_points: List[ForecastPoint] = []
        for i in range(14, 0, -1):
            past_date = TODAY - timedelta(days=i)
            # Day-of-week factor
            dow_factor = 1.2 if past_date.weekday() in [0, 4] else 0.95
            actual = round(base_burn * dow_factor * (1.0 + (math.sin(i) * 0.15)), 1)
            historical_points.append(
                ForecastPoint(
                    date=past_date.isoformat(),
                    predicted_quantity=actual,
                    p10_lower=round(actual * 0.85, 1),
                    p90_upper=round(actual * 1.15, 1),
                    actual_quantity=actual,
                )
            )

        # Generate future forecast points (7, 14, or 30 days)
        forecast_points: List[ForecastPoint] = []
        cumulative_consumption = 0.0

        for i in range(1, horizon_days + 1):
            future_date = TODAY + timedelta(days=i)
            growth_trend = 1.0 + (i * 0.02) if anomaly else 1.0
            p50 = round(base_burn * growth_trend * (1.0 + (math.cos(i) * 0.1)), 1)
            p10 = round(p50 * 0.82, 1)
            p90 = round(p50 * 1.22, 1)
            cumulative_consumption += p50

            forecast_points.append(
                ForecastPoint(
                    date=future_date.isoformat(),
                    predicted_quantity=p50,
                    p10_lower=p10,
                    p90_upper=p90,
                    actual_quantity=None,
                )
            )

        days_left = round(current_stock / base_burn, 1) if base_burn > 0 else 999.0
        stockout_date = (TODAY + timedelta(days=int(days_left))).isoformat() if days_left < horizon_days else None

        return MedicineForecast(
            medicine_id=medicine_id,
            medicine_name=med_name,
            facility_id=facility_id,
            facility_name=fac_name,
            horizon_days=horizon_days,
            current_stock=current_stock,
            predicted_burn_rate_daily=round(base_burn, 1),
            days_until_stockout=days_left,
            predicted_stockout_date=stockout_date,
            historical_points=historical_points,
            forecast_points=forecast_points,
            confidence_score=0.94,
            anomaly_detected=anomaly,
            anomaly_reason=anomaly_reason,
        )

    def generate_bed_forecast(
        self,
        facility_id: str = "FAC-UP-MEE-001",
        horizon_hours: int = 72
    ) -> BedDemandForecast:
        now = datetime.now(timezone.utc)
        points: List[HourlyBedForecastPoint] = []

        base_general = 142
        base_icu = 18
        base_emg = 14

        for h in range(1, horizon_hours + 1, 3):  # 3-hour intervals
            t = now + timedelta(hours=h)
            surge_mult = 1.0 + (math.sin(h / 12) * 0.15)
            gen = int(base_general * surge_mult)
            icu = int(base_icu * (1.0 + (h / 72 * 0.25)))  # upward ICU pressure
            emg = int(base_emg * surge_mult)

            points.append(
                HourlyBedForecastPoint(
                    timestamp=t.strftime("%b %d, %H:%M"),
                    general_beds_demand=gen,
                    icu_beds_demand=icu,
                    emergency_beds_demand=emg,
                    surge_risk_score=round(min(1.0, 0.65 + (h / 72 * 0.25)), 2),
                )
            )

        return BedDemandForecast(
            facility_id=facility_id,
            facility_name="District Hospital Meerut",
            horizon_hours=horizon_hours,
            points=points,
            peak_general_demand=max(p.general_beds_demand for p in points),
            peak_icu_demand=max(p.icu_beds_demand for p in points),
            icu_saturation_risk_pct=88.5,
        )

vertex_forecaster = VertexForecaster()
