import { useState } from "react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Badge from "../UI/Badge";
import { getPriorityColor } from "../../utils/priorityUtils";
import { formatDate } from "../../utils/dateUtils";
import { Calendar, Flag, Tag, CheckCircle2, Circle, Pencil } from "lucide-react";
import { taskService } from "../../services/taskService";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function TaskDetailModal({ task, listId, onClose, onUpdate, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    due_date: task.due_date ? task.due_date.slice(0, 10) : "",
  });
  const [saving, setSaving] = useState(false);
  const pc = getPriorityColor(task.priority);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      };
      await onUpdate(task.id, listId, payload);
      toast.success("Task updated");
      setEditing(false);
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Task Details" onClose={onClose} size="md">
      <div className="space-y-4">
        {/* Title */}
        {editing ? (
          <input className="input text-lg font-semibold" value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        ) : (
          <div className="flex items-start gap-2">
            <button onClick={() => onToggle(task.id, listId)} className="mt-1 shrink-0">
              {task.is_completed
                ? <CheckCircle2 size={20} className="text-emerald-400" />
                : <Circle size={20} className="text-slate-500" />}
            </button>
            <h3 className={clsx("text-lg font-semibold", task.is_completed && "line-through text-slate-500")}>
              {task.title}
            </h3>
          </div>
        )}

        {/* Meta chips */}
        <div className="flex items-center flex-wrap gap-2">
          <Badge label={task.priority} className={clsx(pc.bg, pc.text, pc.border)} />
          {task.due_date && (
            <span className={clsx("flex items-center gap-1 text-xs", task.is_overdue ? "text-red-400" : "text-slate-400")}>
              <Calendar size={12} /> {formatDate(task.due_date)}
            </span>
          )}
          {task.tags?.map(t => (
            <span key={t} className="flex items-center gap-1 text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
              <Tag size={10} /> {t}
            </span>
          ))}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-slate-500 mb-1 uppercase tracking-wider">Description</label>
          {editing ? (
            <textarea className="input resize-none" rows={4}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          ) : (
            <p className="text-sm text-slate-400">{task.description || "No description added."}</p>
          )}
        </div>

        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Priority</label>
              <select className="input" value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                {["low","medium","high"].map(o => (
                  <option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Due Date</label>
              <input type="date" className="input" value={form.due_date}
                onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {editing ? (
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <Button variant="ghost" className="ml-auto" onClick={() => setEditing(true)}>
              <Pencil size={14} /> Edit
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
