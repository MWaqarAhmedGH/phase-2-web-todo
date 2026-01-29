"""Vercel serverless entry point for FastAPI application."""

import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

# Load environment variables before importing app
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from db import create_db_and_tables
from routes.tasks import router as tasks_router

# Initialize database tables on cold start
create_db_and_tables()

app = FastAPI(
    title="Todo API",
    description="Phase 2 Web Todo Application API",
    version="1.0.0",
)

# CORS configuration for Vercel deployment
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    frontend_url,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add production Vercel domains
if "vercel.app" in frontend_url:
    # Also allow the base vercel domain pattern
    allowed_origins.append("https://*.vercel.app")

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


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Todo API is running", "docs": "/docs"}


# Vercel handler
handler = Mangum(app, lifespan="off")
