from fastapi import APIRouter
from app.schemas.simulator import SimulatorRequest, SimulatorResponse
from app.services.simulator_service import simulator_service

router = APIRouter()

@router.post("/run", response_model=SimulatorResponse)
async def run_scenario_simulation(req: SimulatorRequest):
    """Run stress test what-if simulation against healthcare network state."""
    return simulator_service.run_simulation(req)
