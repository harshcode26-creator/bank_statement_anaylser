import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTransactions } from "../services/api.js"

function InsightCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-800 border border-white/10 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

function HighlightedText({ text, query }) {
  if (!query) return text

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"))

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={`${part}-${index}`}
        className="bg-purple-100 text-purple-700 px-1 rounded"
      >
        {part}
      </span>
    ) : (
      part
    ),
  )
}

function getCategoryTitle(name) {
  if (!name) return "Category"

  try {
    return decodeURIComponent(name)
  } catch {
    return name
  }
}

export default function CategoryDetails() {
  const { id, name } = useParams()
  const navigate = useNavigate()
  const categoryTitle = getCategoryTitle(name)
  const categoryName = categoryTitle
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadedKey, setLoadedKey] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const requestKey = `${id ?? ""}:${categoryName}`

  const goBack = () => {
    navigate(`/dashboard/${id}/category-breakdown`)
  }

  useEffect(() => {
    if (!id) {
      navigate("/upload")
      return undefined
    }

    let isMounted = true

    getTransactions(id, { category: categoryName })
      .then((transactionData) => {
        if (!isMounted) return

        setTransactions(transactionData)
        setError("")
      })
      .catch((fetchError) => {
        if (!isMounted) return

        console.error(fetchError)
        setError("Unable to load category transactions.")
        setTransactions([])
      })
      .finally(() => {
        if (!isMounted) return

        setLoadedKey(requestKey)
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [categoryName, id, navigate, requestKey])

  const categoryTransactions = useMemo(() => {
    return transactions.map((tx, index) => ({
        id: `${tx.date ?? "unknown"}-${tx.description ?? "transaction"}-${index}`,
        description: tx.description ?? "Unknown transaction",
        date: tx.date ?? "-",
        bank: tx.bank ?? tx.type ?? "-",
        amount: Number(tx.amount ?? 0),
      }))
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.toLowerCase()

    return categoryTransactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(query) ||
        tx.bank.toLowerCase().includes(query),
    )
  }, [categoryTransactions, searchQuery])

  const total = useMemo(
    () => categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    [categoryTransactions],
  )
  const transactionCount = categoryTransactions.length

  const highestSpend = useMemo(
    () => Math.max(...categoryTransactions.map((transaction) => transaction.amount), 0),
    [categoryTransactions],
  )

  const avgSpend = useMemo(
    () => (transactionCount ? total / transactionCount : 0),
    [total, transactionCount],
  )

  const isLoading = loading || loadedKey !== requestKey

  if (isLoading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
        <div className="text-slate-400 text-sm font-medium">Loading transactions...</div>
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
            onClick={goBack}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-start sm:items-center gap-4">
        <button
          onClick={goBack}
          className="p-2 rounded-lg hover:bg-white/5 transition-all duration-200 hover:opacity-80 text-white"
        >
          &larr;
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {categoryTitle}
          </h1>
          <p className="text-sm text-slate-400">
            Spending insights & transactions
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800 border border-white/10 p-6">
        <p className="text-sm text-slate-400">Total Spent</p>
        <h2 className="text-4xl font-bold text-purple-400 mt-2">
          &#8377;{total.toLocaleString()}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InsightCard label="Transactions" value={transactionCount} />
        <InsightCard
          label="Highest Spend"
          value={`\u20B9${highestSpend.toLocaleString()}`}
        />
        <InsightCard
          label="Average Spend"
          value={`\u20B9${avgSpend.toLocaleString()}`}
        />
      </div>

      <div className="rounded-2xl bg-slate-800 border border-white/10">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-white">
            Transactions
          </h3>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by merchant or bank"
            className="rounded-full bg-slate-700 px-4 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200"
          />
        </div>

        {!filteredTransactions.length ? (
          <div className="px-6 py-12 text-sm text-slate-400 text-center">
            No transactions found in this category.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between px-6 py-4 border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="font-medium text-white">
                  <HighlightedText
                    text={tx.description}
                    query={searchQuery}
                  />
                </p>
                <p className="text-sm text-slate-400">{tx.date}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400">{tx.bank}</p>
                <p className="font-semibold text-white">
                  &#8377;{tx.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
