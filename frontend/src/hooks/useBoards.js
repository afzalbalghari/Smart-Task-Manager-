import { useState, useCallback } from "react";
import { boardService } from "../services/boardService";
import toast from "react-hot-toast";

export function useBoards() {
  const [boards, setBoards]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try   { setBoards(await boardService.getAll()); }
    catch { toast.error("Failed to load boards"); }
    finally { setLoading(false); }
  }, []);

  const createBoard = async (payload) => {
    const board = await boardService.create(payload);
    setBoards(prev => [board, ...prev]);
    return board;
  };

  const deleteBoard = async (id) => {
    await boardService.delete(id);
    setBoards(prev => prev.filter(b => b.id !== id));
  };

  return { boards, loading, fetchBoards, createBoard, deleteBoard };
}
