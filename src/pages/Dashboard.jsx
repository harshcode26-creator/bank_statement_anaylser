import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import HighLevelSummary from "../components/dashboard/HighLevelSummary.jsx"
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart.jsx"
import KpiCards from "../components/dashboard/KpiCards.jsx"

function formatAmount(value) {
  return Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    console.log(data)
  }, [data])

  const summary = data?.summary ?? { income: 0, expense: 0, net: 0 }
  const categories = data?.categories
  const monthly = data?.monthly
  const preview = data?.preview ?? []
  const transactions = data?.transactions ?? []
  const totalTransactions = Number(data?.totalTransactions ?? transactions.length ?? preview.length ?? 0)

  const categoryEntries = useMemo(() => {
    return Object.entries(categories ?? {})
      .map(([name, value]) => ({
        name,
        value: Number(value ?? 0),
      }))
      .filter((item) => item.value > 0)
  }, [categories])

  const maxCategoryValue = useMemo(() => {
    if (!categoryEntries.length) return 1
    return Math.max(...categoryEntries.map((item) => item.value), 1)
  }, [categoryEntries])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true)
    }, 250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const startNewUpload = () => {
    navigate("/upload")
  }

  const goToCategoryBreakdown = () => {
    navigate("/dashboard/category-breakdown", { state: data })
  }

  const goToMonthly = () => {
    navigate("/dashboard/monthly", { state: data })
  }

  const goToCategoryDetails = (name) => {
    navigate(`/dashboard/category/${encodeURIComponent(name)}`, { state: data })
  }

  if (!data) {
    return (
      <div className="min-h-full bg-transparent flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">No analysis data found</h1>
          <p className="text-slate-400 mt-2">
            Upload a bank statement to generate your dashboard.
          </p>
          <button
            className="mt-6 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
            onClick={startNewUpload}
          >
            Upload Statement
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-transparent">
      {!isReady ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          Loading dashboard...
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-slate-400">Financial Overview</p>
            </div>

            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg
                 text-sm font-medium bg-indigo-600 text-white
                 hover:bg-indigo-700 transition"
              onClick={startNewUpload}
            >
              &uarr; Upload New Statement
            </button>
          </div>

          <div className="h-px bg-white/10 mb-8"></div>

          <section className="mb-8">
            <KpiCards
              totals={{
                income: summary.income,
                expense: summary.expense,
              }}
              netCashFlowWithManual={summary.net}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <IncomeExpenseChart monthly={monthly} />
            <HighLevelSummary
              totalTransactions={totalTransactions}
              monthlySummary={monthly}
              bankName="-"
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-6">
                <button
                  type="button"
                  className="text-left hover:text-indigo-300 transition"
                  onClick={goToCategoryBreakdown}
                >
                  Category Breakdown
                </button>
              </h2>

              {!categoryEntries.length ? (
                <div className="text-sm text-slate-400">
                  No category data available
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryEntries.map((category) => (
                    <div
                      key={category.name}
                      className="cursor-pointer"
                      onClick={() => goToCategoryDetails(category.name)}
                    >
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-300">{category.name}</span>
                        <span className="text-white font-medium">
                          &#8377;{formatAmount(category.value)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                          style={{
                            width: `${(category.value / maxCategoryValue) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Recent Transactions
                </h2>
                <button
                  type="button"
                  className="text-sm text-slate-400 hover:text-indigo-300 transition"
                  onClick={goToMonthly}
                >
                  Monthly
                </button>
              </div>

              {!preview.length ? (
                <div className="text-sm text-slate-400">
                  No transaction preview available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="py-3 text-left font-medium">Date</th>
                        <th className="py-3 text-left font-medium">Description</th>
                        <th className="py-3 text-right font-medium">Type</th>
                        <th className="py-3 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((transaction, index) => (
                        <tr
                          key={`${transaction.date}-${transaction.description}-${transaction.amount}-${index}`}
                          className="border-b border-white/5"
                        >
                          <td className="py-3 text-slate-300">{transaction.date}</td>
                          <td className="py-3 text-white">{transaction.description}</td>
                          <td className="py-3 text-right">
                            <span
                              className={
                                transaction.type === "credit"
                                  ? "text-green-400"
                                  : "text-sky-400"
                              }
                            >
                              {transaction.type}
                            </span>
                          </td>
                          <td className="py-3 text-right text-white">
                            &#8377;{formatAmount(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section
            className="rounded-2xl border border-white/10 bg-slate-800/60
               backdrop-blur p-5 text-sm text-slate-300"
          >
            <p className="font-medium text-white">Privacy Notice</p>
            <p className="mt-1 text-slate-400">
              Your data is processed temporarily and discarded.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}
