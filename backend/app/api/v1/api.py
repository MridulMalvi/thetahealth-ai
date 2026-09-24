from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, facilities, operational_state, pharmacy, voice, analytics, supply_chain

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & RBAC"])
api_router.include_router(facilities.router, prefix="/facilities", tags=["Facility Network & Digital Twin"])
api_router.include_router(operational_state.router, prefix="/operational", tags=["Firestore Real-Time Operational State"])
api_router.include_router(pharmacy.router, prefix="/pharmacy", tags=["Pharmacy Intelligence & FEFO"])
api_router.include_router(voice.router, prefix="/voice", tags=["Theta Voice & Gemini Extraction"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["BigQuery & Vertex AI Forecasting"])
api_router.include_router(supply_chain.router, prefix="/supply", tags=["Supply Chain Control Tower & Resource Exchange"])







