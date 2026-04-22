import { useEffect, useState } from "react"

function CategoryIcon({ name, size = 20 }) {
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

  const icons = {
    food: (
      <>
        <path d="M3 2v7c0 1.1.9 2 2 2h1v11" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
      </>
    ),
    travel: (
      <>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20.5 3s-3-.5-4.5 1L12.5 7.5 4.3 5.7 3 7l6.5 4L6 14.5l-3-.5-1 1 4 2 2 4 1-1-.5-3L12 13.5l4 6.5z" />
      </>
    ),
    shopping: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
    utilities: (
      <>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5A4.8 4.8 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </>
    ),
    transport: (
      <>
        <path d="M19 17h2l.64-2.54A6 6 0 0 0 19 8h-1l-2-4H8L6 8H5a6 6 0 0 0-2.64 6.46L3 17h2" />
        <path d="M14 17H10" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),
    healthcare: (
      <>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" />
      </>
    ),
    wallet: (
      <>
        <path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
        <path d="M21 12h-6a2 2 0 0 0 0 4h6v-4z" />
      </>
    ),
  }

  return <svg {...common}>{icons[name] || icons.wallet}</svg>
}

const colorClasses = {
  purple: "bg-purple-500/20 text-purple-400",
  blue: "bg-blue-500/20 text-blue-400",
  cyan: "bg-cyan-500/20 text-cyan-400",
  gray: "bg-slate-500/20 text-slate-400",
  green: "bg-green-500/20 text-green-400",
  indigo: "bg-indigo-500/20 text-indigo-400",
}

const barClasses = {
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  cyan: "bg-cyan-400",
  gray: "bg-slate-400",
  green: "bg-green-400",
  indigo: "bg-indigo-400",
}

export default function CategoryRow({
  name,
  amount,
  percent,
  icon,
  color,
  total,
  onSelect,
}) {
  const resolvedAmount = Number(amount ?? 0)
  const resolvedPercent =
    percent ?? (total ? Math.round((resolvedAmount / Number(total)) * 100) : 0)
  const normalizedName = String(name || "").toLowerCase()
  const resolvedIcon =
    icon ||
    (normalizedName.includes("food")
      ? "food"
      : normalizedName.includes("travel")
        ? "travel"
        : normalizedName.includes("shopping")
          ? "shopping"
          : normalizedName.includes("bill")
            ? "utilities"
            : "wallet")
  const resolvedColor =
    color ||
    (normalizedName.includes("food")
      ? "green"
      : normalizedName.includes("travel")
        ? "blue"
        : normalizedName.includes("shopping")
          ? "purple"
          : normalizedName.includes("bill")
            ? "cyan"
            : "gray")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(resolvedPercent || 0)
    }, 100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [resolvedPercent])

  return (
    <div
      className="bg-slate-800 border border-white/10 rounded-xl p-5
           transition cursor-pointer
           hover:bg-slate-700/70 hover:-translate-y-0.5"
      onClick={() => onSelect?.(name)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              colorClasses[resolvedColor] || ""
            }`}
          >
            <CategoryIcon name={resolvedIcon === "expense" ? "wallet" : resolvedIcon} size={20} />
          </div>

          <p className="font-semibold text-white">{name}</p>
        </div>

        <p className="text-sm text-slate-400">{resolvedPercent}%</p>
      </div>

      <p className="text-2xl font-bold text-white mb-4">
        &#8377;{resolvedAmount.toLocaleString()}
      </p>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            barClasses[resolvedColor] || ""
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
