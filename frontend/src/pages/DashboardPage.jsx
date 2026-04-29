import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import BoardGrid from "../components/Board/BoardGrid";
import CreateBoardModal from "../components/Board/CreateBoardModal";
import StatsWidget from "../components/Dashboard/StatsWidget";
import RecentActivity from "../components/Dashboard/RecentActivity";
import Button from "../components/UI/Button";
import Loader from "../components/UI/Loader";
import AIGenerateModal from "../components/AI/AIGenerateModal";
import { useBoards } from "../hooks/useBoards";
import { analyticsService } from "../services/analyticsService";
import { Plus, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { boards, loading, fetchBoards, createBoard, deleteBoard } = useBoards();
  const [showCreate,    setShowCreate]    = useState(false);
  const [showAI,        setShowAI]        = useState(false);
  const [summary,       setSummary]       = useState(null);
  const [notifications, setNotifications] = useState([]);

  const refreshData = useCallback(() => {
    fetchBoards();
    analyticsService.getSummary().then(setSummary).catch(() => {});
    analyticsService.getNotifications().then(setNotifications).catch(() => {});
  }, [fetchBoards]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleCreate = async (payload) => {
    try {
      await createBoard(payload);
      analyticsService.getSummary().then(setSummary).catch(() => {});
      toast.success("Board created 🎉");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create board");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this board and all its tasks?")) return;
    try {
      await deleteBoard(id);
      analyticsService.getSummary().then(setSummary).catch(() => {});
      toast.success("Board deleted");
    } catch {
      toast.error("Failed to delete board");
    }
  };

  // Called when AI modal finishes adding tasks — navigate to that board
  const handleAITasksAdded = (boardId) => {
    setShowAI(false);
    if (boardId) {
      toast.success("Tasks added! Opening board...", { duration: 2000 });
      setTimeout(() => navigate(`/board/${boardId}`), 1500);
    }
    refreshData();
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
            {/* AI Generate — premium button */}
            <button
              onClick={() => setShowAI(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                         bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white
                         hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200
                         shadow-lg shadow-violet-500/25 active:scale-[0.97]"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 rounded-xl overflow-hidden">
                <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r
                                 from-transparent via-white/10 to-transparent
                                 animate-[shimmer_2s_infinite]" />
              </span>
              <Wand2 size={15} />
              AI Generate
            </button>

            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> New Board
            </Button>
          </div>
        </div>

        {/* Stats */}
        {summary && <StatsWidget summary={summary} />}

        {/* Boards */}
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Boards ({boards.length})
          </h2>
          {loading ? (
            <div className="flex justify-center py-16"><Loader /></div>
          ) : (
            <BoardGrid boards={boards} onDelete={handleDelete} />
          )}
        </section>

        {/* Upcoming deadlines */}
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

      {showAI && (
        <AIGenerateModal
          boards={boards}
          onClose={() => setShowAI(false)}
          onTasksAdded={handleAITasksAdded}
        />
      )}
    </div>
  );
}
