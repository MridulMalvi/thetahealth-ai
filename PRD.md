# Product Requirements Document (PRD)

## Project Information

| Field | Value |
|---|---|
| **Team** | Team Theta |
| **Product** | ThetaHealth AI |
| **Tagline** | Predict · Prevent · Coordinate · Resilience |
| **Track** | Track 3 — Smart Health & Supply Chain Resilience |
| **BRICS Theme** | Resilience |

---

## 1. Problem Statement

Public healthcare systems across developing nations operate vast, distributed networks of Primary Health Centres (PHCs), hospitals, district facilities, pharmacies, and warehouses. These networks suffer from:

- **Invisible supply chains** — No real-time visibility into medicine inventory, consumption rates, expiry risk, or wastage across facilities.
- **Reactive crisis response** — Stock-outs, bed shortages, and workforce gaps are discovered *after* they cause harm, not before.
- **Fragmented data** — PHC workers report through paper forms or disconnected systems; data never reaches decision-makers in time.
- **No predictive capability** — Historical patterns (seasonal disease surges, supplier delays, demand spikes) are not used to anticipate and prevent failures.
- **Manual resource coordination** — Surplus resources at one facility cannot be efficiently identified and redistributed to another facility in need.

The result: preventable medicine shortages during emergencies, expired drugs that could have been transferred, understaffed facilities during patient surges, and no way to simulate "what if?" scenarios before a crisis arrives.

---

## 2. Product Vision

> **ThetaHealth AI is not a conventional hospital-management CRUD application.**

It is an **AI-powered healthcare operations intelligence and resilience platform** that continuously answers:

| Question | Powered By |
|---|---|
| What is happening now? | Firestore (real-time operational state) |
| What has happened? | BigQuery (historical analytics) |
| What is likely to happen next? | Vertex AI (predictive intelligence) |
| Where are vulnerabilities emerging? | Risk Engine (stock-out prediction, resilience scoring) |
| What resources are available elsewhere? | Resource Exchange (surplus/deficit matching) |
| What intervention could reduce the risk? | Redistribution Engine (AI recommendations) |
| What happened after the intervention? | Impact Measurement (before/after analytics) |

### Core Intelligence Loop

```
OBSERVE → UNDERSTAND → PREDICT → DETECT RISK → RECOMMEND → HUMAN APPROVAL → ACT → MEASURE IMPACT → LEARN
```

---

## 3. Solution Overview

ThetaHealth AI provides real-time visibility and predictive intelligence across the entire healthcare network:

- **Medicine inventory, consumption, expiry, and wastage**
- **Patient footfall and bed availability**
- **Staff attendance and workforce availability**
- **Supply-chain movement and supplier reliability**
- **Predicted stock-outs, bed demand, and workforce demand**
- **Emergency resource requirements**
- **Cross-district resource redistribution recommendations**

The system is designed to evolve toward a federated, national-scale, BRICS-compatible architecture.

---

## 4. Core Features

### 4.1 National Health Command Center
A real-time operations dashboard displaying total facilities, active PHCs, hospitals, available/occupied beds, medicine availability, critical stock-outs, staff availability, emergency events, supply-chain disruptions, and a national resilience score.

### 4.2 National Risk Radar
Classifies every facility into risk tiers (🔴 Critical, 🟠 High, 🟡 Watch, 🟢 Stable) with drill-down from Country → State → District → Facility → Risk detail.

### 4.3 Theta Resilience Score
A transparent, configurable composite score (0–100) across six dimensions: Medicine Resilience, Bed Capacity, Workforce Availability, Supply Chain Stability, Emergency Readiness, and Data Quality. Every score change is explained in natural language.

### 4.4 ThetaBrief — Executive AI Briefing
An AI-generated situational summary shown at dashboard load, highlighting emerging risks, affected facilities, and recommended actions. Powered by real backend data, not hallucinated content.

### 4.5 Digital Twin of Healthcare Capacity
Each facility has a continuously updated operational state combining real-time Firestore data, historical BigQuery trends, Vertex AI predictions, supply-chain dependencies, workforce state, and emergency state.

