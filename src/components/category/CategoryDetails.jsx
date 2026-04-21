import CategoryRow from "./CategoryRow.jsx"

export default function CategoryDetails({ categoryEntries = [], onCategorySelect }) {
  const visibleCategories = categoryEntries.filter(
    (category) => Number(category.value ?? 0) > 0,
  )
  const total = visibleCategories.reduce(
    (sum, category) => sum + Number(category.value ?? 0),
    0,
  )
  const normalizedCategories = visibleCategories.map((category) => ({
    name: category.name,
    amount: Number(category.value ?? 0),
    percent: total ? Math.round((Number(category.value ?? 0) / total) * 100) : 0,
  }))

  return (
    <div className="space-y-8 text-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          Category-wise Breakdown
        </h2>
        <p className="text-sm text-slate-400">
          Click on a category to view detailed transactions
        </p>
      </div>

      {normalizedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {normalizedCategories.map((category) => (
            <CategoryRow
              key={category.name}
              name={category.name}
              amount={category.amount}
              percent={category.percent}
              onSelect={onCategorySelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400">No category data available.</div>
      )}
    </div>
  )
}
