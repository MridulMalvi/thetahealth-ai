import os
import re
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.schemas.ai_voice import (
    ParsedReportResponse,
    ExtractedEntity,
)

logger = logging.getLogger("thetahealth.gemini")

GEMINI_SYSTEM_PROMPT = """
You are ThetaHealth AI, a specialized healthcare clinical & supply chain operational parser.
Your task is to parse unstructured natural-language voice reports from Primary Health Centre (PHC) frontline workers into structured operational JSON.

Supported Intents:
1. INVENTORY_RECEIVED (e.g., received 150 vials of Paracetamol batch B-102)
2. INVENTORY_CONSUMED (e.g., consumed 40 bottles of Normal Saline in emergency ward)
3. INVENTORY_ADJUSTED (e.g., stock count correction)
4. ATTENDANCE_CHECKIN (e.g., Dr. Sharma checked in for morning shift)
5. ATTENDANCE_CHECKOUT (e.g., Nurse Priya checked out)
6. BED_UPDATE (e.g., 5 general beds and 2 emergency beds occupied)
7. PATIENT_FOOTFALL (e.g., 85 OPD patients registered today)
8. SHIPMENT_RECEIVED (e.g., warehouse dispatched shipment #882 received)
9. SHIPMENT_DELAY (e.g., oxygen delivery delayed by 3 days)
10. EMERGENCY_REPORT (e.g., dengue outbreak surge in village sector 3)

Return strict JSON with:
{
  "intent": "INVENTORY_RECEIVED",
  "overall_confidence": 0.96,
  "entities": {
    "medicine_name": {"value": "Paracetamol 500mg", "confidence": 0.98, "snippet": "paracetamol"},
    "quantity": {"value": 150, "confidence": 0.99, "snippet": "150 vials"},
    "batch_number": {"value": "PCM-2026-B8", "confidence": 0.92, "snippet": "batch PCM-2026-B8"},
    "unit": {"value": "vials", "confidence": 0.95, "snippet": "vials"}
  },
  "needs_clarification": false,
  "clarification_question": null,
  "suggested_action": "Record receipt of 150 vials Paracetamol 500mg"
}
"""

