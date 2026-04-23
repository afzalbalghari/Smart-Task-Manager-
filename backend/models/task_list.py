from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ListCreate(BaseModel):
    board_id: str
    title: str = Field(..., min_length=1, max_length=100)
    position: int = Field(default=0)


class ListUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    position: Optional[int] = None


class ListResponse(BaseModel):
    id: str
    board_id: str
    title: str
    position: int
    created_at: datetime


class ListInDB(BaseModel):
    board_id: str
    title: str
    position: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
