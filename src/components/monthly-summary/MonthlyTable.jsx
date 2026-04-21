export default function MonthlyTable({ transactions = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Description</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx, index) => (
            <tr key={`${tx.date}-${tx.desc}-${index}`} className="border-b">
              <td className="py-2">{tx.date}</td>
              <td className="py-2">{tx.desc}</td>
              <td
                className={`py-2 text-right font-medium ${
                  tx.amount > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}&#8377;{Math.abs(tx.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
