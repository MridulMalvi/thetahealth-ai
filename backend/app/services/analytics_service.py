from typing import Optional
from app.repositories.analytics_repo import analytics_repository
from app.ml.vertex_forecaster import vertex_forecaster
from app.schemas.analytics import (
    AnalyticsOverview,
    MedicineForecast,
    BedDemandForecast,
)

class AnalyticsService:
    def __init__(self, repo=analytics_repository, forecaster=vertex_forecaster):
        self.repo = repo
        self.forecaster = forecaster

    def get_overview(self) -> AnalyticsOverview:
        return self.repo.get_overview()

    def get_medicine_forecast(
        self,
        medicine_id: str = "MED-DOX-100",
        facility_id: str = "FAC-UP-MEE-003",
        horizon_days: int = 14
    ) -> MedicineForecast:
        return self.forecaster.generate_medicine_forecast(
            medicine_id=medicine_id,
            facility_id=facility_id,
            horizon_days=horizon_days
        )

    def get_bed_forecast(
        self,
        facility_id: str = "FAC-UP-MEE-001",
        horizon_hours: int = 72
    ) -> BedDemandForecast:
        return self.forecaster.generate_bed_forecast(
            facility_id=facility_id,
            horizon_hours=horizon_hours
        )

analytics_service = AnalyticsService()
