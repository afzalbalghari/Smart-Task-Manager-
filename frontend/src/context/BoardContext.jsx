import { createContext, useContext, useState, useCallback } from "react";
import { boardService } from "../services/boardService";
import { taskService }  from "../services/taskService";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [boards, setBoards]   = useState([]);
  const [lists, setLists]     = useState([]);   // current board lists with tasks
  const [loading, setLoading] = useState(false);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try { setBoards(await boardService.getAll()); }
    finally { setLoading(false); }
  }, []);

  const fetchBoardLists = useCallback(async (boardId) => {
    setLoading(true);
    try { setLists(await boardService.getLists(boardId)); }
    finally { setLoading(false); }
  }, []);

  const moveTask = async (taskId, targetListId, position) => {
    await taskService.move(taskId, targetListId, position);
    // Optimistic update
    setLists(prev => {
      const next = prev.map(l => ({ ...l, tasks: [...l.tasks] }));
      let task;
      next.forEach(l => {
        const idx = l.tasks.findIndex(t => t.id === taskId);
        if (idx !== -1) { [task] = l.tasks.splice(idx, 1); }
      });
      const target = next.find(l => l.id === targetListId);
      if (target && task) {
        task.list_id = targetListId;
        target.tasks.splice(position, 0, task);
      }
      return next;
    });
  };

  return (
    <BoardContext.Provider value={{ boards, lists, loading, fetchBoards, fetchBoardLists, moveTask, setLists }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);
