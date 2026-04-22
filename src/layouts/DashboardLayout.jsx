import { useState } from "react"
import { useParams } from "react-router-dom"
import DashboardSidebar from "../components/dashboard/DashboardSidebar.jsx"
import finnovaLogo from "../assets/finnova-logo.svg"

export default function DashboardLayout({ children }) {
  const { id } = useParams()
  const [desktopOpen, setDesktopOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDesktop = () => {
    setDesktopOpen((current) => !current)
  }

  const toggleMobile = () => {
    setDesktopOpen(true)
    setMobileOpen((current) => !current)
  }

  const closeMobile = () => {
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300
               lg:static lg:translate-x-0 ${
                 mobileOpen ? "translate-x-0" : "-translate-x-full"
               }`}
      >
        <DashboardSidebar
          isOpen={desktopOpen}
          onToggle={toggleDesktop}
          onCloseMobile={closeMobile}
          uploadId={id}
        />
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-slate-900 border-b border-white/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <button
              className="p-2 rounded text-slate-200 hover:text-white hover:bg-white/10"
              onClick={toggleMobile}
            >
              &#9776;
            </button>

            <div>
              <img src={finnovaLogo} alt="Finnova" className="h-8 w-auto mt-1" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 text-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}
