import { useState } from "react";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { BOARD_COLORS } from "../../utils/constants";
import clsx from "clsx";

export default function CreateBoardModal({ onCreate, onClose }) {
  const [form, setForm]     = useState({ title: "", description: "", color: BOARD_COLORS[0] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onCreate(form); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="Create New Board" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Board Title *</label>
          <input
            className="input" required
            placeholder="e.g. Final Year Project"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Description</label>
          <textarea
            className="input resize-none" rows={2}
            placeholder="What is this board about?"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {BOARD_COLORS.map(c => (
              <button
                key={c} type="button"
                className={clsx("w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                  form.color === c ? "border-white scale-110" : "border-transparent")}
                style={{ backgroundColor: c }}
                onClick={() => setForm(p => ({ ...p, color: c }))}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Board</Button>
        </div>
      </form>
    </Modal>
  );
}
