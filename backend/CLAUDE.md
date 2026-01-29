# CLAUDE.md – Backend

## Scope

This directory contains the **Python FastAPI backend** for the Phase 2 Web Todo application.

**Responsibilities:**
- REST API endpoints for task CRUD operations
- JWT token verification (tokens issued by frontend Better Auth)
- Database connection to Neon PostgreSQL
- User isolation (filter tasks by authenticated user)
- Input validation and error responses

**NOT Responsible For:**
- User registration/login (Better Auth on frontend handles this)
- Issuing JWT tokens (frontend Better Auth does this)
- UI rendering (frontend handles this)

---

## Allowed Technologies

| Technology | Purpose |
|------------|---------|
| Python 3.11+ | Language |
| FastAPI | Web framework |
| SQLModel | ORM (SQLAlchemy + Pydantic) |
| Uvicorn | ASGI server |
| PyJWT | JWT decoding |
| psycopg2 / asyncpg | PostgreSQL driver |

**DO NOT** install packages not listed above without permission.

---

## Directory Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── db.py                   # Database connection
├── models.py               # SQLModel models (Task)
│
├── routes/                 # API route handlers
│   └── tasks.py            # Task CRUD endpoints
│
├── middleware/             # Custom middleware
│   └── auth.py             # JWT verification
│
├── schemas/                # Pydantic schemas (optional)
│   └── task.py             # Request/Response schemas
│
├── requirements.txt        # Dependencies
├── .env                    # Environment variables
└── CLAUDE.md               # This file
```

---

## Source of Truth

| File | What to Check |
|------|---------------|
| `../spec/phase-2.spec.md` | API endpoints, auth flow |
| `../spec/acceptance.md` | Error responses, edge cases |
| `../design/architecture.md` | Module structure, data flow |
| `../STATUS.md` | Current task |

---

## Prohibited Actions

**DO NOT:**
1. Create frontend files (anything in `../frontend/`)
2. Modify `../spec/` or `../design/` files
3. Add endpoints not in spec
4. Skip JWT verification on task routes
5. Allow cross-user data access
6. Write raw SQL (use SQLModel ORM)
7. Hardcode secrets (use environment variables)
8. Return 200 for errors (use proper HTTP status codes)

---

## API Contract

### Endpoints (from spec)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/{user_id}/tasks` | List all tasks | Required |
| POST | `/api/{user_id}/tasks` | Create task | Required |
| GET | `/api/{user_id}/tasks/{id}` | Get task | Required |
| PUT | `/api/{user_id}/tasks/{id}` | Update task | Required |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | Required |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle complete | Required |
| GET | `/health` | Health check | None |

### Authentication Rules

1. Extract JWT from `Authorization: Bearer <token>` header
2. Verify token signature using `BETTER_AUTH_SECRET`
3. Decode token to get `user_id`
4. **Validate:** URL `{user_id}` must match token `user_id`
5. Return `401` if token missing/invalid/expired
6. Return `403` if URL user_id doesn't match token user_id

### Response Codes

| Code | When to Use |
|------|-------------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | Deleted (DELETE) |
| 400 | Invalid input (validation error) |
| 401 | Missing/invalid/expired token |
| 403 | User ID mismatch (forbidden) |
| 404 | Task not found |
| 500 | Server error |

---

## Database Rules

### Connection
- Use Neon PostgreSQL via `DATABASE_URL` environment variable
- Use SQLModel for all database operations
- Never write raw SQL queries

### Task Model (from spec)

```python
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Validation Rules (from acceptance.md)

| Field | Rule |
|-------|------|
| title | Required, 1-200 characters |
| description | Optional, max 1000 characters |
| completed | Boolean, defaults to False |

---

## Task Workflow

### Before Creating a File
1. Check if it exists in `../design/architecture.md`
2. Verify it's needed for current task in `../STATUS.md`
3. Follow naming conventions (snake_case.py)

### After Creating/Modifying Code
1. Verify server starts without errors
2. Test endpoint with curl or similar tool
3. Ensure proper error handling
4. Update `../STATUS.md` if task complete

---

## Environment Variables

**File:** `.env`

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=<same-as-frontend>
FRONTEND_URL=http://localhost:3000
```

**Rules:**
- Never commit `.env` to git
- Keep `BETTER_AUTH_SECRET` identical to frontend
- Use `python-dotenv` to load variables

---

## CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Quick Commands

```bash
# Activate virtual environment (Windows)
./venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Server runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```
