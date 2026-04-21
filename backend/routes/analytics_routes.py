from fastapi import APIRouter, Depends
from controllers.analytics_controller import get_summary, get_notifications
from middleware.auth_middleware import get_current_user

router = APIRouter()


@router.get("/summary")
async def summary(user=Depends(get_current_user)):
    return await get_summary(str(user["_id"]))


@router.get("/notifications")
async def notifications(user=Depends(get_current_user)):
    return await get_notifications(str(user["_id"]))