import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { CommandCenterPage } from "@/features/command-center/CommandCenterPage"
import { FacilityNetworkPage } from "@/features/facilities/FacilityNetworkPage"
import { ThetaVoicePage } from "@/features/voice/ThetaVoicePage"
import { PharmacyPage } from "@/features/pharmacy/PharmacyPage"
import { SupplyChainPage } from "@/features/supply-chain/SupplyChainPage"
import { EmergencyPage } from "@/features/emergency/EmergencyPage"
import { SimulatorPage } from "@/features/simulator/SimulatorPage"
import { CopilotPage } from "@/features/copilot/CopilotPage"
import { AnalyticsPage } from "@/features/analytics/AnalyticsPage"
import { SettingsPage } from "@/features/settings/SettingsPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<CommandCenterPage />} />
          <Route path="command-center" element={<CommandCenterPage />} />
          <Route path="facilities" element={<FacilityNetworkPage />} />
          <Route path="voice" element={<ThetaVoicePage />} />
          <Route path="pharmacy" element={<PharmacyPage />} />
          <Route path="supply-chain" element={<SupplyChainPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="simulator" element={<SimulatorPage />} />
          <Route path="copilot" element={<CopilotPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Catch-all to Command Center */}
          <Route path="*" element={<CommandCenterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
