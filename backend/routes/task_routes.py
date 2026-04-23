from fastapi import APIRouter, Depends
from models.task import TaskCreate, TaskUpdate, TaskMove
from controllers.task_controller import (
    create_task, get_list_tasks, update_task,
    move_task, delete_task, toggle_complete
)
from middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/", status_code=201)
async def create(payload: TaskCreate, user=Depends(get_current_user)):
    return await create_task(payload)


@router.get("/list/{list_id}")
async def get_tasks(list_id: str, user=Depends(get_current_user)):
    return await get_list_tasks(list_id)


@router.put("/{task_id}")
async def update(task_id: str, payload: TaskUpdate, user=Depends(get_current_user)):
    return await update_task(task_id, payload)


@router.put("/{task_id}/move")
async def move(task_id: str, payload: TaskMove, user=Depends(get_current_user)):
    return await move_task(task_id, payload)


@router.put("/{task_id}/toggle")
async def toggle(task_id: str, user=Depends(get_current_user)):
    return await toggle_complete(task_id)


@router.delete("/{task_id}")
async def delete(task_id: str, user=Depends(get_current_user)):
    return await delete_task(task_id)
