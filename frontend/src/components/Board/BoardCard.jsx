import { useNavigate } from "react-router-dom";
import { Trash2, LayoutGrid, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export default function BoardCard({ board, onDelete }) {
  const navigate = useNavigate();
  const pct = board.task_count
    ? Math.round((board.completed_count / board.task_count) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="card p-5 cursor-pointer hover:border-slate-500 transition-all duration-200
                 hover:shadow-lg hover:-translate-y-0.5 group relative overflow-hidden"
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: board.color }}
      />

      <div className="flex items-start justify-between mt-1">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
             style={{ backgroundColor: board.color + "33" }}>
          <LayoutGrid size={18} style={{ color: board.color }} />
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(board.id); }}
          className="opacity-0 group-hover:opacity-100 btn-ghost p-1.5 text-slate-500 hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <h3 className="font-semibold text-slate-100 truncate mb-1">{board.title}</h3>
      <p className="text-sm text-slate-500 truncate mb-4">{board.description || "No description"}</p>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} /> {board.completed_count}/{board.task_count} tasks
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: board.color }}
          />
        </div>
      </div>
    </div>
  );
}