### 4.6 PHC Worker Experience — Theta Voice
A radically simple interface for PHC workers. Workers can report using natural language (voice or text). No complex forms. The system uses browser transcription + Gemini to extract structured data, validates it, asks for human confirmation, and writes to Firestore.

### 4.7 Theta Clarify — Conversational Clarification
When input is ambiguous, the system asks follow-up questions instead of guessing. ("Did you mean Paracetamol 500mg or Paracetamol 650mg?")

### 4.8 AI Confidence Display
Every AI extraction shows per-field confidence scores. Below-threshold confidence triggers mandatory human clarification.

### 4.9 Pharmacy & Inventory Intelligence
Comprehensive medicine tracking: SKUs, batches, FEFO (First Expiry, First Out), daily consumption, days remaining, reorder levels, predicted stock-outs, expiry wastage intelligence, and incoming shipment tracking.

### 4.10 Medicine Demand Forecasting
Vertex AI AutoML forecasting at 7/14/30-day horizons using features: historical consumption, patient footfall, seasonality, facility, district, medicine category, day-of-week, and emergency events.

### 4.11 Stock-Out Prediction
Calculates `days_remaining = available_quantity / predicted_daily_consumption`, factoring in inbound shipments, supplier delays, demand acceleration, emergency conditions, and facility priority.

### 4.12 Bed Demand Forecast
Predicts general, emergency, and ICU bed demand at 72-hour horizons.

### 4.13 Workforce Intelligence
Compares expected staff, actual staff, and predicted required staff. Generates early warnings for projected shortages by department.

### 4.14 Supply Chain Control Tower
Visualizes the full supply chain: Supplier → Warehouse → Distribution Center → District → Hospital → PHC. Tracks shipments, delays, inventory imbalances, supplier reliability, and route issues.

### 4.15 Theta Resource Exchange
Classifies facilities as SURPLUS / NEUTRAL / NEEDS RESOURCE. AI identifies redistribution opportunities and generates transfer recommendations.

### 4.16 Redistribution Engine
Backend optimization engine that considers current inventory, forecast demand, minimum stock, facility priority, distance, transportation availability, expiry, emergency severity, and supplier ETA. Outputs recommendations requiring human approval.

### 4.17 Healthcare What-If Simulator
Allows administrators to model scenarios (e.g., +30% patient surge, +5 day supplier delay, -15% staff availability) and see projected impact on shortages before they happen.

### 4.18 Emergency Mode
Dedicated command interface activated during declared emergencies (outbreaks, floods, supply disruptions). Shows real-time impact metrics and recommended immediate actions.

### 4.19 Ask Theta — AI Copilot
Natural-language query interface for administrators. Gemini uses backend tools to query authoritative Firestore/BigQuery data — never fabricates numerical answers.

### 4.20 Data Quality Intelligence
Tracks data freshness across all dimensions (inventory, attendance, beds, medicine identification). Stale data triggers warnings. AI accounts for data freshness in its predictions.

### 4.21 Audit System
Logs all significant actions (logins, inventory updates, transfers, approvals, rejections, AI extractions, permission changes) with user, action, resource, timestamp, old/new values, and source.

---

## 5. User Roles & RBAC

| Role | Primary View | Scope |
|---|---|---|
| National Administrator | National Command Center | All national data |
| State/District Administrator | Regional Intelligence | State/district data |
| Hospital Administrator | Facility Operations | Hospital data |
| PHC Worker | Theta Voice + Operations | Own PHC |
| Doctor / Nurse | Workforce & Assignments | Assigned facility |
| Pharmacist | Inventory Intelligence | Assigned facility |
| Supply Chain Manager | Resource Exchange + Control Tower | Assigned network |
| Emergency Officer | Emergency Command Center | Assigned region |
| Analyst | Analytics & Forecasting | Role-scoped data |

Authorization is enforced in FastAPI. Frontend route protection is supplementary, not primary.

