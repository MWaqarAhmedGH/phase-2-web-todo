"""Database connection for Neon PostgreSQL using SQLModel."""

import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

from models import Task  # noqa: F401 - Required for table creation

# Load environment variables
load_dotenv()

# Engine will be created lazily
_engine = None


def get_engine():
    """Get or create database engine (lazy initialization)."""
    global _engine
    if _engine is None:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL environment variable is not set")
        _engine = create_engine(database_url, echo=False)
    return _engine


def create_db_and_tables():
    """Create all tables defined in SQLModel models."""
    SQLModel.metadata.create_all(get_engine())


def get_session():
    """Dependency for getting database session."""
    with Session(get_engine()) as session:
        yield session
