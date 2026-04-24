import { useState } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import { taskService } from "../../services/taskService";
import toast from "react-hot-toast";

export default function DragDropBoard({ lists, setLists, onDeleteList }) {
  const [activeTask,    setActiveTask]    = useState(null);
  const [addingToList,  setAddingToList]  = useState(null);
  const [selectedTask,  setSelectedTask]  = useState(null);
  const [selectedListId,setSelectedListId]= useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  /* ── helpers ── */
  const findListOfTask = (taskId) =>
    lists.find(l => l.tasks?.some(t => t.id === taskId));

  /* ── drag handlers ── */
  const onDragStart = ({ active }) => {
    const list = findListOfTask(active.id);
    setActiveTask(list?.tasks?.find(t => t.id === active.id) || null);
  };

  const onDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const srcList  = findListOfTask(active.id);
    if (!srcList) return;

    const dstListId = lists.find(l => l.id === over.id)
      ? over.id
      : findListOfTask(over.id)?.id;

    if (!dstListId) return;

    // Same list reorder
    if (srcList.id === dstListId) {
      const oldIdx = srcList.tasks.findIndex(t => t.id === active.id);
      const newIdx = srcList.tasks.findIndex(t => t.id === over.id);
      if (oldIdx === newIdx) return;
      const reordered = arrayMove(srcList.tasks, oldIdx, newIdx);
      setLists(prev => prev.map(l => l.id === srcList.id ? { ...l, tasks: reordered } : l));
      try { await taskService.move(active.id, dstListId, newIdx); }
      catch { toast.error("Failed to move task"); }
    } else {
      // Cross-list move
      const task = srcList.tasks.find(t => t.id === active.id);
      const dstTasks = lists.find(l => l.id === dstListId)?.tasks || [];
      const position = over.id === dstListId ? dstTasks.length : dstTasks.findIndex(t => t.id === over.id);
      setLists(prev => prev.map(l => {
        if (l.id === srcList.id) return { ...l, tasks: l.tasks.filter(t => t.id !== active.id) };
        if (l.id === dstListId) {
          const newTasks = [...l.tasks];
          newTasks.splice(position < 0 ? newTasks.length : position, 0, { ...task, list_id: dstListId });
          return { ...l, tasks: newTasks };
        }
        return l;
      }));
      try { await taskService.move(active.id, dstListId, position < 0 ? dstTasks.length : position); }
      catch { toast.error("Failed to move task"); }
    }
  };

  /* ── task CRUD ── */
  const addTask = async (listId, payload) => {
    const { taskService: ts } = await import("../../services/taskService");
    const task = await ts.create({ list_id: listId, ...payload });
    setLists(prev => prev.map(l => l.id === listId ? { ...l, tasks: [...l.tasks, task] } : l));
    toast.success("Task created ✓");
  };

  const toggleTask = async (taskId, listId) => {
    const task = await taskService.toggle(taskId);
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, tasks: l.tasks.map(t => t.id === taskId ? task : t) } : l
    ));
  };

  const deleteTask = async (taskId, listId) => {
    await taskService.delete(taskId);
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l
    ));
    toast.success("Task deleted");
  };

  const updateTask = async (taskId, listId, payload) => {
    const updated = await taskService.update(taskId, payload);
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, tasks: l.tasks.map(t => t.id === taskId ? updated : t) } : l
    ));
    return updated;
  };

  const openTask = (task) => {
    setSelectedTask(task);
    setSelectedListId(findListOfTask(task.id)?.id);
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners}
        onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists.map(list => (
            <TaskColumn
              key={list.id}
              list={list}
              onAddTask={(id) => setAddingToList(lists.find(l => l.id === id))}
              onTaskClick={openTask}
              onToggle={toggleTask}
              onDeleteTask={deleteTask}
              onDeleteList={onDeleteList}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 scale-105">
              <TaskCard task={activeTask} onClick={() => {}} onToggle={() => {}} onDelete={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {addingToList && (
        <CreateTaskModal
          listId={addingToList.id}
          listTitle={addingToList.title}
          onClose={() => setAddingToList(null)}
          onCreate={addTask}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          listId={selectedListId}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onToggle={toggleTask}
        />
      )}
    </>
  );
}
