from __future__ import annotations
from typing import List
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime
from config.database import get_db
from models.task import TaskCreate, TaskUpdate, TaskMove, TaskInDB
from utils.serialize import serialize_doc


def _add_overdue(task: dict) -> dict:
    now = datetime.utcnow()
    due = task.get("due_date")
    if due:
        # due_date may already be ISO string after serialize_doc
        if isinstance(due, str):
            try:
                due_dt = datetime.fromisoformat(due.replace("Z", "+00:00").rstrip("+00:00"))
            except Exception:
                due_dt = None
        else:
            due_dt = due
        task["is_overdue"] = (due_dt < now) if due_dt and not task.get("is_completed") else False
    else:
        task["is_overdue"] = False
    return task


async def create_task(payload: TaskCreate) -> dict:
    db = get_db()
    lst = await db.task_lists.find_one({"_id": ObjectId(payload.list_id)})
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")

    doc = TaskInDB(**payload.model_dump()).model_dump()
    result = await db.tasks.insert_one(doc)
    created = await db.tasks.find_one({"_id": result.inserted_id})
    return _add_overdue(serialize_doc(created))


async def get_list_tasks(list_id: str) -> List[dict]:
    db = get_db()
    tasks = []
    async for task in db.tasks.find({"list_id": list_id}).sort("position", 1):
        tasks.append(_add_overdue(serialize_doc(task)))
    return tasks


async def update_task(task_id: str, payload: TaskUpdate) -> dict:
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = await db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return _add_overdue(serialize_doc(result))


async def move_task(task_id: str, payload: TaskMove) -> dict:
    db = get_db()
    result = await db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": {"list_id": payload.target_list_id, "position": payload.position}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return _add_overdue(serialize_doc(result))


async def delete_task(task_id: str) -> dict:
    db = get_db()
    result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted"}


async def toggle_complete(task_id: str) -> dict:
    db = get_db()
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    new_status = not task.get("is_completed", False)
    result = await db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": {"is_completed": new_status}},
        return_document=True,
    )
    return _add_overdue(serialize_doc(result))
