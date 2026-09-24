from fastapi import APIRouter
from datetime import datetime, timezone
from app.utils.config import settings

router = APIRouter()

@router.get("/health", summary="Health Check")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    }
