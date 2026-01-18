from sqlalchemy import Column, Integer, String
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(String(1000), nullable=True)
    status = Column(String(50), default="todo") # todo, doing, done
    index = Column(Integer, default=0)
