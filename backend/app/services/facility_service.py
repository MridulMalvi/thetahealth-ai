from typing import List, Optional
from app.repositories.facility_repo import facility_repository
from app.schemas.facility import (
    Facility,
    FacilityType,
    FacilityStatus,
    StateSummary,
    NetworkOverviewStats,
)

class FacilityService:
    def __init__(self, repo=facility_repository):
        self.repo = repo

    def get_facilities(
        self,
        state_id: Optional[str] = None,
        district_id: Optional[str] = None,
        facility_type: Optional[FacilityType] = None,
        status: Optional[FacilityStatus] = None,
        max_resilience: Optional[float] = None,
        search: Optional[str] = None,
    ) -> List[Facility]:
        return self.repo.list_facilities(
            state_id=state_id,
            district_id=district_id,
            facility_type=facility_type,
            status=status,
            max_resilience=max_resilience,
            search_query=search,
        )

    def get_facility_by_id(self, facility_id: str) -> Optional[Facility]:
        return self.repo.get_by_id(facility_id)

    def get_hierarchy_tree(self) -> List[StateSummary]:
        return self.repo.get_hierarchy()

    def get_network_overview(self) -> NetworkOverviewStats:
        return self.repo.get_overview_stats()

facility_service = FacilityService()
