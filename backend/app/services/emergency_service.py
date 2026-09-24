from typing import List, Optional, Dict, Any
from datetime import datetime
from app.schemas.emergency import EmergencyDeclaration, EmergencyAction

class EmergencyService:
    def __init__(self):
        self._active_declaration = EmergencyDeclaration(
            emergency_id="EMG-2026-DENGUE-01",
            title="Dengue Fever Surge Protocol",
            type="DENGUE_OUTBREAK",
            status="ACTIVE",
            severity="CRITICAL",
            affected_state="Kerala",
            affected_district="Ernakulam",
            affected_facilities_count=12,
            affected_facilities=[
                "District Hospital Ernakulam",
                "General Hospital Aluva",
                "Taluk Hospital Paravur",
                "Taluk Hospital Muvattupuzha",
                "Community Health Centre Vengola",
                "Community Health Centre Kothamangalam",
                "Primary Health Centre Kalady",
                "Primary Health Centre Edathala",
                "Primary Health Centre Kumbalangi",
                "Primary Health Centre Mulavukad",
                "Urban Primary Health Centre Fort Kochi",
                "Urban Primary Health Centre Kakkanad"
            ],
            declared_at=datetime.utcnow().isoformat() + "Z",
            declared_by="Dr. Ananya Nair (District Medical Officer)",
            surge_multiplier=1.85,
            priority_medicines=[
                "MED-001 (Paracetamol 500mg)",
                "MED-002 (Amoxicillin 500mg)",
                "MED-004 (ORS Packets)",
                "MED-005 (IV Normal Saline 500ml)",
                "MED-006 (Dengue NS1 Antigen Rapid Kit)",
                "MED-008 (Platelet Concentrates)"
            ],
            containment_progress_pct=68.0,
            patient_cases_total=438,
            emergency_beds_allocated=84,
            active_actions=[
                EmergencyAction(
                    action_id="ACT-01",
                    title="Activate 24/7 Mobile Dengue Triage Units",
                    category="TRIAGE",
                    status="COMPLETED",
                    assigned_team="Rapid Action Medical Wing 4",
                    impact_summary="3 mobile triage vans deployed to Kalady and Vengola PHCs"
                ),
                EmergencyAction(
                    action_id="ACT-02",
                    title="Commandeered Central Buffer Stock of IV Saline (1,500 units)",
                    category="SUPPLY_CHAIN",
                    status="COMPLETED",
                    assigned_team="State Medical Logistics Hub",
                    impact_summary="IV Fluids redistributed to DH Ernakulam & GH Aluva"
                ),
                EmergencyAction(
                    action_id="ACT-03",
                    title="Emergency Platelet Stock Pooling from Kottayam Regional Blood Bank",
                    category="BLOOD_BANK",
                    status="IN_PROGRESS",
                    assigned_team="District Transfusion Service",
                    impact_summary="35 units en route to Taluk Hospital Paravur"
                ),
                EmergencyAction(
                    action_id="ACT-04",
                    title="Expand Surge Inpatient Capacity by 30 Beds at General Hospital Aluva",
                    category="BED_SURGE",
                    status="PENDING_APPROVAL",
                    assigned_team="Hospital Facilities Administration",
                    impact_summary="Requires conversion of Day Care Ward to Step-Down Isolation"
                )
            ]
        )

    def get_active_emergency(self) -> Optional[EmergencyDeclaration]:
        return self._active_declaration

    def execute_action(self, action_id: str) -> Optional[EmergencyAction]:
        for action in self._active_declaration.active_actions:
            if action.action_id == action_id:
                action.status = "COMPLETED"
                # Update progress
                completed_count = sum(1 for a in self._active_declaration.active_actions if a.status == "COMPLETED")
                self._active_declaration.containment_progress_pct = round((completed_count / len(self._active_declaration.active_actions)) * 100, 1)
                return action
        return None

emergency_service = EmergencyService()
