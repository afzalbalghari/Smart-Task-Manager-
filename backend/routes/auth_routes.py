from fastapi import APIRouter, Depends
from models.user import UserCreate, UserLogin
from controllers.auth_controller import register_user, login_user, get_profile
from middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/register", status_code=201)
async def register(payload: UserCreate):
    return await register_user(payload)


@router.post("/login")
async def login(payload: UserLogin):
    return await login_user(payload)


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return await get_profile(current_user)
