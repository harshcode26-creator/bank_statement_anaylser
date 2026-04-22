import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import HighLevelSummary from "../components/dashboard/HighLevelSummary.jsx"
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart.jsx"
import KpiCards from "../components/dashboard/KpiCards.jsx"
import { getTransactions, getUploadById } from "../services/api.js"

function formatAmount(value) {
  return Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadedId, setLoadedId] = useState(null)

  useEffect(() => {
    if (!id) {
      navigate("/upload")
      return undefined
    }

    let isMounted = true

    Promise.all([getUploadById(id), getTransactions(id)])
      .then(([uploadData, transactionData]) => {
        if (!isMounted) return

        setData(uploadData)
        setTransactions(transactionData)
        setError("")
      })
      .catch((fetchError) => {
        if (!isMounted) return

        console.error(fetchError)
        setError("Unable to load dashboard data.")
        setData(null)
        setTransactions([])
      })
      .finally(() => {
        if (!isMounted) return

        setLoadedId(id)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id, navigate])

  const summary = data?.summary ?? { income: 0, expense: 0, net: 0 }
  const categories = data?.categories
  const monthly = data?.monthly
  const topMerchants = data?.topMerchants ?? []
  const insights = data?.insights ?? []
  const preview = transactions.slice(0, 10)
  const totalTransactions = Number(data?.totalTransactions ?? transactions.length ?? preview.length ?? 0)

  const categoryEntries = useMemo(() => {
    return Object.entries(categories ?? {})
      .filter(([, value]) => Number(value ?? 0) > 0)
      .map(([name, value]) => ({
        name,
        value: Number(value ?? 0),
      }))
  }, [categories])

  const maxCategoryValue = useMemo(() => {
    if (!categoryEntries.length) return 1
    return Math.max(...categoryEntries.map((item) => item.value), 1)
  }, [categoryEntries])

  const startNewUpload = () => {
    navigate("/upload")
  }

  const goToCategoryBreakdown = () => {
    navigate(`/dashboard/${id}/category-breakdown`)
  }

  const goToMonthly = () => {
    navigate(`/dashboard/${id}/monthly`)
  }

  const goToCategoryDetails = (name) => {
    navigate(`/dashboard/${id}/category/${encodeURIComponent(name)}`)
  }

  const isLoading = loading || loadedId !== id

  if (isLoading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
        <div className="text-slate-400 text-sm font-medium">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4 text-sm font-medium bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-lg">
            {error}
          </div>
          <button
            className="mt-2 px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:opacity-80"
            onClick={startNewUpload}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data || totalTransactions === 0) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">No data available</h1>
          <p className="text-slate-400 mt-2">
            Upload a bank statement to generate your dashboard.
          </p>
          <button
            className="mt-6 px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:opacity-80"
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
      <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-slate-400">Financial Overview</p>
            </div>

            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg
                 text-sm font-medium bg-indigo-600 text-white
                 hover:bg-indigo-700 transition-all duration-200 hover:opacity-80"
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
            <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-6">Top Merchants</h2>
              {!topMerchants.length ? (
                <div className="text-sm text-slate-400 text-center py-4">
                  No merchant data available
                </div>
              ) : (
                <div className="space-y-4">
                  {topMerchants.map((merchant, index) => (
                    <div key={merchant.name + index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white truncate max-w-[200px]">
                          {merchant.name}
                        </span>
                        <span className="text-xs text-slate-400">Merchant</span>
                      </div>
                      <span className="text-sm font-semibold text-indigo-400">
                        &#8377;{formatAmount(merchant.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-6">Smart Insights</h2>
              {!insights.length ? (
                <div className="text-sm text-slate-400 text-center py-4">
                  No insights available for this period
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <span className="text-indigo-400 text-sm">💡</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-6">
                <button
                  type="button"
                  className="text-left hover:text-indigo-300 transition-all duration-200 hover:opacity-80"
                  onClick={goToCategoryBreakdown}
                >
                  Category Breakdown
                </button>
              </h2>

              {!categoryEntries.length ? (
                <div className="text-sm text-slate-400 text-center py-4">
                  No category data available
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryEntries.map((category) => (
                    <div
                      key={category.name}
                      className="cursor-pointer group"
                      onClick={() => goToCategoryDetails(category.name)}
                    >
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-300 group-hover:text-white transition-colors">{category.name}</span>
                        <span className="text-white font-medium">
                          &#8377;{formatAmount(category.value)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-500"
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

            <div className="bg-slate-800 rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Recent Transactions
                </h2>
                <button
                  type="button"
                  className="text-sm text-slate-400 hover:text-indigo-300 transition-all duration-200 hover:opacity-80"
                  onClick={goToMonthly}
                >
                  Monthly
                </button>
              </div>

              {!preview.length ? (
                <div className="text-sm text-slate-400 text-center py-4">
                  No transactions found.
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
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
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
            className="rounded-xl border border-white/10 bg-slate-800/60
               backdrop-blur p-5 text-sm text-slate-300"
          >
            <p className="font-medium text-white">Privacy Notice</p>
            <p className="mt-1 text-slate-400">
              Your data is processed temporarily and discarded.
            </p>
          </section>
      </div>
    </div>
  )
}
