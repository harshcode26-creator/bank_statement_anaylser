export default function MonthlyCard({ month, income, expenses, netCashFlow }) {
  return (
    <div
      className="bg-white rounded-xl border p-4 sm:p-5 shadow-sm
           hover:shadow-md transition"
    >
      <h3 className="text-base sm:text-lg font-semibold mb-3">{month}</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Income</span>
          <span className="font-medium">&#8377;{income}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Expenses</span>
          <span className="font-medium">&#8377;{expenses}</span>
        </div>

        <div className="flex justify-between pt-2 border-t">
          <span className="text-gray-500">Net Cash Flow</span>

          <span
            className={`font-semibold flex items-center gap-1 ${
              netCashFlow >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{netCashFlow >= 0 ? ":arrow_upper_right:" : ":arrow_lower_right:"}</span>
            &#8377;{Math.abs(netCashFlow)}
          </span>
        </div>
      </div>
    </div>
  )
}