---

## 6. Natural Language Intents

The system supports the following structured intents from PHC worker natural-language input:

```
INVENTORY_RECEIVED    INVENTORY_CONSUMED    INVENTORY_ADJUSTED
ATTENDANCE_CHECKIN    ATTENDANCE_CHECKOUT
BED_UPDATE            PATIENT_FOOTFALL
SHIPMENT_RECEIVED     SHIPMENT_DELAY
EMERGENCY_REPORT      GENERAL_REPORT
```

---

## 7. AI Safety Principles

ThetaHealth is a **decision-support system**. AI must NOT:
- Diagnose patients or prescribe medication
- Autonomously modify critical operational decisions
- Fabricate data, forecasts, or numerical facts
- Hide uncertainty
- Execute resource transfers without authorization

AI MAY: summarize, extract, forecast, identify risks, recommend actions, explain predictions, generate alerts, and assist administrators.

**All critical actions require authorized human approval.**

---

## 8. Demo Scenarios

| Scenario | Description |
|---|---|
| **Dengue Outbreak** (Primary) | Patient surge → demand spike → stock-out risk → redistribution → approval → resolution |
| Supply Chain Disruption | Supplier delayed 7 days |
| Respiratory Outbreak | Oxygen/respiratory medicine demand increase |
| Flood | Facilities become unreachable |
| Medicine Overstock | Expiry risk increases |
| Staff Shortage | Unexpected absenteeism |

All scenarios use deterministic synthetic data for reproducible demos.

---

## 9. Synthetic Data Scale

| Entity | Count |
|---|---|
| States | 10 |
| Districts | 50 |
| Hospitals | 100 |
| PHCs | 300 |
| Medicines | 100 |
| Staff | 5,000 |

Includes correlated historical data: inventory, consumption, footfall, bed occupancy, attendance, shipments, supplier delays, and seasonal demand.

---

## 10. Development Phases

| Phase | Scope |
|---|---|
| 1 — Foundation | React + Vite + TypeScript + Tailwind + shadcn/ui design system |
| 2 — Authentication | Firebase Auth + RBAC |
| 3 — Facility Network | Country → State → District → Facility hierarchy |
| 4 — Firestore | Real-time operational state |
| 5 — Pharmacy | Inventory + batches + FEFO + expiry |
| 6 — PHC Worker | Theta Voice + natural-language reporting |
| 7 — Gemini | Natural language → validated structured JSON |
| 8 — Dashboards | Command Center + Pharmacy + Facility + Workforce |
| 9 — BigQuery | Historical analytics pipeline |
| 10 — Vertex AI | Medicine demand forecasting |
| 11 — Risk Intelligence | Stock-out prediction + Resilience Score + Risk Radar |
| 12 — Supply Chain | Resource Exchange + redistribution recommendations |
| 13 — Emergency | Emergency Mode + Simulation |
| 14 — AI | ThetaBrief + Ask Theta |
| 15 — Simulator | What-if scenario modelling |
| 16 — Deployment | Vercel + Cloud Run + Firestore + BigQuery + Vertex AI |
| 17 — Polish | Testing + accessibility + observability + demo optimization |

---

## 11. Success Criteria

The final system must demonstrate: **Real-time** operational visibility, **Conversational** PHC reporting, **Structured AI** extraction, **Predictive** intelligence, **Early Warning** for emerging risks, **Explainable** AI, **Optimized** resource redistribution, **Human Control** over critical actions, **Simulatable** future scenarios, **Resilient** emergency response, **Scalable** architecture (PHC → District → State → Nation → BRICS), and **Cloud-Ready** deployment.

---

## 12. Future Enhancements

- **React Native Mobile App** — Dedicated mobile experience for PHC workers with offline capabilities.
- **Federated Architecture** — Each BRICS country operates a local data node; sensitive data remains under relevant jurisdiction; models can be shared via federated training interfaces.
- **Multilingual Voice Support** — Hindi, Tamil, Bengali, and other regional languages.
