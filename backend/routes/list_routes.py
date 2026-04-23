from fastapi import APIRouter, Depends
from models.task_list import ListCreate, ListUpdate
from controllers.list_controller import (
    create_list, get_board_lists, update_list, delete_list
)
from middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/", status_code=201)
async def create(payload: ListCreate, user=Depends(get_current_user)):
    return await create_list(payload, str(user["_id"]))


@router.get("/board/{board_id}")
async def get_lists(board_id: str, user=Depends(get_current_user)):
    return await get_board_lists(board_id, str(user["_id"]))


@router.put("/{list_id}")
async def update(list_id: str, payload: ListUpdate, user=Depends(get_current_user)):
    return await update_list(list_id, payload, str(user["_id"]))


@router.delete("/{list_id}")
async def delete(list_id: str, user=Depends(get_current_user)):
    return await delete_list(list_id, str(user["_id"]))
