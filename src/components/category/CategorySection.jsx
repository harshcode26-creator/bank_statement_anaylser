import CategoryRow from "./CategoryRow.jsx"

const typeClasses = {
  income: "bg-green-50 text-green-700",
  expense: "bg-red-50 text-red-700",
  uncategorized: "bg-orange-50 text-orange-700",
}

export default function CategorySection({
  title,
  total,
  type,
  categories = [],
}) {
  const visibleCategories = categories.filter(
    (category) => Number(category.amount ?? category.value ?? 0) > 0,
  )

  return (
    <div className="space-y-4">
      <div
        className={`flex justify-between items-center rounded-lg px-4 py-3 ${
          typeClasses[type] || ""
        }`}
      >
        <p className="font-medium">{title}</p>
        <p className="font-semibold">
          &#8377;{Number(total ?? 0).toLocaleString()}
        </p>
      </div>

      {visibleCategories.map((category) => (
        <CategoryRow
          key={category.name}
          name={category.name}
          amount={category.amount}
          percent={category.percent}
          icon={category.icon}
          color={category.color}
        />
      ))}
    </div>
  )
}
