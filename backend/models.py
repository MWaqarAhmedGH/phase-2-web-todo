"""SQLModel models for Todo application."""

from datetime import datetime
from sqlmodel import SQLModel, Field


class Task(SQLModel, table=True):
    """Task model for storing user todos."""

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(max_length=200)
    description: str = Field(default="", max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
