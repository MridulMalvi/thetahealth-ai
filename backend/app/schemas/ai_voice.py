from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class VoiceParseRequest(BaseModel):
    transcript: str = Field(..., min_length=2, description="Natural language voice transcript or text input")
    facility_id: str = Field("FAC-UP-MEE-002", description="Facility where report is originating")
    language: str = Field("en", description="Language code (en, hi, etc.)")

class ExtractedEntity(BaseModel):
    field_name: str
    value: Any
    confidence: float = Field(..., ge=0.0, le=1.0)
    source_snippet: Optional[str] = None

class ParsedReportResponse(BaseModel):
    intent: str
    overall_confidence: float = Field(..., ge=0.0, le=1.0)
    entities: Dict[str, ExtractedEntity]
    needs_clarification: bool = False
    clarification_question: Optional[str] = None
    clarification_options: Optional[List[str]] = None
    suggested_action: str
    raw_transcript: str
    parsed_at: str

class ConfirmAndCommitRequest(BaseModel):
    facility_id: str
    intent: str
    entities: Dict[str, Any]
    notes: Optional[str] = None

class VoiceCommitResult(BaseModel):
    status: str
    transaction_id: str
    message: str
    facility_id: str
    committed_at: str
    updated_state_summary: Dict[str, Any]
