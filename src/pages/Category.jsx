import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CategoryDetails from "../components/category/CategoryDetails.jsx"
import CategoryOverview from "../components/category/CategoryOverview.jsx"

export default function Category() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state
  const [tab, setTab] = useState("overview")
  const activeCategory = null

  useEffect(() => {
    console.log(data)
  }, [data])

  const categoryEntries = useMemo(() => {
    return Object.entries(data?.categories ?? {})
      .map(([name, value]) => ({
        name,
        value: Number(value ?? 0),
      }))
      .filter((category) => category.value > 0)
  }, [data])

  const changeTab = (tab) => {
    setTab(tab)
  }

  const goToCategoryDetails = (categoryName) => {
    navigate(`/dashboard/category/${encodeURIComponent(categoryName)}`, {
      state: data,
    })
  }

  if (!data) {
    return (
      <div className="w-full px-6 py-6 text-slate-200 bg-transparent">
        <div className="rounded-2xl bg-slate-800 border border-white/10 p-6 text-center">
          <h1 className="text-2xl font-semibold text-white">No data available</h1>
          <p className="text-slate-400 mt-2">Please upload statement.</p>
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
