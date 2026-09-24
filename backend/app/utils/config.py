import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "ThetaHealth AI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # GCP / Firebase
    GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "thetahealth001")
    FIREBASE_STORAGE_BUCKET: str = os.getenv("FIREBASE_STORAGE_BUCKET", "thetahealth001.firebasestorage.app")
    BIGQUERY_DATASET: str = os.getenv("BIGQUERY_DATASET", "thetahealth_analytics")
    
    # AI / ML
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    VERTEX_LOCATION: str = os.getenv("VERTEX_LOCATION", "us-central1")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://thetahealth001.firebaseapp.com",
        "https://thetahealth001.web.app"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
