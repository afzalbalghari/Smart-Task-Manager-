import { CheckCircle2, Clock, AlertCircle, LayoutGrid } from "lucide-react";
import clsx from "clsx";

const stats = [
  { key: "total_boards",   label: "Total Boards",     icon: LayoutGrid,    color: "text-primary-400", bg: "bg-primary-500/10" },
  { key: "completed",      label: "Completed",        icon: CheckCircle2,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "pending",        label: "Pending",          icon: Clock,         color: "text-amber-400",   bg: "bg-amber-500/10"   },
  { key: "overdue",        label: "Overdue",          icon: AlertCircle,   color: "text-red-400",     bg: "bg-red-500/10"     },
];

export default function StatsWidget({ summary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.key} className="card p-4">
            <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center mb-3", s.bg)}>
              <Icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-slate-100">{summary?.[s.key] ?? "—"}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
