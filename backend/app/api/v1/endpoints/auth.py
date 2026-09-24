from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.auth import UserProfile, TokenVerifyRequest, RoleMetadata, RoleEnum, ScopeLevel
from app.security.rbac import get_current_user, ROLE_PERMISSIONS
from app.security.firebase import verify_firebase_token

router = APIRouter()

ROLE_METADATA_LIST: List[RoleMetadata] = [
    RoleMetadata(
        role=RoleEnum.NATIONAL_ADMIN,
        title="National Administrator",
        description="Full system-wide operational visibility, policy controls, and super-admin overrides.",
        scope_level=ScopeLevel.NATIONAL,
        primary_view="National Command Center",
        capabilities=["All facility telemetry", "Surplus/deficit approvals", "Emergency declaration", "System settings"]
    ),
    RoleMetadata(
        role=RoleEnum.STATE_DISTRICT_ADMIN,
        title="State / District Administrator",
        description="Regional oversight across district clusters, hospital capacity, and supply routes.",
        scope_level=ScopeLevel.DISTRICT,
        primary_view="District Intelligence",
        capabilities=["District facility metrics", "Inter-district transfer review", "Local emergency posture"]
    ),
    RoleMetadata(
        role=RoleEnum.HOSPITAL_ADMIN,
        title="Hospital Administrator",
        description="Operational oversight for district/tertiary hospital facilities.",
        scope_level=ScopeLevel.FACILITY,
        primary_view="Facility Operations",
        capabilities=["Bed allocations (ICU/General)", "Staff scheduling", "Hospital stock reorders"]
    ),
    RoleMetadata(
        role=RoleEnum.PHC_WORKER,
        title="PHC Healthcare Worker",
        description="Frontline worker at Primary Health Centres utilizing voice-first reporting.",
        scope_level=ScopeLevel.FACILITY,
        primary_view="Theta Voice Assistant",
        capabilities=["Voice inventory logs", "Attendance check-in", "Footfall & patient count submission"]
    ),
    RoleMetadata(
        role=RoleEnum.DOCTOR_NURSE,
        title="Doctor / Nurse",
        description="Clinical practitioner managing patient beds, clinical consumption, and triage.",
        scope_level=ScopeLevel.FACILITY,
        primary_view="Clinical Queue & Bed Ward",
        capabilities=["Bed status toggles", "Clinical drug dispensation logging", "Staff roster status"]
    ),
    RoleMetadata(
        role=RoleEnum.PHARMACIST,
        title="Hospital Pharmacist",
        description="Medicine stock management, batch FEFO rules, and expiry mitigation.",
        scope_level=ScopeLevel.FACILITY,
        primary_view="Pharmacy Intelligence",
        capabilities=["FEFO batch tracking", "Dispensing logs", "Expiry risk management", "Stock intake"]
    ),
    RoleMetadata(
        role=RoleEnum.SUPPLY_CHAIN_MANAGER,
        title="Supply Chain Manager",
        description="Logistics orchestrator managing warehouse stock, transit corridors, and redistributions.",
        scope_level=ScopeLevel.NATIONAL,
        primary_view="Resource Exchange & Control Tower",
        capabilities=["Shipment dispatch", "Redistribution proposal approvals", "Supplier delay tracking"]
    ),
    RoleMetadata(
        role=RoleEnum.EMERGENCY_OFFICER,
        title="Emergency Response Officer",
        description="Outbreak containment and disaster response commander.",
        scope_level=ScopeLevel.NATIONAL,
        primary_view="Emergency Mode Ops",
        capabilities=["Outbreak declaration", "High-priority resource requisition", "Surge corridor routing"]
    ),
    RoleMetadata(
        role=RoleEnum.ANALYST,
        title="Health Data Analyst",
        description="Data scientist and public health intelligence analyst.",
        scope_level=ScopeLevel.NATIONAL,
        primary_view="BigQuery & Vertex AI Analytics",
        capabilities=["AutoML forecast review", "Historical consumption queries", "Resilience score audits"]
    )
]

@router.get("/me", response_model=UserProfile, summary="Get Current Authenticated User")
async def get_me(current_user: UserProfile = Depends(get_current_user)):
    return current_user

@router.get("/roles", response_model=List[RoleMetadata], summary="List All 9 RBAC Roles")
async def list_roles():
    return ROLE_METADATA_LIST

@router.post("/verify-token", summary="Verify Firebase Token")
async def verify_token(payload: TokenVerifyRequest):
    try:
        decoded = verify_firebase_token(payload.id_token)
        return {
            "status": "valid",
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "name": decoded.get("name")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Token verification failed: {str(e)}")
