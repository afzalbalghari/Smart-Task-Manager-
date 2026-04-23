from fastapi import APIRouter, Depends
from models.board import BoardCreate, BoardUpdate
from controllers.board_controller import (
    create_board, get_user_boards, get_board, update_board, delete_board
)
from middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/", status_code=201)
async def create(payload: BoardCreate, user=Depends(get_current_user)):
    return await create_board(payload, str(user["_id"]))


@router.get("/")
async def list_boards(user=Depends(get_current_user)):
    return await get_user_boards(str(user["_id"]))


@router.get("/{board_id}")
async def get_one(board_id: str, user=Depends(get_current_user)):
    return await get_board(board_id, str(user["_id"]))


@router.put("/{board_id}")
async def update(board_id: str, payload: BoardUpdate, user=Depends(get_current_user)):
    return await update_board(board_id, payload, str(user["_id"]))


@router.delete("/{board_id}")
async def delete(board_id: str, user=Depends(get_current_user)):
    return await delete_board(board_id, str(user["_id"]))
