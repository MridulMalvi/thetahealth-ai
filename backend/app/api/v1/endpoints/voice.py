from fastapi import APIRouter, Depends, HTTPException
from app.schemas.ai_voice import (
    VoiceParseRequest,
    ParsedReportResponse,
    ConfirmAndCommitRequest,
    VoiceCommitResult,
)
from app.services.voice_service import voice_service
from app.schemas.auth import UserProfile
from app.security.rbac import get_current_user

router = APIRouter()

@router.post("/parse", response_model=ParsedReportResponse, summary="Parse Natural Language Voice Report via Gemini")
async def parse_voice_report(
    payload: VoiceParseRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Parses unstructured PHC worker voice transcript into structured JSON with per-field confidence scores.
    """
    return voice_service.parse_report(
        transcript=payload.transcript,
        facility_id=payload.facility_id
    )

@router.post("/confirm-commit", response_model=VoiceCommitResult, summary="Confirm & Commit Parsed Voice Report")
async def confirm_and_commit_voice_report(
    payload: ConfirmAndCommitRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Human-in-the-loop verification endpoint. Writes verified operational data directly to Firestore.
    """
    return voice_service.confirm_and_commit(
        request=payload,
        user_name=current_user.name
    )
