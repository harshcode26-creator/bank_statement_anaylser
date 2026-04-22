import { useEffect, useMemo, useState } from "react"

const chartHeight = 220

function formatMonthLabel(monthKey) {
  const [year, month] = String(monthKey || "").split("-")
  const parsedYear = Number(year)
  const parsedMonth = Number(month)

  if (!parsedYear || !parsedMonth) {
    return String(monthKey || "")
  }

  return new Date(parsedYear, parsedMonth - 1).toLocaleString("en-IN", {
    month: "short",
  })
}

export default function IncomeExpenseChart({ monthly }) {
  const [animated, setAnimated] = useState(false)
  const data = monthly

  const chartData = useMemo(() => {
    return Object.entries(data ?? {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        month: key,
        income: Number(value?.income ?? 0),
        expense: Number(value?.expense ?? 0),
      }))
  }, [data])

  const maxValue = useMemo(() => {
    if (!chartData.length) return 1

    const all = chartData.flatMap((item) => [item.income, item.expense])
    const max = Math.max(...all)

    return Number.isFinite(max) && max > 0 ? max : 1
  }, [chartData])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimated(true)
    }, 100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
      <h2 className="text-lg font-semibold text-white mb-6">
        Income vs Expenses Overview
      </h2>

      {!chartData.length ? (
        <div className="text-sm text-slate-400">No monthly data available</div>
      ) : (
        <div className="overflow-x-auto lg:overflow-x-hidden scrollbar-hide">
          <div className="relative flex min-w-[640px]">
            <div className="flex flex-col justify-between h-[220px] pr-4 text-sm text-slate-400 shrink-0">
              <span>&#8377;{maxValue}</span>
              <span>&#8377;{Math.round(maxValue * 0.75)}</span>
              <span>&#8377;{Math.round(maxValue * 0.5)}</span>
              <span>&#8377;{Math.round(maxValue * 0.25)}</span>
              <span>&#8377;0</span>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="border-t border-dashed border-white/10"
                  ></div>
                ))}
              </div>

              <div className="relative flex items-end h-[220px] gap-6 px-4">
                {chartData.map((item) => (
                  <div
                    key={item.month}
                    className="flex flex-col items-center w-[72px]"
                  >
                    <div className="flex items-end gap-2 h-full">
                      <div
                        className="w-6 rounded-md transition-all duration-700 ease-out
                         bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-400
                         shadow-[0_0_14px_rgba(16,185,129,0.28)]"
                        style={{
                          height: animated
                            ? `${(item.income / maxValue) * chartHeight}px`
                            : "0px",
                        }}
                      ></div>

                      <div
                        className="w-6 rounded-md transition-all duration-700 ease-out
                         bg-gradient-to-t from-sky-700 via-sky-600 to-sky-400
                         shadow-[0_0_14px_rgba(14,165,233,0.28)]"
                        style={{
                          height: animated
                            ? `${(item.expense / maxValue) * chartHeight}px`
                            : "0px",
                        }}
                      ></div>
                    </div>

                    <span className="mt-3 text-sm text-slate-400">
                      {formatMonthLabel(item.month)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-[28px] left-0 right-0 border-t border-white/20"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-6 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          Income
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-500"></span>
          Expenses
        </div>
      </div>
    </div>
  )
}
