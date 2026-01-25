# Phase II: Architecture Design

---

## 1. High-Level Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER (Browser)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 16+)                               │
│                           Deployed on Vercel                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │ Components  │  │  API Client │  │    Better Auth      │ │
│  │  (App Router│  │  (UI Layer) │  │  (lib/api)  │  │  (Auth Provider)    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTPS + JWT Token
                                     │ Authorization: Bearer <token>
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Python FastAPI)                             │
│                        Deployed on Cloud Platform                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Routes    │  │ Middleware  │  │   Models    │  │   Database Layer    │ │
│  │  (Endpoints)│  │ (JWT Auth)  │  │ (SQLModel)  │  │   (db.py)           │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ SQL Queries
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE (Neon Serverless PostgreSQL)                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐   │
│  │         users               │  │              tasks                   │   │
│  │  (Managed by Better Auth)   │  │  (Application Data)                  │   │
│  └─────────────────────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Components/Modules

### 2.1 Frontend (Next.js 16+ App Router)

```
frontend/
├── app/                          # App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home/landing page
│   ├── (auth)/                   # Auth route group
│   │   ├── signin/page.tsx       # Sign in page
│   │   └── signup/page.tsx       # Sign up page
│   └── dashboard/                # Protected routes
│       └── page.tsx              # Task dashboard
├── components/                   # Reusable UI components
│   ├── TaskList.tsx              # Display list of tasks
│   ├── TaskItem.tsx              # Single task display
│   ├── TaskForm.tsx              # Add/Edit task form
│   ├── AuthForm.tsx              # Login/Signup form
│   └── Navbar.tsx                # Navigation with logout
├── lib/                          # Utilities
│   ├── api.ts                    # API client with JWT
│   ├── auth.ts                   # Better Auth client config
│   └── auth-client.ts            # Auth client instance
├── CLAUDE.md                     # Claude Code instructions
└── package.json
```

#### Frontend Modules

| Module | Purpose | Satisfies Requirement |
|--------|---------|----------------------|
| `app/(auth)/*` | Authentication pages | User signup/signin |
| `app/dashboard/*` | Protected task management | View/manage tasks |
| `components/TaskList` | Render task list | View Task List |
| `components/TaskForm` | Create/edit tasks | Add Task, Update Task |
| `lib/api.ts` | HTTP client with JWT header | API communication |
| `lib/auth.ts` | Better Auth configuration | Authentication |

---

### 2.2 Backend (Python FastAPI)

```
backend/
├── main.py                       # FastAPI app entry point
├── models.py                     # SQLModel database models
├── db.py                         # Database connection
├── routes/                       # API route handlers
│   └── tasks.py                  # Task CRUD endpoints
├── middleware/                   # Custom middleware
│   └── auth.py                   # JWT verification middleware
├── schemas/                      # Pydantic schemas
│   └── task.py                   # Request/Response schemas
├── CLAUDE.md                     # Claude Code instructions
├── requirements.txt              # Python dependencies
└── pyproject.toml
```

#### Backend Modules

| Module | Purpose | Satisfies Requirement |
|--------|---------|----------------------|
| `main.py` | App initialization, CORS | Entry point |
| `models.py` | Task SQLModel definition | Data structure |
| `db.py` | Neon PostgreSQL connection | Data persistence |
| `routes/tasks.py` | All 6 API endpoints | Task CRUD operations |
| `middleware/auth.py` | JWT validation | Authentication, User isolation |
| `schemas/task.py` | Input validation | Data validation |

---

### 2.3 Database Schema

#### Users Table (Managed by Better Auth)

```sql
CREATE TABLE users (
    id          VARCHAR PRIMARY KEY,
    email       VARCHAR UNIQUE NOT NULL,
    name        VARCHAR,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

#### Tasks Table

```sql
CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    user_id     VARCHAR NOT NULL REFERENCES users(id),
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    completed   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

---

## 3. Data Flow

