from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, facilities, operational_state, pharmacy

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & RBAC"])
api_router.include_router(facilities.router, prefix="/facilities", tags=["Facility Network & Digital Twin"])
api_router.include_router(operational_state.router, prefix="/operational", tags=["Firestore Real-Time Operational State"])
api_router.include_router(pharmacy.router, prefix="/pharmacy", tags=["Pharmacy Intelligence & FEFO"])




