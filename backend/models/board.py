from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BoardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default="", max_length=500)
    color: str = Field(default="#6366f1")  # accent color for the board card


class BoardUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = None


class BoardResponse(BaseModel):
    id: str
    title: str
    description: str
    color: str
    owner_id: str
    created_at: datetime
    task_count: Optional[int] = 0       # populated by aggregation
    completed_count: Optional[int] = 0


class BoardInDB(BaseModel):
    title: str
    description: str = ""
    color: str = "#6366f1"
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_archived: bool = False