### 3.1 Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User    │     │   Frontend   │     │ Better Auth │     │ Database │
│ (Browser)│     │  (Next.js)   │     │  (Server)   │     │  (Neon)  │
└────┬─────┘     └──────┬───────┘     └──────┬──────┘     └────┬─────┘
     │                  │                    │                  │
     │ 1. Enter email   │                    │                  │
     │    & password    │                    │                  │
     │─────────────────>│                    │                  │
     │                  │                    │                  │
     │                  │ 2. POST /api/auth  │                  │
     │                  │    /sign-in        │                  │
     │                  │───────────────────>│                  │
     │                  │                    │                  │
     │                  │                    │ 3. Verify        │
     │                  │                    │    credentials   │
     │                  │                    │─────────────────>│
     │                  │                    │                  │
     │                  │                    │ 4. User data     │
     │                  │                    │<─────────────────│
     │                  │                    │                  │
     │                  │ 5. JWT Token       │                  │
     │                  │<───────────────────│                  │
     │                  │                    │                  │
     │ 6. Store token   │                    │                  │
     │    Redirect to   │                    │                  │
     │    dashboard     │                    │                  │
     │<─────────────────│                    │                  │
     │                  │                    │                  │
```

### 3.2 Task Creation Flow

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User    │     │   Frontend   │     │   Backend   │     │ Database │
│ (Browser)│     │  (Next.js)   │     │  (FastAPI)  │     │  (Neon)  │
└────┬─────┘     └──────┬───────┘     └──────┬──────┘     └────┬─────┘
     │                  │                    │                  │
     │ 1. Fill form     │                    │                  │
     │    Submit task   │                    │                  │
     │─────────────────>│                    │                  │
     │                  │                    │                  │
     │                  │ 2. POST /api/      │                  │
     │                  │    {user_id}/tasks │                  │
     │                  │    + JWT header    │                  │
     │                  │───────────────────>│                  │
     │                  │                    │                  │
     │                  │                    │ 3. Verify JWT    │
     │                  │                    │    Extract user  │
     │                  │                    │    Validate      │
     │                  │                    │    user_id match │
     │                  │                    │                  │
     │                  │                    │ 4. INSERT task   │
     │                  │                    │─────────────────>│
     │                  │                    │                  │
     │                  │                    │ 5. Return task   │
     │                  │                    │<─────────────────│
     │                  │                    │                  │
     │                  │ 6. Created task    │                  │
     │                  │    (201 Created)   │                  │
     │                  │<───────────────────│                  │
     │                  │                    │                  │
     │ 7. Update UI     │                    │                  │
     │    Show new task │                    │                  │
     │<─────────────────│                    │                  │
     │                  │                    │                  │
```

### 3.3 Task Retrieval Flow (with User Isolation)

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User A  │     │   Frontend   │     │   Backend   │     │ Database │
│ (Browser)│     │  (Next.js)   │     │  (FastAPI)  │     │  (Neon)  │
└────┬─────┘     └──────┬───────┘     └──────┬──────┘     └────┬─────┘
     │                  │                    │                  │
     │ 1. Load          │                    │                  │
     │    dashboard     │                    │                  │
     │─────────────────>│                    │                  │
     │                  │                    │                  │
     │                  │ 2. GET /api/       │                  │
     │                  │    {user_a_id}/    │                  │
     │                  │    tasks           │                  │
     │                  │    + JWT (User A)  │                  │
     │                  │───────────────────>│                  │
     │                  │                    │                  │
     │                  │                    │ 3. Verify JWT    │
     │                  │                    │    user_id =     │
     │                  │                    │    User A ✓      │
     │                  │                    │                  │
     │                  │                    │ 4. SELECT *      │
     │                  │                    │    FROM tasks    │
     │                  │                    │    WHERE user_id │
     │                  │                    │    = 'user_a_id' │
     │                  │                    │─────────────────>│
     │                  │                    │                  │
     │                  │                    │ 5. Only User A's │
     │                  │                    │    tasks         │
     │                  │                    │<─────────────────│
     │                  │                    │                  │
     │                  │ 6. User A's tasks  │                  │
     │                  │    only            │                  │
     │                  │<───────────────────│                  │
     │                  │                    │                  │
     │ 7. Display tasks │                    │                  │
     │<─────────────────│                    │                  │
     │                  │                    │                  │
