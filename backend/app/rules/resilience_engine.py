from typing import Dict, Any, List
from app.schemas.supply_chain import ResourceBalanceStatus

class ResilienceEngine:
    def calculate_facility_resilience(
        self,
        days_of_supply: float,
        bed_occupancy_rate: float,
        staff_attendance_rate: float,
        is_surge: bool = False
    ) -> tuple[float, str, ResourceBalanceStatus]:
        """
        Calculates Resilience Score (0-100) and balance category.
        """
        # 1. Inventory component (weight: 35%)
        # Target: 15+ days = 100, 7 days = 70, <3 days = 20
        if days_of_supply >= 15:
            inv_score = 100.0
        elif days_of_supply >= 7:
            inv_score = 70.0 + ((days_of_supply - 7) / 8) * 30.0
        elif days_of_supply >= 3:
            inv_score = 40.0 + ((days_of_supply - 3) / 4) * 30.0
        else:
            inv_score = max(5.0, (days_of_supply / 3.0) * 40.0)

        # 2. Bed Buffer component (weight: 25%)
        # <70% occ = 100, 70-85% = 80, 85-95% = 50, >95% = 20
        if bed_occupancy_rate <= 70:
            bed_score = 100.0
        elif bed_occupancy_rate <= 85:
            bed_score = 80.0
        elif bed_occupancy_rate <= 95:
            bed_score = 50.0
        else:
            bed_score = 20.0

        # 3. Staff Attendance component (weight: 25%)
        staff_score = min(100.0, staff_attendance_rate)

        # 4. Route & Infrastructure (weight: 15%)
        route_score = 95.0

        # Raw weighted score
        raw_score = (
            (inv_score * 0.35) +
            (bed_score * 0.25) +
            (staff_score * 0.25) +
            (route_score * 0.15)
        )

        if is_surge:
            raw_score = max(10.0, raw_score - 15.0)

        final_score = round(raw_score, 1)

        # Classify Risk Level and Resource Balance Status
        if final_score >= 85:
            risk_level = "LOW"
            balance_status = ResourceBalanceStatus.SURPLUS if days_of_supply > 20 else ResourceBalanceStatus.NEUTRAL
        elif final_score >= 70:
            risk_level = "MODERATE"
            balance_status = ResourceBalanceStatus.NEUTRAL
        elif final_score >= 50:
            risk_level = "HIGH"
            balance_status = ResourceBalanceStatus.NEEDS_RESOURCE
        else:
            risk_level = "CRITICAL"
            balance_status = ResourceBalanceStatus.NEEDS_RESOURCE

        return final_score, risk_level, balance_status

resilience_engine = ResilienceEngine()
