import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = { completed: "#10b981", pending: "#f59e0b", overdue: "#ef4444" };

export default function TaskStatusPie({ summary }) {
  const data = [
    { name: "Completed", value: summary?.completed || 0 },
    { name: "Pending",   value: (summary?.pending || 0) - (summary?.overdue || 0) },
    { name: "Overdue",   value: summary?.overdue || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-200 mb-4">Task Breakdown</h3>
      {data.length === 0 ? (
        <p className="text-center text-slate-500 py-12 text-sm">No tasks yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              dataKey="value" stroke="none">
              {data.map((entry, i) => (
                <Cell key={i} fill={Object.values(COLORS)[i % 3]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              labelStyle={{ color: "#94a3b8" }} itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
