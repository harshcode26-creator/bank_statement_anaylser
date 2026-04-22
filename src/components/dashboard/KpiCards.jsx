function formatAmount(value) {
  return Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })
}

export default function KpiCards({ totals, netCashFlowWithManual }) {
  const income = Number(totals?.income ?? 0)
  const expense = Number(totals?.expense ?? 0)
  const netCashFlow = Number(netCashFlowWithManual ?? 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div
        className="bg-slate-800 rounded-xl shadow-sm border border-white/5
             p-6 flex justify-between items-start"
      >
        <div>
          <p className="text-sm text-slate-400">Total Income</p>
          <h2 className="text-3xl font-bold text-white">
            &#8377;{formatAmount(income)}
          </h2>
          <p className="text-sm text-green-600 mt-2">Total credited amount</p>
        </div>

        <div className="bg-green-500/20 text-green-400 rounded-xl p-3 h-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      </div>

      <div
        className="bg-slate-800 rounded-xl shadow-sm border border-white/5
             p-6 flex justify-between items-start"
      >
        <div>
          <p className="text-sm text-slate-400">Total Expenses</p>
          <h2 className="text-3xl font-bold text-white mt-2">
            &#8377;{formatAmount(expense)}
          </h2>
          <p className="text-sm text-indigo-600 mt-2">Total debited amount</p>
        </div>

        <div className="bg-indigo-500/20 text-indigo-400 rounded-xl p-3 h-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <div
        className="bg-slate-800 rounded-xl shadow-sm border border-white/5
             p-6 flex justify-between items-start"
      >
        <div>
          <p className="text-sm text-slate-400">Net Cash Flow</p>
          <h2 className="text-3xl font-bold text-white mt-2">
            &#8377;{formatAmount(Math.abs(netCashFlow))}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            After manual adjustments
          </p>
        </div>

        <div className="bg-slate-700 text-slate-300 rounded-xl p-3 h-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-3h-6a2 2 0 000 4h6v-4z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