```

---

## 4. Why This Design Satisfies the Spec

### 4.1 Technology Stack Compliance

| Requirement | Design Choice | Satisfied |
|-------------|---------------|-----------|
| Next.js 16+ (App Router) | `frontend/app/` directory structure | ✓ |
| Python FastAPI | `backend/main.py` with FastAPI | ✓ |
| SQLModel ORM | `backend/models.py` with SQLModel | ✓ |
| Neon Serverless PostgreSQL | `backend/db.py` connection | ✓ |
| Better Auth | `frontend/lib/auth.ts` | ✓ |

### 4.2 Functional Requirements

| Requirement | Design Component | How It's Satisfied |
|-------------|------------------|-------------------|
| Add Task | `POST /api/{user_id}/tasks` → `routes/tasks.py` | Endpoint creates task with user_id |
| Delete Task | `DELETE /api/{user_id}/tasks/{id}` → `routes/tasks.py` | Endpoint removes task after ownership check |
| Update Task | `PUT /api/{user_id}/tasks/{id}` → `routes/tasks.py` | Endpoint updates task after ownership check |
| View Task List | `GET /api/{user_id}/tasks` → `routes/tasks.py` | Endpoint returns tasks filtered by user_id |
| Mark Complete | `PATCH /api/{user_id}/tasks/{id}/complete` → `routes/tasks.py` | Endpoint toggles completed flag |
| User Signup | Better Auth + `app/(auth)/signup` | Better Auth handles registration |
| User Signin | Better Auth + `app/(auth)/signin` | Better Auth issues JWT on login |

### 4.3 Non-Functional Requirements

| Requirement | Design Component | How It's Satisfied |
|-------------|------------------|-------------------|
| User Isolation | `middleware/auth.py` validates JWT user matches URL user_id | Every request verified |
| Stateless Auth | JWT tokens self-contained | No server session needed |
| Responsive UI | Next.js + Tailwind CSS | Works on mobile/desktop |
| Data Persistence | Neon PostgreSQL | Survives restarts |
| RESTful API | FastAPI routes follow REST conventions | Standard HTTP methods |

### 4.4 Security Requirements

| Requirement | Design Component | How It's Satisfied |
|-------------|------------------|-------------------|
| JWT Validation | `middleware/auth.py` | Rejects invalid/expired tokens with 401 |
| Shared Secret | `BETTER_AUTH_SECRET` env var | Same secret in frontend and backend |
| User Isolation | SQL WHERE clause + middleware check | Double verification |
| Input Validation | Pydantic schemas in `schemas/task.py` | Validates title length, etc. |
| CORS | FastAPI CORS middleware in `main.py` | Only allows frontend origin |

### 4.5 Monorepo Structure Compliance

```
phase-2-web-todo/
├── frontend/               ✓ Next.js app
│   ├── CLAUDE.md           ✓ Claude Code instructions
│   └── ...
├── backend/                ✓ FastAPI app
│   ├── CLAUDE.md           ✓ Claude Code instructions
│   └── ...
├── spec/                   ✓ Specifications
│   ├── phase-2.spec.md
│   └── acceptance.md
├── design/                 ✓ Design documents
│   └── architecture.md
├── CLAUDE.md               ✓ Root Claude Code instructions
└── README.md               ✓ Setup instructions
```

---

## 5. Key Design Decisions

### 5.1 Separate Frontend and Backend

**Decision:** Two independent services communicating via REST API.

**Rationale:**
- Matches spec requirement (Next.js frontend + FastAPI backend)
- Frontend deployable to Vercel
- Backend deployable independently
- Clear separation of concerns
- Easier to scale independently

### 5.2 JWT-Based Authentication

**Decision:** Use JWT tokens issued by Better Auth, verified by FastAPI.

**Rationale:**
- Stateless authentication (no server sessions)
- Frontend and backend can verify independently
- Tokens carry user identity
- Standard approach for SPA + API architecture

### 5.3 User ID in URL Path

**Decision:** Include `{user_id}` in API paths (e.g., `/api/{user_id}/tasks`).

**Rationale:**
- Matches spec API endpoint format
- Explicit user context in every request
- Backend verifies URL user_id matches JWT user_id
- Prevents URL manipulation attacks

### 5.4 Middleware for Auth

**Decision:** Centralized JWT verification middleware.

**Rationale:**
- Single point of authentication logic
- Consistent 401/403 responses
- Easy to test and maintain
- Applied to all protected routes

### 5.5 SQLModel for ORM

**Decision:** Use SQLModel (not raw SQL or SQLAlchemy alone).

**Rationale:**
- Spec requirement
- Combines Pydantic + SQLAlchemy
- Type-safe models
- Easy serialization to/from JSON
