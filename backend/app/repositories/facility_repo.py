from typing import List, Optional, Dict
from datetime import datetime, timezone
from app.schemas.facility import (
    Facility,
    FacilityType,
    FacilityStatus,
    GeoCoordinates,
    BedStats,
    StaffStats,
    InventorySummary,
    DigitalTwinState,
    StateSummary,
    DistrictSummary,
    NetworkOverviewStats,
)

# Deterministic Seed Dataset for Facility Network & Digital Twins
SYNTHETIC_FACILITIES: List[Facility] = [
    Facility(
        id="FAC-UP-MEE-001",
        name="District Hospital Meerut",
        code="DH-MEE-01",
        type=FacilityType.HOSPITAL,
        status=FacilityStatus.OPERATIONAL,
        state_id="ST-UP",
        state_name="Uttar Pradesh",
        district_id="DIST-MEE",
        district_name="Meerut",
        pincode="250001",
        address="Civil Lines, Meerut, UP",
        contact_phone="+91-121-2640101",
        coordinates=GeoCoordinates(latitude=28.9845, longitude=77.7064),
        digital_twin=DigitalTwinState(
            resilience_score=91.5,
            risk_level="LOW",
            patient_footfall_today=620,
            patient_footfall_predicted_tomorrow=680,
            beds=BedStats(
                general_total=180,
                general_occupied=142,
                icu_total=25,
                icu_occupied=18,
                emergency_total=20,
                emergency_occupied=14,
            ),
            staff=StaffStats(
                doctors_on_duty=28,
                nurses_on_duty=64,
                pharmacists_on_duty=6,
                support_staff_on_duty=32,
                expected_staff_total=135,
                actual_staff_total=130,
            ),
            inventory=InventorySummary(
                total_skus=148,
                critical_stockouts_count=0,
                expiring_in_30d_count=4,
                days_of_supply_avg=21.4,
                reorder_required_count=2,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-UP-MEE-002",
        name="PHC Anandpur",
        code="PHC-AND-01",
        type=FacilityType.PHC,
        status=FacilityStatus.OPERATIONAL,
        state_id="ST-UP",
        state_name="Uttar Pradesh",
        district_id="DIST-MEE",
        district_name="Meerut",
        pincode="250004",
        address="Village Anandpur, Block Daurala, Meerut",
        contact_phone="+91-98765-43210",
        coordinates=GeoCoordinates(latitude=29.0412, longitude=77.6890),
        digital_twin=DigitalTwinState(
            resilience_score=88.2,
            risk_level="LOW",
            patient_footfall_today=85,
            patient_footfall_predicted_tomorrow=95,
            beds=BedStats(
                general_total=10,
                general_occupied=4,
                icu_total=0,
                icu_occupied=0,
                emergency_total=2,
                emergency_occupied=1,
            ),
            staff=StaffStats(
                doctors_on_duty=2,
                nurses_on_duty=4,
                pharmacists_on_duty=1,
                support_staff_on_duty=3,
                expected_staff_total=10,
                actual_staff_total=10,
            ),
            inventory=InventorySummary(
                total_skus=42,
                critical_stockouts_count=0,
                expiring_in_30d_count=1,
                days_of_supply_avg=14.8,
                reorder_required_count=1,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-UP-MEE-003",
        name="PHC Rampur",
        code="PHC-RAM-01",
        type=FacilityType.PHC,
        status=FacilityStatus.SURGE,
        state_id="ST-UP",
        state_name="Uttar Pradesh",
        district_id="DIST-MEE",
        district_name="Meerut",
        pincode="250102",
        address="Rural Sector 4, Rampur Sub-district, Meerut",
        contact_phone="+91-98765-11223",
        coordinates=GeoCoordinates(latitude=28.9100, longitude=77.7400),
        digital_twin=DigitalTwinState(
            resilience_score=64.0,
            risk_level="HIGH",
            patient_footfall_today=145,
            patient_footfall_predicted_tomorrow=190,
            beds=BedStats(
                general_total=12,
                general_occupied=11,
                icu_total=0,
                icu_occupied=0,
                emergency_total=3,
                emergency_occupied=3,
            ),
            staff=StaffStats(
                doctors_on_duty=1,
                nurses_on_duty=3,
                pharmacists_on_duty=1,
                support_staff_on_duty=2,
                expected_staff_total=8,
                actual_staff_total=7,
            ),
            inventory=InventorySummary(
                total_skus=38,
                critical_stockouts_count=2,
                expiring_in_30d_count=0,
                days_of_supply_avg=2.1,
                reorder_required_count=4,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-UP-LKO-001",
        name="Central Medical Warehouse Lucknow",
        code="WH-LKO-01",
        type=FacilityType.WAREHOUSE,
        status=FacilityStatus.OPERATIONAL,
        state_id="ST-UP",
        state_name="Uttar Pradesh",
        district_id="DIST-LKO",
        district_name="Lucknow",
        pincode="226001",
        address="Transport Nagar, Sector B, Lucknow",
        contact_phone="+91-522-2430000",
        coordinates=GeoCoordinates(latitude=26.8467, longitude=80.9462),
        digital_twin=DigitalTwinState(
            resilience_score=98.0,
            risk_level="LOW",
            patient_footfall_today=0,
            patient_footfall_predicted_tomorrow=0,
            beds=BedStats(
                general_total=0,
                general_occupied=0,
                icu_total=0,
                icu_occupied=0,
                emergency_total=0,
                emergency_occupied=0,
            ),
            staff=StaffStats(
                doctors_on_duty=0,
                nurses_on_duty=0,
                pharmacists_on_duty=8,
                support_staff_on_duty=24,
                expected_staff_total=35,
                actual_staff_total=32,
            ),
            inventory=InventorySummary(
                total_skus=320,
                critical_stockouts_count=0,
                expiring_in_30d_count=8,
                days_of_supply_avg=45.0,
                reorder_required_count=0,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-DL-CEN-001",
        name="All India Institute of Medical Sciences (AIIMS)",
        code="AIIMS-DEL-01",
        type=FacilityType.HOSPITAL,
        status=FacilityStatus.OPERATIONAL,
        state_id="ST-DL",
        state_name="Delhi",
        district_id="DIST-DL-CEN",
        district_name="Central Delhi",
        pincode="110029",
        address="Sri Aurobindo Marg, Ansari Nagar, New Delhi",
        contact_phone="+91-11-26588500",
        coordinates=GeoCoordinates(latitude=28.5672, longitude=77.2100),
        digital_twin=DigitalTwinState(
            resilience_score=96.4,
            risk_level="LOW",
            patient_footfall_today=2450,
            patient_footfall_predicted_tomorrow=2600,
            beds=BedStats(
                general_total=1800,
                general_occupied=1650,
                icu_total=240,
                icu_occupied=218,
                emergency_total=120,
                emergency_occupied=98,
            ),
            staff=StaffStats(
                doctors_on_duty=320,
                nurses_on_duty=780,
                pharmacists_on_duty=45,
                support_staff_on_duty=410,
                expected_staff_total=1600,
                actual_staff_total=1555,
            ),
            inventory=InventorySummary(
                total_skus=480,
                critical_stockouts_count=0,
                expiring_in_30d_count=12,
                days_of_supply_avg=28.6,
                reorder_required_count=5,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-MH-MUM-001",
        name="King Edward Memorial Hospital Mumbai",
        code="KEM-MUM-01",
        type=FacilityType.HOSPITAL,
        status=FacilityStatus.SURGE,
        state_id="ST-MH",
        state_name="Maharashtra",
        district_id="DIST-MH-MUM",
        district_name="Mumbai City",
        pincode="400012",
        address="Acharya Donde Marg, Parel, Mumbai",
        contact_phone="+91-22-24107000",
        coordinates=GeoCoordinates(latitude=19.0016, longitude=72.8427),
        digital_twin=DigitalTwinState(
            resilience_score=78.5,
            risk_level="MODERATE",
            patient_footfall_today=1820,
            patient_footfall_predicted_tomorrow=1950,
            beds=BedStats(
                general_total=1200,
                general_occupied=1120,
                icu_total=150,
                icu_occupied=146,
                emergency_total=80,
                emergency_occupied=76,
            ),
            staff=StaffStats(
                doctors_on_duty=180,
                nurses_on_duty=420,
                pharmacists_on_duty=22,
                support_staff_on_duty=210,
                expected_staff_total=850,
                actual_staff_total=832,
            ),
            inventory=InventorySummary(
                total_skus=360,
                critical_stockouts_count=1,
                expiring_in_30d_count=7,
                days_of_supply_avg=12.4,
                reorder_required_count=8,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-KA-BLR-001",
        name="Victoria Hospital Bangalore",
        code="VIC-BLR-01",
        type=FacilityType.HOSPITAL,
        status=FacilityStatus.OPERATIONAL,
        state_id="ST-KA",
        state_name="Karnataka",
        district_id="DIST-KA-BLR",
        district_name="Bengaluru Urban",
        pincode="560002",
        address="Fort Road, near City Market, Bengaluru",
        contact_phone="+91-80-26701150",
        coordinates=GeoCoordinates(latitude=12.9644, longitude=77.5768),
        digital_twin=DigitalTwinState(
            resilience_score=92.8,
            risk_level="LOW",
            patient_footfall_today=1240,
            patient_footfall_predicted_tomorrow=1300,
            beds=BedStats(
                general_total=850,
                general_occupied=680,
                icu_total=90,
                icu_occupied=72,
                emergency_total=50,
                emergency_occupied=38,
            ),
            staff=StaffStats(
                doctors_on_duty=115,
                nurses_on_duty=280,
                pharmacists_on_duty=16,
                support_staff_on_duty=140,
                expected_staff_total=570,
                actual_staff_total=551,
            ),
            inventory=InventorySummary(
                total_skus=290,
                critical_stockouts_count=0,
                expiring_in_30d_count=3,
                days_of_supply_avg=24.0,
                reorder_required_count=2,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
    Facility(
        id="FAC-TN-CHE-001",
        name="Rajiv Gandhi Government General Hospital Chennai",
        code="RGGGH-CHE-01",
        type=FacilityType.HOSPITAL,
        status=FacilityStatus.OPERATIONAL,
        state_id="ST-TN",
        state_name="Tamil Nadu",
        district_id="DIST-TN-CHE",
        district_name="Chennai",
        pincode="600003",
        address="EVR Periyar Salai, Park Town, Chennai",
        contact_phone="+91-44-25305000",
        coordinates=GeoCoordinates(latitude=13.0827, longitude=80.2707),
        digital_twin=DigitalTwinState(
            resilience_score=95.1,
            risk_level="LOW",
            patient_footfall_today=1950,
            patient_footfall_predicted_tomorrow=2050,
            beds=BedStats(
                general_total=1400,
                general_occupied=1180,
                icu_total=160,
                icu_occupied=130,
                emergency_total=90,
                emergency_occupied=65,
            ),
            staff=StaffStats(
                doctors_on_duty=210,
                nurses_on_duty=520,
                pharmacists_on_duty=28,
                support_staff_on_duty=290,
                expected_staff_total=1080,
                actual_staff_total=1048,
            ),
            inventory=InventorySummary(
                total_skus=410,
                critical_stockouts_count=0,
                expiring_in_30d_count=5,
                days_of_supply_avg=26.5,
                reorder_required_count=3,
            ),
            last_sync_timestamp=datetime.now(timezone.utc).isoformat(),
        ),
    ),
]

class FacilityRepository:
    def __init__(self):
        self._facilities: Dict[str, Facility] = {f.id: f for f in SYNTHETIC_FACILITIES}

    def list_facilities(
        self,
        state_id: Optional[str] = None,
        district_id: Optional[str] = None,
        facility_type: Optional[FacilityType] = None,
        status: Optional[FacilityStatus] = None,
        max_resilience: Optional[float] = None,
        search_query: Optional[str] = None,
    ) -> List[Facility]:
        results = list(self._facilities.values())

        if state_id:
            results = [f for f in results if f.state_id == state_id]
        if district_id:
            results = [f for f in results if f.district_id == district_id]
        if facility_type:
            results = [f for f in results if f.type == facility_type]
        if status:
            results = [f for f in results if f.status == status]
        if max_resilience is not None:
            results = [f for f in results if f.digital_twin.resilience_score <= max_resilience]
        if search_query:
            q = search_query.lower()
            results = [
                f for f in results
                if q in f.name.lower() or q in f.code.lower() or q in f.district_name.lower() or q in f.state_name.lower()
            ]

        return results

    def get_by_id(self, facility_id: str) -> Optional[Facility]:
        return self._facilities.get(facility_id)

    def get_hierarchy(self) -> List[StateSummary]:
        state_map: Dict[str, StateSummary] = {}
        district_map: Dict[str, DistrictSummary] = {}

        for f in self._facilities.values():
            if f.state_id not in state_map:
                state_map[f.state_id] = StateSummary(
                    state_id=f.state_id,
                    state_name=f.state_name,
                    total_districts=0,
                    total_facilities=0,
                    districts=[]
                )
            state_map[f.state_id].total_facilities += 1

            if f.district_id not in district_map:
                district_map[f.district_id] = DistrictSummary(
                    district_id=f.district_id,
                    district_name=f.district_name,
                    state_id=f.state_id,
                    total_facilities=0,
                    total_hospitals=0,
                    total_phcs=0,
                    avg_resilience_score=0.0
                )
            d = district_map[f.district_id]
            d.total_facilities += 1
            if f.type == FacilityType.HOSPITAL:
                d.total_hospitals += 1
            elif f.type == FacilityType.PHC:
                d.total_phcs += 1

        for d in district_map.values():
            if d.state_id in state_map:
                state_map[d.state_id].districts.append(d)
                state_map[d.state_id].total_districts = len(state_map[d.state_id].districts)

        return list(state_map.values())

    def get_overview_stats(self) -> NetworkOverviewStats:
        all_f = list(self._facilities.values())
        tot_beds = sum(f.digital_twin.beds.total_beds for f in all_f)
        occ_beds = sum(f.digital_twin.beds.total_occupied for f in all_f)
        avg_res = round(sum(f.digital_twin.resilience_score for f in all_f) / len(all_f), 1) if all_f else 0.0
        avg_occ = round((occ_beds / tot_beds) * 100, 1) if tot_beds > 0 else 0.0

        return NetworkOverviewStats(
            total_states=10,
            total_districts=50,
            total_facilities=400,
            total_hospitals=100,
            total_phcs=300,
            total_warehouses=15,
            total_beds=tot_beds,
            total_beds_occupied=occ_beds,
            average_occupancy_rate=avg_occ,
            average_resilience_score=avg_res,
            facilities_with_stockout_risk=sum(1 for f in all_f if f.digital_twin.inventory.critical_stockouts_count > 0),
            facilities_in_emergency=sum(1 for f in all_f if f.status in [FacilityStatus.SURGE, FacilityStatus.EMERGENCY])
        )

facility_repository = FacilityRepository()
