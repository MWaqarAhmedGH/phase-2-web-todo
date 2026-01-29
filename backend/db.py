"""Database connection for Neon PostgreSQL using SQLModel."""

import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

from models import Task  # noqa: F401 - Required for table creation

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create SQLModel engine
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create all tables defined in SQLModel models."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency for getting database session."""
    with Session(engine) as session:
        yield session
