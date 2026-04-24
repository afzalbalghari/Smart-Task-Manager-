import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import TaskCard from "./TaskCard";
import clsx from "clsx";
import { useState } from "react";

export default function TaskColumn({ list, onAddTask, onTaskClick, onToggle, onDeleteTask, onDeleteList }) {
  const { setNodeRef, isOver } = useDroppable({ id: list.id });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-slate-200">{list.title}</h3>
          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
            {list.tasks?.length || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onAddTask(list.id)} className="btn-ghost p-1.5 text-slate-500 hover:text-slate-200">
            <Plus size={15} />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-1.5 text-slate-500 hover:text-slate-200">
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-36 card shadow-xl z-20 py-1">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  onClick={() => { onDeleteList(list.id); setMenuOpen(false); }}
                >
                  <Trash2 size={13} /> Delete List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={clsx(
          "flex-1 flex flex-col gap-2 p-2 rounded-xl min-h-24 transition-colors duration-200",
          isOver ? "bg-primary-500/10 ring-2 ring-primary-500/40" : "bg-slate-800/40"
        )}
      >
        <SortableContext items={list.tasks?.map(t => t.id) || []} strategy={verticalListSortingStrategy}>
          {list.tasks?.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onToggle={(id) => onToggle(id, list.id)}
              onDelete={(id) => onDeleteTask(id, list.id)}
            />
          ))}
        </SortableContext>

        {(!list.tasks || list.tasks.length === 0) && (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-600 py-4">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
