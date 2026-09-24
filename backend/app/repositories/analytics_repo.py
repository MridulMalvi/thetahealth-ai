from typing import List, Dict, Any
from app.schemas.analytics import ConsumptionTrend, AnalyticsOverview

class AnalyticsRepository:
    def get_overview(self) -> AnalyticsOverview:
        return AnalyticsOverview(
            total_consumed_ytd=1420800,
            predicted_demand_next_14d=98500,
            model_accuracy_pct=94.2,
            active_anomalies_count=1,
            monitored_medicines_count=100,
            categories_trend=[
                ConsumptionTrend(
                    category="ANTIBIOTIC",
                    total_consumed_30d=48200,
                    growth_rate_pct=18.4,
                    seasonal_multiplier=1.45,
                ),
                ConsumptionTrend(
                    category="ANALGESIC",
                    total_consumed_30d=92000,
                    growth_rate_pct=6.2,
                    seasonal_multiplier=1.10,
                ),
                ConsumptionTrend(
                    category="IV_FLUIDS",
                    total_consumed_30d=34500,
                    growth_rate_pct=12.1,
                    seasonal_multiplier=1.25,
                ),
                ConsumptionTrend(
                    category="ANTIMALARIAL",
                    total_consumed_30d=14200,
                    growth_rate_pct=34.0,
                    seasonal_multiplier=1.85,
                ),
                ConsumptionTrend(
                    category="VACCINE",
                    total_consumed_30d=8900,
                    growth_rate_pct=-2.1,
                    seasonal_multiplier=0.98,
                ),
            ],
        )

analytics_repository = AnalyticsRepository()
