from fastapi import HTTPException, status
from config.database import get_db
from models.user import UserCreate, UserLogin, UserInDB
from utils.password_utils import hash_password, verify_password
from utils.jwt_utils import create_access_token
from utils.serialize import serialize_doc


async def register_user(payload: UserCreate) -> dict:
    db = get_db()
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = UserInDB(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    ).model_dump()

    result = await db.users.insert_one(user_doc)
    token = create_access_token({"sub": str(result.inserted_id), "email": payload.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": payload.name,
            "email": payload.email,
            "role": payload.role,
        },
    }


async def login_user(payload: UserLogin) -> dict:
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "user"),
        },
    }


async def get_profile(current_user: dict) -> dict:
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user.get("role", "user"),
        "created_at": current_user.get("created_at").isoformat() if current_user.get("created_at") else None,
    }
