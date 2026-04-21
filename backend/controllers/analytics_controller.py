from datetime import datetime, timedelta
from config.database import get_db


async def get_summary(owner_id: str) -> dict:
    db = get_db()

    # Get all boards for user
    boards = await db.boards.find({"owner_id": owner_id}).to_list(None)
    board_ids = [str(b["_id"]) for b in boards]

    # Get all lists across boards
    lists = await db.task_lists.find({"board_id": {"$in": board_ids}}).to_list(None)
    list_ids = [str(l["_id"]) for l in lists]

    # Task stats
    total = await db.tasks.count_documents({"list_id": {"$in": list_ids}})
    completed = await db.tasks.count_documents({"list_id": {"$in": list_ids}, "is_completed": True})
    pending = total - completed

    now = datetime.utcnow()
    overdue = await db.tasks.count_documents({
        "list_id": {"$in": list_ids},
        "is_completed": False,
        "due_date": {"$lt": now},
    })
    due_soon = await db.tasks.count_documents({
        "list_id": {"$in": list_ids},
        "is_completed": False,
        "due_date": {"$gte": now, "$lte": now + timedelta(days=3)},
    })

    # Weekly productivity: tasks completed per day for last 7 days
    weekly_data = []
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day.replace(hour=23, minute=59, second=59)
        count = await db.tasks.count_documents({
            "list_id": {"$in": list_ids},
            "is_completed": True,
            "due_date": {"$gte": day_start, "$lte": day_end},
        })
        weekly_data.append({
            "date": day_start.strftime("%a"),
            "completed": count,
        })

    # Priority breakdown
    high = await db.tasks.count_documents({"list_id": {"$in": list_ids}, "priority": "high", "is_completed": False})
    medium = await db.tasks.count_documents({"list_id": {"$in": list_ids}, "priority": "medium", "is_completed": False})
    low = await db.tasks.count_documents({"list_id": {"$in": list_ids}, "priority": "low", "is_completed": False})

    return {
        "total_boards": len(boards),
        "total_tasks": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue,
        "due_soon": due_soon,
        "completion_rate": round((completed / total * 100) if total else 0, 1),
        "weekly_productivity": weekly_data,
        "priority_breakdown": {"high": high, "medium": medium, "low": low},
    }


async def get_notifications(owner_id: str) -> list:
    """Return tasks due within 3 days or overdue."""
    db = get_db()
    boards = await db.boards.find({"owner_id": owner_id}).to_list(None)
    board_ids = [str(b["_id"]) for b in boards]
    lists = await db.task_lists.find({"board_id": {"$in": board_ids}}).to_list(None)
    list_ids = [str(l["_id"]) for l in lists]

    now = datetime.utcnow()
    cutoff = now + timedelta(days=3)

    notifications = []
    async for task in db.tasks.find({
        "list_id": {"$in": list_ids},
        "is_completed": False,
        "due_date": {"$lte": cutoff},
    }).sort("due_date", 1).limit(20):
        is_overdue = task["due_date"] < now
        notifications.append({
            "task_id": str(task["_id"]),
            "title": task["title"],
            "due_date": task["due_date"],
            "priority": task.get("priority", "medium"),
            "is_overdue": is_overdue,
            "type": "overdue" if is_overdue else "due_soon",
        })
    return notifications