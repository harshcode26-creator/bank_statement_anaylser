const cardClasses = {
  income: "bg-green-50 border-green-200",
  expense: "bg-red-50 border-red-200",
  balance: "bg-blue-50 border-blue-200",
}

const labelClasses = {
  income: "text-green-600",
  expense: "text-red-600",
  balance: "text-blue-600",
}

const amountClasses = {
  income: "text-green-700",
  expense: "text-red-700",
  balance: "text-blue-700",
}

export default function CategorySummaryCard({
  title,
  amount,
  type,
  subtitle,
  isCount = false,
}) {
  const isNumeric = typeof amount === "number"
  const displayAmount = isNumeric
    ? isCount
      ? amount.toLocaleString("en-IN")
      : `₹${amount.toLocaleString("en-IN")}`
    : amount

  return (
    <div className={`rounded-xl p-6 border ${cardClasses[type] || ""}`}>
      <p className={`text-sm font-medium ${labelClasses[type] || ""}`}>
        {title}
      </p>

      <p className={`text-2xl font-semibold mt-2 ${amountClasses[type] || ""}`}>
        {displayAmount}
      </p>

      {subtitle && <p className="text-sm mt-2 text-slate-500">{subtitle}</p>}
    </div>
  )
}
