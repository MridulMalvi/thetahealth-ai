# Technology Stack — ThetaHealth AI

## Overview

ThetaHealth AI is an AI-powered healthcare operations intelligence and resilience platform. The stack is chosen for native Google Cloud AI integration, serverless scalability, real-time data flow, and rapid development velocity.

---

## 1. Frontend

| Technology | Purpose |
|---|---|
| **React 18+** | UI framework |
| **Vite** | Build tool and dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible, composable component library |
| **React Router** | Client-side routing |
| **TanStack Query** | Server state management, caching, and synchronization |
| **React Hook Form** | Form management |
| **Zod** | Schema validation (shared with API contracts) |
| **Recharts** | Data visualization and charts |
| **Lucide React** | Icon library |
| **MapLibre GL JS** | Geospatial visualization (facility maps, risk radar) |

**Deployment:** Vercel

> Do NOT use Next.js. This is a client-rendered SPA deployed to Vercel's CDN.

---

## 2. Backend

| Technology | Purpose |
|---|---|
| **Python 3.11+** | Runtime |
| **FastAPI** | API framework (async, OpenAPI auto-docs) |
| **Pydantic v2** | Data validation, serialization, settings management |
| **pydantic-settings** | Environment variable management |
| **Firebase Admin SDK** | Firestore access, token verification, auth management |
| **Google Cloud SDKs** | BigQuery, Vertex AI, Cloud Storage, Secret Manager |
| **Gemini API SDK** | `google-genai` for structured extraction and NLP |
| **Uvicorn** | ASGI server |
| **python-dotenv** | Local `.env` file loading |

**Architecture:** Modular monolith following `API → Service → Repository` pattern.

**Deployment:** Google Cloud Run (Dockerized)

> Do NOT introduce Kubernetes or unnecessary microservices.

---

## 3. Operational Database — Firebase Firestore

| Aspect | Detail |
|---|---|
| **Role** | Source of truth for current operational state |
| **Use Cases** | Inventory, beds, attendance, facility state, active alerts, recommendations, emergency state, shipments, operational transactions |
| **Real-Time** | Firestore listeners power live dashboard updates |
| **Auth** | Firebase Authentication (Email/Password, Google, GitHub) |

---

## 4. Analytics Data Warehouse — Google BigQuery

| Aspect | Detail |
|---|---|
| **Role** | Historical analytical data store |
| **Use Cases** | Historical inventory, medicine consumption, patient footfall, bed occupancy, staff attendance, supply-chain history, forecasts, emergency analytics, feature datasets, reporting |
| **Principle** | Immutable event history — never overwrite analytical records |
| **Querying** | Used for analytical queries and ML training, NOT for per-interaction dashboard queries |

---

## 5. AI / ML — Google Vertex AI

| Aspect | Detail |
|---|---|
| **Role** | Predictive intelligence |
| **Capabilities** | AutoML forecasting, demand prediction, stock-out prediction, bed demand forecasting, workforce demand forecasting, anomaly detection |
| **Training Data** | BigQuery historical datasets |
| **Model Management** | Model evaluation, model registry, prediction endpoints |
| **Forecast Horizons** | 7 / 14 / 30 days |

---

## 6. Generative AI — Google Gemini

| Aspect | Detail |
|---|---|
| **Role** | Natural-language understanding and human communication |
| **Use Cases** | PHC report extraction (voice/text → structured JSON), ThetaBrief executive summaries, Ask Theta AI Copilot, scenario explanations, AI explainability |
| **Access** | Gemini API or Gemini through Vertex AI |
| **Constraint** | Never the authoritative source for numerical facts. All operational facts come from Firestore/BigQuery/backend tools |

---

## 7. Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| **Google Cloud Run** | Backend compute (serverless, auto-scaling) |
| **Vercel** | Frontend CDN and deployment |
| **Docker** | Backend containerization |
| **Google Artifact Registry** | Docker image storage |
| **Google Secret Manager** | Sensitive credentials management |
| **Google Cloud Logging** | Centralized logging |
| **Google Cloud Monitoring** | Performance monitoring |
| **Google Cloud Error Reporting** | Error tracking |
| **GitHub** | Source control |
| **GitHub Actions** | CI/CD pipelines |

---

## 8. Testing

| Technology | Scope |
|---|---|
| **Vitest** | Frontend unit tests |
| **React Testing Library** | Frontend component tests |
| **Playwright** | Frontend end-to-end tests |
| **Pytest** | Backend unit and integration tests |

---

## 9. Environment Variables

### Frontend (Vercel)

```
VITE_API_BASE_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Backend (Cloud Run / Secret Manager)

```
GOOGLE_CLOUD_PROJECT
FIREBASE_PROJECT_ID
VERTEX_AI_LOCATION
BIGQUERY_DATASET
GEMINI_API_KEY
```

> Never expose privileged server credentials to the frontend.

---

## 10. Future Stack Additions

| Technology | Purpose | When |
|---|---|---|
| **React Native** | Mobile app for PHC workers | Phase 2 (post-hackathon) |
| **Federated Learning** | Cross-country model training | Future BRICS expansion |
| **Multilingual TTS/STT** | Regional language voice support | Future enhancement |
