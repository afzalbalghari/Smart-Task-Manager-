import { useEffect, useState } from "react";
import Navbar from "../components/UI/Navbar";
import BoardGrid from "../components/Board/BoardGrid";
import CreateBoardModal from "../components/Board/CreateBoardModal";
import StatsWidget from "../components/Dashboard/StatsWidget";
import RecentActivity from "../components/Dashboard/RecentActivity";
import Button from "../components/UI/Button";
import Loader from "../components/UI/Loader";
import { useBoards } from "../hooks/useBoards";
import { analyticsService } from "../services/analyticsService";
import { Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { aiService } from "../services/aiService";
import Modal from "../components/UI/Modal";

export default function DashboardPage() {
  const { boards, loading, fetchBoards, createBoard, deleteBoard } = useBoards();
  const [showCreate,    setShowCreate]    = useState(false);
  const [summary,       setSummary]       = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAIGen,     setShowAIGen]     = useState(false);
  const [aiTitle,       setAiTitle]       = useState("");
  const [aiResult,      setAiResult]      = useState(null);
  const [aiLoading,     setAiLoading]     = useState(false);

  useEffect(() => {
    fetchBoards();
    analyticsService.getSummary().then(setSummary).catch(() => {});
    analyticsService.getNotifications().then(setNotifications).catch(() => {});
  }, [fetchBoards]);

  const handleCreate = async (payload) => {
    await createBoard(payload);
    analyticsService.getSummary().then(setSummary).catch(() => {});
    toast.success("Board created 🎉");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this board and all its tasks?")) return;
    await deleteBoard(id);
    toast.success("Board deleted");
  };

  const handleAIGenerate = async () => {
    if (!aiTitle) { toast.error("Enter a project title"); return; }
    setAiLoading(true);
    try {
      const result = await aiService.generate(aiTitle);
      setAiResult(result);
    } catch { toast.error("AI not available — check API key"); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">My Workspace</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your projects and tasks</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowAIGen(true)} className="border border-border gap-1.5">
              <Sparkles size={15} className="text-primary-400" /> AI Generate
            </Button>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> New Board
            </Button>
          </div>
        </div>

        {/* Stats */}
        {summary && <StatsWidget summary={summary} />}

        {/* Boards */}
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Boards</h2>
          {loading ? (
            <div className="flex justify-center py-16"><Loader /></div>
          ) : (
            <BoardGrid boards={boards} onDelete={handleDelete} />
          )}
        </section>

        {/* Recent / upcoming deadlines */}
        {notifications.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Upcoming Deadlines
            </h2>
            <RecentActivity notifications={notifications} />
          </section>
        )}
      </main>

      {showCreate && (
        <CreateBoardModal onCreate={handleCreate} onClose={() => setShowCreate(false)} />
      )}

      {/* AI Generate Modal */}
      {showAIGen && (
        <Modal title="🤖 AI Task Generator" onClose={() => { setShowAIGen(false); setAiResult(null); setAiTitle(""); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Project / Goal Title</label>
              <input className="input" placeholder="e.g. Build a portfolio website"
                value={aiTitle} onChange={e => setAiTitle(e.target.value)} />
            </div>
            <Button loading={aiLoading} onClick={handleAIGenerate} className="w-full justify-center">
              <Sparkles size={15} /> Generate Tasks
            </Button>
            {aiResult && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-xs text-slate-500">Estimated: {aiResult.total_estimated_hours}h total</p>
                {aiResult.tasks?.map((t, i) => (
                  <div key={i} className="card p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200">{t.title}</span>
                      <span className="text-xs text-slate-500">{t.estimated_hours}h</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                  </div>
                ))}
                <p className="text-xs text-slate-500 text-center pt-1">
                  Create a board and add these tasks manually, or copy them!
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
