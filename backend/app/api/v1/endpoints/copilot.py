from fastapi import APIRouter, HTTPException
from app.schemas.copilot import CopilotQueryRequest, CopilotQueryResponse
from app.ai.copilot_engine import copilot_engine

router = APIRouter()

@router.post("/query", response_model=CopilotQueryResponse)
async def query_copilot(req: CopilotQueryRequest):
    """Query Ask Theta AI copilot for natural language grounded operational insights."""
    return copilot_engine.process_query(req)
