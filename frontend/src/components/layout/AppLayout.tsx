import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080c14] text-slate-100 antialiased">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-radial from-slate-900/40 via-[#080c14] to-[#080c14]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
