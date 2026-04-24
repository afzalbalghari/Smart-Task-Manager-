import { formatDate } from "../../utils/dateUtils";
import { getPriorityColor } from "../../utils/priorityUtils";
import clsx from "clsx";

export default function RecentActivity({ notifications }) {
  if (!notifications?.length) return (
    <div className="card p-6 text-center text-slate-500 text-sm">No upcoming deadlines 🎉</div>
  );

  return (
    <div className="card divide-y divide-border">
      {notifications.slice(0, 6).map(n => {
        const pc = getPriorityColor(n.priority);
        return (
          <div key={n.task_id} className="flex items-center gap-3 px-4 py-3">
            <div className={clsx("w-2 h-2 rounded-full shrink-0", n.is_overdue ? "bg-red-400" : "bg-amber-400")} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 truncate">{n.title}</p>
              <p className={clsx("text-xs mt-0.5", n.is_overdue ? "text-red-400" : "text-slate-500")}>
                {n.is_overdue ? "Overdue · " : "Due · "}{formatDate(n.due_date)}
              </p>
            </div>
            <span className={clsx("text-xs px-2 py-0.5 rounded border shrink-0", pc.bg, pc.text, pc.border)}>
              {n.priority}
            </span>
          </div>
        );
      })}
    </div>
  );
}
