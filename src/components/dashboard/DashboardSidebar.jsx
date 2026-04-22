import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext.jsx"
import finnovaLogo from "../../assets/finnova-logo.svg"

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  }

  const paths = {
    dashboard: (
      <>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </>
    ),
    pie: (
      <>
        <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951C12.449 1.996 12 2.448 12 3v9z" />
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
    sliders: (
      <>
        <line x1="21" x2="14" y1="4" y2="4" />
        <line x1="10" x2="3" y1="4" y2="4" />
        <line x1="21" x2="12" y1="12" y2="12" />
        <line x1="8" x2="3" y1="12" y2="12" />
        <line x1="21" x2="16" y1="20" y2="20" />
        <line x1="12" x2="3" y1="20" y2="20" />
        <line x1="14" x2="14" y1="2" y2="6" />
        <line x1="8" x2="8" y1="10" y2="14" />
        <line x1="16" x2="16" y1="18" y2="22" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    menu: (
      <>
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <path d="M4 6h16" />
      </>
    ),
    chevronLeft: <path d="m15 18-6-6 6-6" />,
  }

  return <svg {...common}>{paths[name]}</svg>
}

function DashboardNavItem({ to, icon, label, effectiveOpen, onClick }) {
  const isActive =
    typeof window !== "undefined" && window.location.pathname === to
  const exactActiveClass =
    "bg-indigo-500/20 text-indigo-400 shadow-[inset_3px_0_0_#6366F1]"

  return (
    <button
      type="button"
      onClick={() => onClick(to)}
      className={`group flex items-center px-3 py-2 rounded-lg
               w-full text-left
               transition-colors duration-200
               hover:bg-indigo-600 hover:text-white ${
                 effectiveOpen ? "gap-3 justify-start" : "justify-center"
               } ${isActive ? exactActiveClass : ""}`}
    >
      <Icon name={icon} size={18} />
      <span
        className={`transition-all duration-300 overflow-hidden ${
          effectiveOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export default function DashboardSidebar({ isOpen, onToggle, onCloseMobile, uploadId }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const effectiveOpen = isDesktop ? isOpen : true

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      onCloseMobile?.()
    } else {
      onToggle?.()
    }
  }

  const handleNavClick = (to) => {
    navigate(to)

    if (window.innerWidth < 1024) {
      onCloseMobile?.()
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const dashboardPath = uploadId ? `/dashboard/${uploadId}` : "/upload"
  const displayName = user?.name || "User"
  const displayEmail = user?.email || ""
  const initial = displayName.trim().charAt(0).toUpperCase() || "U"

  return (
    <div
      className={`h-screen flex flex-col
           bg-gradient-to-b from-[#0B1220] to-[#111827]
           text-gray-300 border-r border-white/10
           transition-all duration-300 w-[80vw] max-w-[280px] ${
             effectiveOpen ? "lg:w-64" : "lg:w-20"
           }`}
    >
      <div className="h-16 px-4 flex items-center border-b border-white/10">
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            effectiveOpen ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"
          }`}
        >
          <img src={finnovaLogo} alt="Finnova" className="h-10 w-auto" />
        </div>

        <button
          onClick={handleToggle}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-300 transition"
        >
          <Icon name={effectiveOpen ? "chevronLeft" : "menu"} size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        <DashboardNavItem
          to={dashboardPath}
          icon="dashboard"
          label="Dashboard"
          effectiveOpen={effectiveOpen}
          onClick={handleNavClick}
        />

        <DashboardNavItem
          to={uploadId ? `/dashboard/${uploadId}/category-breakdown` : "/upload"}
          icon="pie"
          label="Category Breakdown"
          effectiveOpen={effectiveOpen}
          onClick={handleNavClick}
        />

        <DashboardNavItem
          to={uploadId ? `/dashboard/${uploadId}/monthly` : "/upload"}
          icon="calendar"
          label="Monthly Summary"
          effectiveOpen={effectiveOpen}
          onClick={handleNavClick}
        />

        {/* <DashboardNavItem
          to="/dashboard/manual-adjustment"
          icon="sliders"
          label="Manual Adjustment"
          effectiveOpen={effectiveOpen}
          onClick={handleNavClick}
        /> */}

        <DashboardNavItem
          to={uploadId ? `/dashboard/${uploadId}/history` : "/upload"}
          icon="history"
          label="History"
          effectiveOpen={effectiveOpen}
          onClick={handleNavClick}
        />
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              effectiveOpen ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"
            }`}
          >
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-4 flex items-center rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white ${
            effectiveOpen ? "w-full gap-3 justify-start" : "w-full justify-center"
          }`}
        >
          <Icon name="logout" size={18} />
          <span
            className={`transition-all duration-300 overflow-hidden ${
              effectiveOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}
