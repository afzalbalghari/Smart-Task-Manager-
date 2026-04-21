from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.boards.create_index("owner_id")
    await db.task_lists.create_index("board_id")
    await db.tasks.create_index("list_id")
    await db.tasks.create_index("due_date")


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db