from fastapi import HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI
from config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


class SuggestPayload(BaseModel):
    title: str
    context: str = ""


class GeneratePayload(BaseModel):
    title: str
    priority: str = "medium"


async def suggest_breakdown(payload: SuggestPayload) -> dict:
    """Break a task title into subtasks using AI."""
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="AI feature not configured")

    prompt = f"""You are a productivity assistant for students and developers.
Break down the following task into 4-6 clear, actionable subtasks.

Task: {payload.title}
Context: {payload.context or 'No extra context'}

Respond ONLY with a JSON object:
{{
  "subtasks": ["subtask 1", "subtask 2", ...],
  "estimated_hours": <number>,
  "tips": "<one short productivity tip>"
}}"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=500,
    )
    import json
    return json.loads(response.choices[0].message.content)


async def auto_generate_tasks(payload: GeneratePayload) -> dict:
    """Auto-generate a full task list from a project title."""
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="AI feature not configured")

    prompt = f"""You are a project planning assistant.
Generate a complete task list for this project/goal.

Project: {payload.title}
Priority: {payload.priority}

Respond ONLY with a JSON object:
{{
  "tasks": [
    {{
      "title": "task title",
      "description": "brief description",
      "priority": "low|medium|high",
      "estimated_hours": <number>
    }}
  ],
  "total_estimated_hours": <number>
}}
Generate 6-10 tasks."""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=800,
    )
    import json
    return json.loads(response.choices[0].message.content)