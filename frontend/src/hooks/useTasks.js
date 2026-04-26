import { useState } from "react";
import { taskService } from "../services/taskService";
import toast from "react-hot-toast";

export function useTasks(lists, setLists) {
  const [loading, setLoading] = useState(false);

  const addTask = async (listId, payload) => {
    setLoading(true);
    try {
      const task = await taskService.create({ list_id: listId, ...payload });
      setLists(prev => prev.map(l =>
        l.id === listId ? { ...l, tasks: [...l.tasks, task] } : l
      ));
      toast.success("Task created");
      return task;
    } catch { toast.error("Failed to create task"); }
    finally { setLoading(false); }
  };

  const updateTask = async (taskId, listId, payload) => {
    const task = await taskService.update(taskId, payload);
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, tasks: l.tasks.map(t => t.id === taskId ? task : t) }
        : l
    ));
    return task;
  };

  const deleteTask = async (taskId, listId) => {
    await taskService.delete(taskId);
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l
    ));
    toast.success("Task deleted");
  };

  const toggleTask = async (taskId, listId) => {
    const task = await taskService.toggle(taskId);
    setLists(prev => prev.map(l =>
      l.id === listId
        ? { ...l, tasks: l.tasks.map(t => t.id === taskId ? task : t) }
        : l
    ));
  };

  return { loading, addTask, updateTask, deleteTask, toggleTask };
}