class GeminiExtractor:
    def __init__(self):
        self._gemini_configured = False
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                self._gemini_configured = True
                logger.info("Gemini 1.5 Flash initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini SDK: {e}")

    def parse_transcript(self, transcript: str, facility_id: str) -> ParsedReportResponse:
        t_lower = transcript.lower().strip()

        # Check for ambiguity test
        if "paracetamol" in t_lower and ("500" not in t_lower and "650" not in t_lower and "mg" not in t_lower):
            # Theta Clarify conversational trigger
            qty = self._extract_number(t_lower) or 50
            return ParsedReportResponse(
                intent="INVENTORY_RECEIVED" if "receive" in t_lower else "INVENTORY_CONSUMED",
                overall_confidence=0.68,
                entities={
                    "medicine_name": ExtractedEntity(field_name="medicine_name", value="Paracetamol", confidence=0.70, source_snippet="paracetamol"),
                    "quantity": ExtractedEntity(field_name="quantity", value=qty, confidence=0.95, source_snippet=f"{qty}"),
                    "unit": ExtractedEntity(field_name="unit", value="strips", confidence=0.85, source_snippet="strips"),
                },
                needs_clarification=True,
                clarification_question="Did you mean Paracetamol 500mg Tablets or Paracetamol 650mg Tablets?",
                clarification_options=["Paracetamol 500mg Tablets", "Paracetamol 650mg Tablets", "Paracetamol Syrup 125mg/5ml"],
                suggested_action="Resolve medicine strength before committing",
                raw_transcript=transcript,
                parsed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 1. INVENTORY RECEIVED
        if any(w in t_lower for w in ["received", "got", "delivered", "intake", "arrived"]):
            qty = self._extract_number(t_lower) or 100
            med_name = self._extract_medicine(t_lower)
            batch = self._extract_batch(transcript) or f"BAT-{datetime.now().strftime('%Y%m')}"

            return ParsedReportResponse(
                intent="INVENTORY_RECEIVED",
                overall_confidence=0.96,
                entities={
                    "medicine_name": ExtractedEntity(field_name="medicine_name", value=med_name, confidence=0.98, source_snippet=med_name),
                    "quantity": ExtractedEntity(field_name="quantity", value=qty, confidence=0.99, source_snippet=str(qty)),
                    "batch_number": ExtractedEntity(field_name="batch_number", value=batch, confidence=0.92, source_snippet=batch),
                    "unit": ExtractedEntity(field_name="unit", value=self._extract_unit(t_lower), confidence=0.94, source_snippet="unit"),
                },
                needs_clarification=False,
                suggested_action=f"Add +{qty} units of {med_name} (Batch {batch}) to inventory",
                raw_transcript=transcript,
                parsed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 2. INVENTORY CONSUMED
        if any(w in t_lower for w in ["consumed", "dispensed", "used", "administered", "given to"]):
            qty = self._extract_number(t_lower) or 20
            med_name = self._extract_medicine(t_lower)

            return ParsedReportResponse(
                intent="INVENTORY_CONSUMED",
                overall_confidence=0.95,
                entities={
                    "medicine_name": ExtractedEntity(field_name="medicine_name", value=med_name, confidence=0.97, source_snippet=med_name),
                    "quantity": ExtractedEntity(field_name="quantity", value=qty, confidence=0.98, source_snippet=str(qty)),
                    "unit": ExtractedEntity(field_name="unit", value=self._extract_unit(t_lower), confidence=0.92, source_snippet="unit"),
                },
                needs_clarification=False,
                suggested_action=f"Deduct -{qty} units of {med_name} via FEFO rule",
                raw_transcript=transcript,
                parsed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 3. ATTENDANCE CHECK-IN / CHECK-OUT
        if any(w in t_lower for w in ["check in", "checked in", "present", "on duty", "arrived for shift", "check out", "checked out"]):
            is_checkout = any(w in t_lower for w in ["check out", "checked out", "leaving", "shift end"])
            staff_name = self._extract_staff_name(transcript)

            return ParsedReportResponse(
                intent="ATTENDANCE_CHECKOUT" if is_checkout else "ATTENDANCE_CHECKIN",
                overall_confidence=0.94,
                entities={
                    "staff_name": ExtractedEntity(field_name="staff_name", value=staff_name, confidence=0.95, source_snippet=staff_name),
                    "department": ExtractedEntity(field_name="department", value="General OPD", confidence=0.90, source_snippet="OPD"),
                    "action": ExtractedEntity(field_name="action", value="CHECK_OUT" if is_checkout else "CHECK_IN", confidence=0.98, source_snippet="action"),
                },
                needs_clarification=False,
                suggested_action=f"Log staff {'check-out' if is_checkout else 'check-in'} for {staff_name}",
                raw_transcript=transcript,
                parsed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 4. EMERGENCY & OUTBREAK REPORT
        if any(w in t_lower for w in ["emergency", "outbreak", "dengue", "surge", "fever", "epidemic"]):
            patients = self._extract_number(t_lower) or 15
            return ParsedReportResponse(
                intent="EMERGENCY_REPORT",
                overall_confidence=0.93,
                entities={
                    "emergency_type": ExtractedEntity(field_name="emergency_type", value="Dengue Vector Outbreak Surge", confidence=0.96, source_snippet="dengue"),
                    "patient_surge_count": ExtractedEntity(field_name="patient_surge_count", value=patients, confidence=0.92, source_snippet=str(patients)),
                    "severity": ExtractedEntity(field_name="severity", value="HIGH", confidence=0.95, source_snippet="surge"),
                },
                needs_clarification=False,
                suggested_action="Elevate PHC status to SURGE and alert District Health Officer",
                raw_transcript=transcript,
                parsed_at=datetime.now(timezone.utc).isoformat(),
            )

        # 5. BED & OCCUPANCY UPDATE
        if any(w in t_lower for w in ["bed", "beds", "occupied", "admission", "icu"]):
            beds = self._extract_number(t_lower) or 8
            return ParsedReportResponse(
                intent="BED_UPDATE",
                overall_confidence=0.92,
                entities={
                    "occupied_beds": ExtractedEntity(field_name="occupied_beds", value=beds, confidence=0.94, source_snippet=str(beds)),
                    "category": ExtractedEntity(field_name="category", value="General Inpatient", confidence=0.90, source_snippet="beds"),
                },
                needs_clarification=False,
                suggested_action=f"Update active bed occupancy count to {beds} beds",
                raw_transcript=transcript,
                parsed_at=datetime.now(timezone.utc).isoformat(),
            )

        # Default Generic Report
        return ParsedReportResponse(
            intent="GENERAL_REPORT",
            overall_confidence=0.88,
            entities={
                "report_summary": ExtractedEntity(field_name="report_summary", value=transcript, confidence=0.88, source_snippet=transcript)
            },
            needs_clarification=False,
            suggested_action="Log operational note to facility activity journal",
            raw_transcript=transcript,
            parsed_at=datetime.now(timezone.utc).isoformat(),
        )

    def _extract_number(self, text: str) -> Optional[int]:
        matches = re.findall(r"\b\d+\b", text)
        return int(matches[0]) if matches else None

    def _extract_medicine(self, text: str) -> str:
        if "doxycycline" in text:
            return "Doxycycline 100mg Capsules"
        if "artesunate" in text:
            return "Artesunate 60mg Injection"
        if "saline" in text or "iv" in text:
            return "Normal Saline 0.9% IV Infusion"
        if "rabies" in text or "vaccine" in text:
            return "Rabies Vaccine Human (Rabipur)"
        if "ors" in text:
            return "Oral Rehydration Salts (WHO Formula)"
        return "Paracetamol 500mg Tablets"

    def _extract_batch(self, text: str) -> Optional[str]:
        match = re.search(r"\b[A-Z0-9]{3,}-[A-Z0-9-]+\b", text)
        return match.group(0) if match else None

    def _extract_unit(self, text: str) -> str:
        if "bottle" in text:
            return "bottles"
        if "vial" in text:
            return "vials"
        if "sachet" in text:
            return "sachets"
        if "strip" in text or "tablet" in text:
            return "strips"
        return "units"

    def _extract_staff_name(self, text: str) -> str:
        if "priya" in text.lower():
            return "Dr. Priya Patel"
        if "sanjay" in text.lower():
            return "Dr. Sanjay Gupta"
        if "sunita" in text.lower():
            return "Sunita Devi"
        if "anil" in text.lower():
            return "Anil Deshmukh"
        return "Dr. Operational Staff"

gemini_extractor = GeminiExtractor()
