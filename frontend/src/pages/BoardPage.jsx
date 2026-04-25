import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import DragDropBoard from "../components/Task/DragDropBoard";
import Button from "../components/UI/Button";
import Loader from "../components/UI/Loader";
import Modal from "../components/UI/Modal";
import { boardService } from "../services/boardService";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board,   setBoard]   = useState(null);
  const [lists,   setLists]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newList, setNewList] = useState("");
  const [adding,  setAdding]  = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, l] = await Promise.all([
          boardService.getOne(id),
          boardService.getLists(id),
        ]);
        setBoard(b);
        setLists(l);
      } catch {
        toast.error("Board not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newList.trim()) return;
    setAdding(true);
    try {
      const list = await boardService.createList({
        board_id: id,
        title: newList.trim(),
        position: lists.length,
      });
      setLists(prev => [...prev, { ...list, tasks: [] }]);
      setNewList("");
      setShowAdd(false);
      toast.success("List added");
    } catch {
      toast.error("Failed to add list");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm("Delete this list and all its tasks?")) return;
    await boardService.deleteList(listId);
    setLists(prev => prev.filter(l => l.id !== listId));
    toast.success("List deleted");
  };

  if (loading) return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="flex justify-center pt-32"><Loader /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Board header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="max-w-full px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: board?.color }}
            />
            <h1 className="text-xl font-bold text-slate-100">{board?.title}</h1>
            {board?.description && (
              <span className="text-sm text-slate-500 hidden md:block">
                — {board.description}
              </span>
            )}
          </div>
          <div className="ml-auto">
            <Button onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add List
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto p-6">
        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-20">
            <p className="text-lg font-medium">No lists yet</p>
            <p className="text-sm mt-1">Add a list to start organizing tasks</p>
            <Button className="mt-4" onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add First List
            </Button>
          </div>
        ) : (
          <DragDropBoard
            lists={lists}
            setLists={setLists}
            onDeleteList={handleDeleteList}
          />
        )}
      </div>

      {/* Add List Modal */}
      {showAdd && (
        <Modal title="Add New List" onClose={() => setShowAdd(false)} size="sm">
          <form onSubmit={handleAddList} className="space-y-4">
            <input
              className="input"
              placeholder="e.g. To Do, In Progress, Done"
              value={newList}
              autoFocus
              onChange={e => setNewList(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={adding}>
                Add List
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
