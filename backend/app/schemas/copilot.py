from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CopilotQueryRequest(BaseModel):
    query: str = Field(..., min_length=2)
    facility_id: Optional[str] = None
    role: Optional[str] = None

class CopilotSourceCitation(BaseModel):
    source_type: str  # "FIRESTORE_OPERATIONAL", "BIGQUERY_HISTORICAL", "VERTEX_FORECAST"
    entity_id: str
    label: str
    value_referenced: str

class CopilotActionLink(BaseModel):
    label: str
    path: str
    icon_name: str

class CopilotQueryResponse(BaseModel):
    query: str
    answer: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    citations: List[CopilotSourceCitation] = []
    suggested_followups: List[str] = []
    action_links: List[CopilotActionLink] = []
    answered_at: str
    guardrails_passed: bool = True
