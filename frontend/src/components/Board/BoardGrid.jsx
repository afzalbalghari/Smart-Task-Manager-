import BoardCard from "./BoardCard";
import { LayoutGrid } from "lucide-react";

export default function BoardGrid({ boards, onDelete }) {
  if (boards.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
      <LayoutGrid size={48} className="mb-4 opacity-30" />
      <p className="text-lg font-medium">No boards yet</p>
      <p className="text-sm mt-1">Create your first board to get started</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boards.map(b => <BoardCard key={b.id} board={b} onDelete={onDelete} />)}
    </div>
  );
}
