from __future__ import annotations
from typing import List
from fastapi import HTTPException
from bson import ObjectId
from config.database import get_db
from models.board import BoardCreate, BoardUpdate, BoardInDB
from utils.serialize import serialize_doc


async def create_board(payload: BoardCreate, owner_id: str) -> dict:
    db = get_db()
    doc = BoardInDB(
        title=payload.title,
        description=payload.description or "",
        color=payload.color,
        owner_id=owner_id,
    ).model_dump()
    result = await db.boards.insert_one(doc)
    # Fetch back the inserted document so _id is correct
    created = await db.boards.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


async def get_user_boards(owner_id: str) -> List[dict]:
    db = get_db()
    boards = []
    async for board in db.boards.find({"owner_id": owner_id, "is_archived": False}):
        board = serialize_doc(board)
        lists = await db.task_lists.find({"board_id": board["id"]}).to_list(None)
        list_ids = [str(l["_id"]) for l in lists]
        board["task_count"] = await db.tasks.count_documents({"list_id": {"$in": list_ids}})
        board["completed_count"] = await db.tasks.count_documents(
            {"list_id": {"$in": list_ids}, "is_completed": True}
        )
        boards.append(board)
    return boards


async def get_board(board_id: str, owner_id: str) -> dict:
    db = get_db()
    board = await db.boards.find_one({"_id": ObjectId(board_id), "owner_id": owner_id})
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return serialize_doc(board)


async def update_board(board_id: str, payload: BoardUpdate, owner_id: str) -> dict:
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = await db.boards.find_one_and_update(
        {"_id": ObjectId(board_id), "owner_id": owner_id},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Board not found")
    return serialize_doc(result)


async def delete_board(board_id: str, owner_id: str) -> dict:
    db = get_db()
    result = await db.boards.delete_one({"_id": ObjectId(board_id), "owner_id": owner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Board not found")
    lists = await db.task_lists.find({"board_id": board_id}).to_list(None)
    list_ids = [str(l["_id"]) for l in lists]
    await db.tasks.delete_many({"list_id": {"$in": list_ids}})
    await db.task_lists.delete_many({"board_id": board_id})
    return {"message": "Board deleted successfully"}
