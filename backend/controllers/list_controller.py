from __future__ import annotations
from typing import List
from fastapi import HTTPException
from bson import ObjectId
from config.database import get_db
from models.task_list import ListCreate, ListUpdate, ListInDB
from utils.serialize import serialize_doc


async def create_list(payload: ListCreate, owner_id: str) -> dict:
    db = get_db()
    board = await db.boards.find_one({"_id": ObjectId(payload.board_id), "owner_id": owner_id})
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    doc = ListInDB(
        board_id=payload.board_id,
        title=payload.title,
        position=payload.position,
    ).model_dump()
    result = await db.task_lists.insert_one(doc)
    created = await db.task_lists.find_one({"_id": result.inserted_id})
    serialized = serialize_doc(created)
    serialized["tasks"] = []
    return serialized


async def get_board_lists(board_id: str, owner_id: str) -> List[dict]:
    db = get_db()
    board = await db.boards.find_one({"_id": ObjectId(board_id), "owner_id": owner_id})
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    lists = []
    async for lst in db.task_lists.find({"board_id": board_id}).sort("position", 1):
        lst = serialize_doc(lst)
        tasks = []
        async for task in db.tasks.find({"list_id": lst["id"]}).sort("position", 1):
            tasks.append(serialize_doc(task))
        lst["tasks"] = tasks
        lists.append(lst)
    return lists


async def update_list(list_id: str, payload: ListUpdate, owner_id: str) -> dict:
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    result = await db.task_lists.find_one_and_update(
        {"_id": ObjectId(list_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="List not found")
    return serialize_doc(result)


async def delete_list(list_id: str, owner_id: str) -> dict:
    db = get_db()
    result = await db.task_lists.delete_one({"_id": ObjectId(list_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="List not found")
    await db.tasks.delete_many({"list_id": list_id})
    return {"message": "List deleted"}
