import { useState, useEffect, useCallback } from "react"
import { InventoryTransaction, OperationalAlert } from "@/types/operational"
import { operationalService } from "@/services/operationalService"

export function useRealtimeSync() {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([])
  const [alerts, setAlerts] = useState<OperationalAlert[]>([])
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [isSyncing, setIsSyncing] = useState(false)

  const refreshData = useCallback(async () => {
    setIsSyncing(true)
    try {
      const [txList, alertList] = await Promise.all([
        operationalService.getRecentTransactions(),
        operationalService.getLiveAlerts(),
      ])
      setTransactions(txList)
      setAlerts(alertList)
      setLastSync(new Date())
    } finally {
      setIsSyncing(false)
    }
  }, [])

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 30000) // 30s auto-refresh
    return () => clearInterval(interval)
  }, [refreshData])

  const simulateIntake = async (type: "MEDICINE_RECEIVED" | "ICU_SURGE") => {
    if (type === "MEDICINE_RECEIVED") {
      await operationalService.recordTransaction({
        facility_id: "FAC-UP-MEE-002",
        medicine_id: "MED-ORS-S1",
        medicine_name: "ORS Electrolyte Sachets",
        batch_number: `ORS-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "RECEIVED",
        quantity: 200,
        unit: "sachets",
        source: "THETA_VOICE",
        notes: "Real-time intake from PHC Anandpur voice check-in",
      })
    }
    await refreshData()
  }

  return {
    transactions,
    alerts,
    lastSync,
    isSyncing,
    refreshData,
    simulateIntake,
  }
}
