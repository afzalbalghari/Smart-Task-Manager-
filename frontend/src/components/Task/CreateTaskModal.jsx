import { useState } from "react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { priorityOptions } from "../../utils/priorityUtils";
import { Sparkles } from "lucide-react";
import { aiService } from "../../services/aiService";
import toast from "react-hot-toast";

export default function CreateTaskModal({ listId, listTitle, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium", due_date: "", tags: ""
  });
  const [loading,    setLoading]    = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiResult,   setAiResult]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      };
      await onCreate(listId, payload);
      onClose();
    } finally { setLoading(false); }
  };

  const handleAISuggest = async () => {
    if (!form.title) { toast.error("Enter a task title first"); return; }
    setAiLoading(true);
    try {
      const result = await aiService.suggest(form.title, form.description);
      setAiResult(result);
    } catch { toast.error("AI not available — check API key"); }
    finally { setAiLoading(false); }
  };

  const applySubtask = (sub) => {
    setForm(p => ({ ...p, title: sub }));
    setAiResult(null);
  };

  return (
    <Modal title={`Add Task to "${listTitle}"`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Title *</label>
          <div className="flex gap-2">
            <input
              className="input flex-1" required
              placeholder="e.g. Design login screen"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            />
            <Button type="button" variant="ghost" loading={aiLoading} onClick={handleAISuggest}
                    className="shrink-0 border border-border gap-1.5">
              <Sparkles size={14} className="text-primary-400" />
              <span className="text-xs">AI</span>
            </Button>
          </div>
        </div>

        {/* AI suggestions */}
        {aiResult && (
          <div className="card p-3 border-primary-500/40 bg-primary-500/5 space-y-2">
            <p className="text-xs font-semibold text-primary-400 flex items-center gap-1">
              <Sparkles size={12} /> AI Suggested Subtasks (click to use)
            </p>
            <div className="space-y-1">
              {aiResult.subtasks?.map((s, i) => (
                <button key={i} type="button" onClick={() => applySubtask(s)}
                        className="block w-full text-left text-xs text-slate-300 px-2 py-1.5
                                   hover:bg-primary-500/20 rounded transition-colors">
                  → {s}
                </button>
              ))}
            </div>
            {aiResult.tips && (
              <p className="text-xs text-slate-500 border-t border-border pt-2 mt-2">
                💡 {aiResult.tips}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-400 mb-1">Description</label>
          <textarea className="input resize-none" rows={2}
            placeholder="Optional details..."
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Priority</label>
            <select className="input" value={form.priority}
              onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              {priorityOptions.map(o => (
                <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Due Date</label>
            <input type="date" className="input"
              value={form.due_date}
              onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Tags (comma separated)</label>
          <input className="input"
            placeholder="e.g. frontend, urgent"
            value={form.tags}
            onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Add Task</Button>
        </div>
      </form>
    </Modal>
  );
}
