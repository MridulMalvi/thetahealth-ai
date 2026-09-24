from typing import List
from datetime import datetime
from app.schemas.simulator import SimulatorRequest, SimulatorResponse, CriticalBottleneck

class SimulatorService:
    def run_simulation(self, req: SimulatorRequest) -> SimulatorResponse:
        baseline_resilience = 84.6

        # Calculate penalty based on surge, delay, and absenteeism
        surge_penalty = (req.patient_surge_pct / 100.0) * 22.0
        delay_penalty = (req.supplier_delay_days / 10.0) * 18.0
        absenteeism_penalty = (req.staff_absenteeism_pct / 50.0) * 15.0

        # Offsets if AI redistribution and emergency buffers are active
        mitigation_offset = 0.0
        if req.apply_ai_redistribution:
            mitigation_offset += 12.0
        if req.apply_emergency_buffer:
            mitigation_offset += 8.0

        raw_simulated = baseline_resilience - (surge_penalty + delay_penalty + absenteeism_penalty) + mitigation_offset
        simulated_resilience = round(max(15.0, min(100.0, raw_simulated)), 1)
        resilience_delta = round(simulated_resilience - baseline_resilience, 1)

        # Bed occupancy simulation (baseline is 78%)
        projected_bed_occupancy = round(min(125.0, 78.0 + (req.patient_surge_pct * 0.45)), 1)

        # Stockout risk SKUs count calculation
        stockout_count = max(1, int(1 + (req.supplier_delay_days * 0.8) + (req.patient_surge_pct * 0.04)))
        if req.apply_ai_redistribution:
            stockout_count = max(1, stockout_count - 2)

        bottlenecks: List[CriticalBottleneck] = []

        if projected_bed_occupancy >= 95.0:
            bottlenecks.append(
                CriticalBottleneck(
                    entity="ICU & High Dependency Units",
                    risk_type="BED_CAPACITY",
                    days_until_breach=round(max(1.2, 7.0 - (req.patient_surge_pct * 0.05)), 1),
                    severity="CATASTROPHIC" if projected_bed_occupancy > 110 else "CRITICAL",
                    description=f"Projected bed occupancy reaching {projected_bed_occupancy}% exceeds rated ward capacity."
                )
            )

        if req.supplier_delay_days >= 3:
            bottlenecks.append(
                CriticalBottleneck(
                    entity="IV Normal Saline 500ml (MED-005)",
                    risk_type="STOCKOUT",
                    days_until_breach=round(max(0.8, 5.0 - (req.supplier_delay_days * 0.6)), 1),
                    severity="CRITICAL",
                    description=f"Supply pipeline disrupted by {req.supplier_delay_days} days; regional reserve depleted."
                )
            )

        if req.staff_absenteeism_pct >= 20.0:
            bottlenecks.append(
                CriticalBottleneck(
                    entity="Clinical Nursing & Pharmacy Dispensation",
                    risk_type="STAFF_DEFICIT",
                    days_until_breach=2.0,
                    severity="MODERATE",
                    description=f"Absenteeism of {req.staff_absenteeism_pct}% reduces patient triage throughput by 35%."
                )
            )

        mitigations: List[str] = [
            f"Pre-allocate {int(req.patient_surge_pct * 1.5)} emergency surge beds across peripheral PHCs",
            "Trigger automated inter-district FEFO stock leveling for IV fluids and antibiotics",
            "Activate cross-district reserve nurse call-in roster"
        ]

        if not req.apply_ai_redistribution:
            mitigations.append("Enable Automated AI Redistribution to recover +12.0 resilience points")
        if not req.apply_emergency_buffer:
            mitigations.append("Release Central Emergency Reserve Buffer to recover +8.0 resilience points")

        return SimulatorResponse(
            scenario_name=req.scenario_name,
            baseline_resilience=baseline_resilience,
            simulated_resilience=simulated_resilience,
            resilience_delta=resilience_delta,
            projected_bed_occupancy_pct=projected_bed_occupancy,
            stockout_risk_skus_count=stockout_count,
            critical_bottlenecks=bottlenecks,
            recommended_mitigations=mitigations,
            simulated_at=datetime.utcnow().isoformat() + "Z"
        )

simulator_service = SimulatorService()
