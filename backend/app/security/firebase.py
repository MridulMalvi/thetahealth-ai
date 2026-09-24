import os
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

logger = logging.getLogger("thetahealth.firebase")

_firebase_app: Optional[firebase_admin.App] = None

def get_firebase_app() -> firebase_admin.App:
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    # Try local credentials file
    cred_paths = [
        os.path.join(os.path.dirname(__file__), "..", "..", "firebase-credentials.json"),
        os.getenv("FIREBASE_CREDENTIALS_PATH", ""),
        "firebase-credentials.json"
    ]

    cert_path = None
    for path in cred_paths:
        if path and os.path.exists(path):
            cert_path = path
            break

    if cert_path:
        try:
            logger.info(f"Initializing Firebase Admin with certificate from {cert_path}")
            cred = credentials.Certificate(cert_path)
            _firebase_app = firebase_admin.initialize_app(cred, {
                "projectId": os.getenv("GCP_PROJECT_ID", "thetahealth001"),
                "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", "thetahealth001.firebasestorage.app")
            })
            return _firebase_app
        except Exception as e:
            logger.warning(f"Failed to load certificate {cert_path}: {e}")

    # Fallback to default application credentials or mock app
    try:
        if not firebase_admin._apps:
            _firebase_app = firebase_admin.initialize_app()
        else:
            _firebase_app = firebase_admin.get_app()
    except Exception as e:
        logger.warning(f"Firebase Admin initialized in mock/development mode: {e}")
        _firebase_app = None

    return _firebase_app

def verify_firebase_token(id_token: str) -> dict:
    """
    Verifies Firebase ID token and returns claims dictionary.
    Includes fallback decoding for local development/testing.
    """
    app = get_firebase_app()
    if app:
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            logger.error(f"Error verifying Firebase ID token: {e}")
            raise e
    
    # Development fallback
    return {
        "uid": "dev-user-001",
        "email": "dr.admin@thetahealth.gov",
        "name": "Dr. Dev Admin",
        "role": "NATIONAL_ADMIN",
        "scope": "NATIONAL",
        "state_id": None,
        "district_id": None,
        "facility_id": None
    }
