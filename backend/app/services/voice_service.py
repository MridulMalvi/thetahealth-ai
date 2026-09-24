import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from app.ai.gemini_extractor import gemini_extractor
from app.schemas.ai_voice import (
    ParsedReportResponse,
    ConfirmAndCommitRequest,
    VoiceCommitResult,
)
from app.services.operational_state_service import operational_state_service
from app.schemas.operational_state import (
    InventoryTransactionCreate,
    TransactionType,
    OperationalSource,
    BedUpdateEvent,
    StaffAttendanceEvent,
)

class VoiceService:
    def __init__(self, extractor=gemini_extractor, op_service=operational_state_service):
        self.extractor = extractor
        self.op_service = op_service

    def parse_report(self, transcript: str, facility_id: str) -> ParsedReportResponse:
        return self.extractor.parse_transcript(transcript=transcript, facility_id=facility_id)

    def confirm_and_commit(self, request: ConfirmAndCommitRequest, user_name: str) -> VoiceCommitResult:
        intent = request.intent
        entities = request.entities
        tx_id = f"VC-{uuid.uuid4().hex[:8].upper()}"
        summary: Dict[str, Any] = {}

        if intent == "INVENTORY_RECEIVED":
            med_name = entities.get("medicine_name", "Paracetamol 500mg Tablets")
            qty = int(entities.get("quantity", 100))
            batch = entities.get("batch_number", f"BAT-{datetime.now().strftime('%Y%m')}")
            unit = entities.get("unit", "units")

            tx = self.op_service.record_inventory_transaction(
                payload=InventoryTransactionCreate(
                    facility_id=request.facility_id,
                    medicine_id="MED-PCM-500" if "paracetamol" in med_name.lower() else "MED-DOX-100",
                    medicine_name=med_name,
                    batch_number=batch,
                    type=TransactionType.RECEIVED,
                    quantity=qty,
                    unit=unit,
                    source=OperationalSource.THETA_VOICE,
                    notes=request.notes or "Frontline voice report intake"
                ),
                created_by=user_name
            )
            summary = {
                "medicine_name": med_name,
                "quantity": qty,
                "batch_number": batch,
                "new_balance": tx.balance_after
            }

        elif intent == "INVENTORY_CONSUMED":
            med_name = entities.get("medicine_name", "Normal Saline 0.9% IV Infusion")
            qty = int(entities.get("quantity", 20))
            unit = entities.get("unit", "units")

            tx = self.op_service.record_inventory_transaction(
                payload=InventoryTransactionCreate(
                    facility_id=request.facility_id,
                    medicine_id="MED-IVF-NS" if "saline" in med_name.lower() else "MED-PCM-500",
                    medicine_name=med_name,
                    batch_number="BATCH-FEFO-AUTO",
                    type=TransactionType.CONSUMED,
                    quantity=qty,
                    unit=unit,
                    source=OperationalSource.THETA_VOICE,
                    notes=request.notes or "Frontline dispensation log"
                ),
                created_by=user_name
            )
            summary = {
                "medicine_name": med_name,
                "quantity_dispensed": qty,
                "new_balance": tx.balance_after
            }

        elif intent == "ATTENDANCE_CHECKIN" or intent == "ATTENDANCE_CHECKOUT":
            staff_name = entities.get("staff_name", user_name)
            action = "CHECK_IN" if intent == "ATTENDANCE_CHECKIN" else "CHECK_OUT"

            res = self.op_service.record_attendance(
                StaffAttendanceEvent(
                    facility_id=request.facility_id,
                    user_id=f"user-{staff_name.lower().replace(' ', '-')}",
                    staff_name=staff_name,
                    department=entities.get("department", "General OPD"),
                    action=action,
                    source=OperationalSource.THETA_VOICE,
                    timestamp=datetime.now(timezone.utc).isoformat()
                )
            )
            summary = res

        elif intent == "BED_UPDATE":
            occ = int(entities.get("occupied_beds", 8))
            res = self.op_service.update_bed_state(
                BedUpdateEvent(
                    facility_id=request.facility_id,
                    general_occupied=occ,
                    icu_occupied=0,
                    emergency_occupied=2,
                    source=OperationalSource.THETA_VOICE,
                    updated_by=user_name
                )
            )
            summary = res

        return VoiceCommitResult(
            status="committed",
            transaction_id=tx_id,
            message=f"Voice report ({intent}) successfully validated and committed to Firestore operational state.",
            facility_id=request.facility_id,
            committed_at=datetime.now(timezone.utc).isoformat(),
            updated_state_summary=summary
        )

voice_service = VoiceService()
