import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400">{label}</p>
      <p className="text-primary-400 font-semibold">{payload[0].value} completed</p>
    </div>
  );
};

export default function ProductivityChart({ data }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-200 mb-4">Weekly Productivity</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
