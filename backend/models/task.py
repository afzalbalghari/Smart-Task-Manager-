from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskCreate(BaseModel):
    list_id: str
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default="", max_length=2000)
    due_date: Optional[datetime] = None
    priority: Priority = Priority.medium
    tags: List[str] = Field(default_factory=list)
    position: int = Field(default=0)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[Priority] = None
    tags: Optional[List[str]] = None
    is_completed: Optional[bool] = None
    position: Optional[int] = None


class TaskMove(BaseModel):
    """Payload for drag-and-drop moves."""
    target_list_id: str
    position: int


class TaskResponse(BaseModel):
    id: str
    list_id: str
    title: str
    description: str
    due_date: Optional[datetime]
    priority: str
    tags: List[str]
    is_completed: bool
    position: int
    created_at: datetime
    is_overdue: Optional[bool] = False


class TaskInDB(BaseModel):
    list_id: str
    title: str
    description: str = ""
    due_date: Optional[datetime] = None
    priority: str = "medium"
    tags: List[str] = Field(default_factory=list)
    is_completed: bool = False
    position: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)