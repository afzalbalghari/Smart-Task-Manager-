from fastapi import APIRouter, Depends
from controllers.ai_controller import suggest_breakdown, auto_generate_tasks, SuggestPayload, GeneratePayload
from middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/suggest")
async def suggest(payload: SuggestPayload, user=Depends(get_current_user)):
    """Break a task into subtasks."""
    return await suggest_breakdown(payload)


@router.post("/generate")
async def generate(payload: GeneratePayload, user=Depends(get_current_user)):
    """Auto-generate a full task list from a project title."""
    return await auto_generate_tasks(payload)