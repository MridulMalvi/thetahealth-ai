from typing import List, Optional
from app.repositories.pharmacy_repo import pharmacy_repository
from app.schemas.pharmacy import (
    MedicineSKU,
    MedicineBatch,
    TherapeuticCategory,
    DispenseRequest,
    DispenseResult,
    ExpiryRiskReport,
)

class PharmacyService:
    def __init__(self, repo=pharmacy_repository):
        self.repo = repo

    def get_medicines(
        self,
        category: Optional[TherapeuticCategory] = None,
        search: Optional[str] = None,
        stock_status: Optional[str] = None
    ) -> List[MedicineSKU]:
        return self.repo.list_medicines(category=category, search=search, stock_status=stock_status)

    def get_medicine_by_id(self, medicine_id: str) -> Optional[MedicineSKU]:
        return self.repo.get_medicine_by_id(medicine_id)

    def get_fefo_batches(self, medicine_id: str, facility_id: Optional[str] = None) -> List[MedicineBatch]:
        return self.repo.get_batches(medicine_id=medicine_id, facility_id=facility_id)

    def get_expiry_risk_report(self, days_threshold: int = 30) -> ExpiryRiskReport:
        return self.repo.get_all_expiring_batches(days_threshold=days_threshold)

    def dispense_medicine(self, request: DispenseRequest, dispensed_by: str) -> DispenseResult:
        return self.repo.dispense_fefo(
            medicine_id=request.medicine_id,
            quantity=request.quantity,
            facility_id=request.facility_id,
            dispensed_by=dispensed_by
        )

pharmacy_service = PharmacyService()
