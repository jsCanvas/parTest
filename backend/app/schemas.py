from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    index: int = 0

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    index: Optional[int] = None

class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True
