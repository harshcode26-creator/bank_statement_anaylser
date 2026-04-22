function IndianRupeeIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  )
}

function CalendarIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

function BuildingIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

export default function HighLevelSummary({
  totalTransactions,
  monthlySummary,
  bankName,
}) {
  const months = Object.keys(monthlySummary ?? {})
  const dateRange = months.length ? `${months[0]} - ${months[months.length - 1]}` : "-"

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-white/5 h-full">
      <h2 className="text-lg font-semibold text-white mb-6">
        High-Level Summary
      </h2>

      <div className="divide-y divide-white/5">
        <div className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <IndianRupeeIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">
              Total Transactions Processed
            </p>
            <p className="text-lg font-semibold text-white">
              {totalTransactions ?? 0}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Statement Date Range</p>
            <p className="text-lg font-semibold text-white">{dateRange}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 py-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <BuildingIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Bank Detected</p>
            <p className="text-lg font-semibold text-white">
              {bankName ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
