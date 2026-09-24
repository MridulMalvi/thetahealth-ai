from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, facilities

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & RBAC"])
api_router.include_router(facilities.router, prefix="/facilities", tags=["Facility Network & Digital Twin"])


