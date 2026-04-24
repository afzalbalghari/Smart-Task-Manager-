import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Flag, CheckCircle2, Circle, Trash2, GripVertical } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { getPriorityColor } from "../../utils/priorityUtils";
import clsx from "clsx";

export default function TaskCard({ task, onClick, onToggle, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const pc = getPriorityColor(task.priority);

  return (
    <div
      ref={setNodeRef} style={style}
      className={clsx(
        "card p-3 group cursor-pointer hover:border-slate-500 transition-all duration-200",
        isDragging && "ring-2 ring-primary-500 shadow-xl"
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes} {...listeners}
          className="mt-0.5 text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </button>

        {/* Complete toggle */}
        <button
          className="mt-0.5 shrink-0"
          onClick={e => { e.stopPropagation(); onToggle(task.id); }}
        >
          {task.is_completed
            ? <CheckCircle2 size={16} className="text-emerald-400" />
            : <Circle size={16} className="text-slate-600 hover:text-slate-400" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={clsx("text-sm leading-snug", task.is_completed && "line-through text-slate-500")}>
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {/* Priority */}
              <span className={clsx("flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border", pc.bg, pc.text, pc.border)}>
                <Flag size={10} /> {task.priority}
              </span>

              {/* Due date */}
              {task.due_date && (
                <span className={clsx("flex items-center gap-1 text-xs", task.is_overdue ? "text-red-400" : "text-slate-500")}>
                  <Calendar size={10} /> {formatDate(task.due_date)}
                </span>
              )}
            </div>

            {/* Delete */}
            <button
              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
              onClick={e => { e.stopPropagation(); onDelete(task.id); }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
