import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from app.security.firebase import get_firebase_app
from app.schemas.operational_state import (
    InventoryTransaction,
    OperationalAlert,
    AlertSeverity,
)

logger = logging.getLogger("thetahealth.firestore")

class FirestoreRepository:
    def __init__(self):
        self._firestore_client = None
        self._local_transactions: List[InventoryTransaction] = []
        self._local_alerts: List[OperationalAlert] = [
            OperationalAlert(
                alert_id="ALT-001",
                facility_id="FAC-UP-MEE-003",
                facility_name="PHC Rampur",
                title="Critical Stockout: Doxycycline 100mg",
                message="Projected stock depletion in 2.1 days. Inter-facility redistribution recommended.",
                severity=AlertSeverity.CRITICAL,
                category="STOCKOUT",
                created_at=datetime.now(timezone.utc).isoformat(),
                is_resolved=False,
                action_required="Approve stock transfer from District Hospital Meerut",
            ),
            OperationalAlert(
                alert_id="ALT-002",
                facility_id="FAC-MH-MUM-001",
                facility_name="King Edward Memorial Hospital Mumbai",
                title="ICU Surge: 97.3% Capacity",
                message="146 of 150 ICU beds occupied. Triage diversion active.",
                severity=AlertSeverity.WARNING,
                category="BED_CAPACITY",
                created_at=datetime.now(timezone.utc).isoformat(),
                is_resolved=False,
                action_required="Prepare auxiliary ventilator capacity in Ward 4",
            ),
        ]
        self._init_client()

    def _init_client(self):
        try:
            app = get_firebase_app()
            if app:
                from firebase_admin import firestore
                self._firestore_client = firestore.client()
                logger.info("Firestore client successfully connected.")
        except Exception as e:
            logger.warning(f"Operating Firestore in transactional cache mode: {e}")
            self._firestore_client = None

    def record_transaction(self, tx: InventoryTransaction) -> InventoryTransaction:
        self._local_transactions.insert(0, tx)
        if self._firestore_client:
            try:
                doc_ref = self._firestore_client.collection("facilities").document(tx.facility_id)\
                    .collection("transactions").document(tx.transaction_id)
                doc_ref.set(tx.model_dump())
            except Exception as e:
                logger.warning(f"Error persisting transaction to Firestore: {e}")
        return tx

    def get_recent_transactions(self, facility_id: Optional[str] = None, limit: int = 20) -> List[InventoryTransaction]:
        if facility_id:
            return [tx for tx in self._local_transactions if tx.facility_id == facility_id][:limit]
        return self._local_transactions[:limit]

    def add_alert(self, alert: OperationalAlert) -> OperationalAlert:
        self._local_alerts.insert(0, alert)
        if self._firestore_client:
            try:
                doc_ref = self._firestore_client.collection("alerts").document(alert.alert_id)
                doc_ref.set(alert.model_dump())
            except Exception as e:
                logger.warning(f"Error persisting alert to Firestore: {e}")
        return alert

    def get_alerts(self, facility_id: Optional[str] = None) -> List[OperationalAlert]:
        if facility_id:
            return [a for a in self._local_alerts if a.facility_id == facility_id]
        return self._local_alerts

    def resolve_alert(self, alert_id: str) -> bool:
        for alert in self._local_alerts:
            if alert.alert_id == alert_id:
                alert.is_resolved = True
                return True
        return False

firestore_repository = FirestoreRepository()
