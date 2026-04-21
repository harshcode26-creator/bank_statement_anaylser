import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUploadById } from "../services/api.js"

const format = (num) => new Intl.NumberFormat("en-IN").format(num)

function getMonthlyData(monthly) {
  return Object.entries(monthly ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, values]) => {
      const [year, month] = monthKey.split("-")
      const date = new Date(year, month - 1)

      return {
        month: date.toLocaleString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        income: Number(values.income ?? 0),
        expenses: Number(values.expense ?? 0),
        net: Number(values.net ?? Number(values.income ?? 0) - Number(values.expense ?? 0)),
      }
    })
}

export default function Monthly() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [stateData, setStateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadedId, setLoadedId] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const data = useMemo(() => getMonthlyData(stateData?.monthly), [stateData])

  useEffect(() => {
    if (!id) {
      navigate("/upload")
      return undefined
    }

    let isMounted = true

    getUploadById(id)
      .then((uploadData) => {
        if (!isMounted) return

        setStateData(uploadData)
        setError("")
      })
      .catch((fetchError) => {
        if (!isMounted) return

        console.error(fetchError)
        setError("Unable to load monthly summary.")
        setStateData(null)
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

  const isLoading = loading || loadedId !== id

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 md:px-10 pt-5 md:pt-8 pb-8 text-slate-400 bg-transparent">
        Loading monthly summary...
      </div>
    )
  }

  if (error || !stateData) {
    return (
      <div className="min-h-screen px-4 md:px-10 pt-5 md:pt-8 pb-8 text-slate-200 bg-transparent">
        <div className="rounded-2xl bg-slate-800 border border-white/10 p-6 text-center">
          <h1 className="text-2xl font-semibold text-white">No data available</h1>
          <p className="text-slate-400 mt-2">{error || "Please upload statement."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 md:px-10 pt-5 md:pt-8 pb-8 text-slate-200 bg-transparent">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Monthly Financial Summary
          </h1>
          <p className="text-slate-400 mt-1">
            Month-wise income, expenses, and net cash flow
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Generated from processed bank statement
          </p>
        </div>

        <div
          className="inline-flex w-full md:w-[220px]
               rounded-full bg-slate-800/70 border border-white/10 p-1"
        >
          <button
            onClick={() => setViewMode("table")}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
              viewMode === "table"
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Table
          </button>

          <button
            onClick={() => setViewMode("cards")}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
              viewMode === "cards"
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cards
          </button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="bg-slate-800 border border-white/10 rounded-xl mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full">
              <thead className="bg-slate-700/50 text-slate-300 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Month</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Total Income
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Total Expenses
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Net Cash Flow
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.month}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-4 font-medium text-white">
                      {item.month}
                    </td>

                    <td className="px-4 py-4 text-right">
                      &#8377;{format(item.income)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      &#8377;{format(item.expenses)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className={`font-semibold ${
                          item.net >= 0 ? "text-green-400" : "text-sky-400"
                        }`}
                      >
                        {item.net < 0 ? "-" : ""}&#8377;
                        {format(Math.abs(item.net))}
                      </span>
                    </td>
                  </tr>
                ))}
                {!data.length && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-400" colSpan={4}>
                      No monthly data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!data.length && (
            <div className="text-sm text-slate-400">No monthly data available.</div>
          )}
          {data.map((item) => (
            <div
              key={`${item.month}-card`}
              className="bg-slate-800 rounded-xl p-6 border border-white/10
               hover:bg-slate-700/70 transition"
            >
              <h3 className="font-semibold text-lg mb-4 text-white">
                {item.month}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Income</span>
                  <span className="font-semibold">
                    &#8377;{format(item.income)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Expenses</span>
                  <span className="font-semibold">
                    &#8377;{format(item.expenses)}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between">
                  <span className="font-semibold">Net Cash Flow</span>
                  <span
                    className={`font-bold ${
                      item.net >= 0 ? "text-green-400" : "text-sky-400"
                    }`}
                  >
                    {item.net < 0 ? "-" : ""}&#8377;
                    {format(Math.abs(item.net))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="mt-10 bg-slate-800/60 border border-white/10 rounded-lg
             p-4 text-sm text-slate-300 text-center"
      >
        Monthly values are generated using verified transaction data. Totals
        match bank statement records.
      </div>

      <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
        By default, your data is processed in memory and discarded.
      </div>
    </div>
  )
}
