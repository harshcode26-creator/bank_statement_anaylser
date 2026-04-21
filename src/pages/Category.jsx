import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CategoryDetails from "../components/category/CategoryDetails.jsx"
import CategoryOverview from "../components/category/CategoryOverview.jsx"
import { getUploadById } from "../services/api.js"

export default function Category() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadedId, setLoadedId] = useState(null)
  const [tab, setTab] = useState("overview")
  const activeCategory = null

  useEffect(() => {
    if (!id) {
      navigate("/upload")
      return undefined
    }

    let isMounted = true

    getUploadById(id)
      .then((uploadData) => {
        if (!isMounted) return

        setData(uploadData)
        setError("")
      })
      .catch((fetchError) => {
        if (!isMounted) return

        console.error(fetchError)
        setError("Unable to load category data.")
        setData(null)
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

  const categoryEntries = useMemo(() => {
    return Object.entries(data?.categories ?? {})
      .filter(([, value]) => Number(value ?? 0) > 0)
      .map(([name, value]) => ({
        name,
        value: Number(value ?? 0),
      }))
  }, [data])

  const changeTab = (tab) => {
    setTab(tab)
  }

  const goToCategoryDetails = (categoryName) => {
    navigate(`/dashboard/${id}/category/${encodeURIComponent(categoryName)}`)
  }

  const isLoading = loading || loadedId !== id

  if (isLoading) {
    return (
      <div className="w-full px-6 py-6 text-slate-400 bg-transparent">
        Loading category data...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full px-6 py-6 text-slate-200 bg-transparent">
        <div className="rounded-2xl bg-slate-800 border border-white/10 p-6 text-center">
          <h1 className="text-2xl font-semibold text-white">No data available</h1>
          <p className="text-slate-400 mt-2">{error || "Please upload statement."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-6 text-slate-200 bg-transparent">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Category Breakdown
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          See how your money is distributed across different categories
        </p>
      </div>

      {!activeCategory && (
        <div className="mb-8">
          <div
            className="inline-flex rounded-xl bg-slate-800/70 p-1 w-[280px]
               border border-white/10"
          >
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                tab === "overview"
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => changeTab("overview")}
            >
              Overview
            </button>

            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                tab === "details"
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => changeTab("details")}
            >
              Details
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {tab === "overview" && <CategoryOverview categoryEntries={categoryEntries} />}
        {tab === "details" && !activeCategory && (
          <CategoryDetails
            categoryEntries={categoryEntries}
            onCategorySelect={goToCategoryDetails}
          />
        )}
      </div>
    </div>
  )
}
