import CategoryDonut from "./CategoryDonut.jsx"

export default function CategoryOverview({ categoryEntries = [] }) {
  const visibleCategories = categoryEntries.filter(
    (category) => Number(category.value ?? 0) > 0,
  )

  return (
    <div className="flex flex-col items-center space-y-10">
      <div
        className="w-full max-w-3xl bg-slate-800 rounded-2xl
             border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">
          Category Distribution
        </h3>

        <div className="flex justify-center">
          <CategoryDonut categoryEntries={visibleCategories} />
        </div>

        <div className="flex justify-center gap-8 text-sm text-slate-300 mt-6 flex-wrap">
          {visibleCategories.map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
