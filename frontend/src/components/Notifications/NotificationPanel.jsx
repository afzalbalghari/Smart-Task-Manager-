import { useNotifications } from "../../context/NotificationContext";
import { formatDate } from "../../utils/dateUtils";
import { AlertCircle, Clock, X } from "lucide-react";
import clsx from "clsx";

export default function NotificationPanel({ onClose }) {
  const { notifications } = useNotifications();

  return (
    <div className="absolute right-0 top-12 w-80 card shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-slate-100">Notifications</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          <X size={14} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-slate-500 text-sm">All caught up! 🎉</div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.task_id}
              className={clsx(
                "flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-slate-700/30",
                n.is_overdue ? "border-l-2 border-l-red-500" : "border-l-2 border-l-amber-500"
              )}
            >
              {n.is_overdue
                ? <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                : <Clock size={16} className="text-amber-400 mt-0.5 shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm text-slate-200 truncate">{n.title}</p>
                <p className={clsx("text-xs mt-0.5", n.is_overdue ? "text-red-400" : "text-amber-400")}>
                  {n.is_overdue ? "Overdue — " : "Due "}{formatDate(n.due_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
