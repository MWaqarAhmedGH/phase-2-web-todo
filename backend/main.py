"""FastAPI backend entry point for Todo application."""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import create_db_and_tables
from routes.tasks import router as tasks_router

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    create_db_and_tables()
    yield


app = FastAPI(
    title="Todo API",
    description="Phase 2 Web Todo Application API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration - allow frontend to communicate with backend
# In production, FRONTEND_URL should be set to the Vercel deployment URL
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [frontend_url]

# Add localhost origins only in development
if "localhost" in frontend_url or "127.0.0.1" in frontend_url:
    allowed_origins.extend(["http://localhost:3000", "http://127.0.0.1:3000"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
