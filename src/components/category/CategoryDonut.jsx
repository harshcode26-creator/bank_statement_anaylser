import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const COLORS = ["#6366F1", "#0EA5E9", "#22C55E", "#F59E0B", "#94A3B8"]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const item = payload[0]

  return (
    <div className="rounded-lg bg-slate-950 border border-white/10 px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-white">{item.name}</p>
      <p className="text-slate-300">
        &#8377;{Number(item.value ?? 0).toLocaleString()}
      </p>
    </div>
  )
}

export default function CategoryDonut({ categoryEntries = [] }) {
  const chartData = categoryEntries.filter(
    (category) => Number(category.value ?? 0) > 0,
  )

  return (
    <div className="w-[220px] h-[220px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            paddingAngle={0}
            stroke="#0F172A"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ display: "none" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
