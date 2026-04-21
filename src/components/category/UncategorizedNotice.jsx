export default function UncategorizedNotice({ count, amount, percentage }) {
  return (
    <div className="border border-dashed border-orange-400 bg-orange-50 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
          !
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-orange-700">
            Uncategorized Transactions
          </h4>
          <p className="text-sm text-orange-600">
            {count} transactions need categorization
          </p>

          <div className="mt-3 h-2 bg-orange-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="text-right font-semibold text-orange-700">
          &#8377;{Number(amount ?? 0).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
