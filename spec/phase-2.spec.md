# Phase II: Todo Full-Stack Web Application

## Scope

Basic Level Functionality

**Objective:** Using Claude Code and Spec-Kit Plus transform the console app into a modern multi-user web application with persistent storage.

---

## Functional Requirements

### Core Features

Implement all 5 Basic Level features as a web application:

1. **Add Task** – Create new todo items
2. **Delete Task** – Remove tasks from the list
3. **Update Task** – Modify existing task details
4. **View Task List** – Display all tasks
5. **Mark as Complete** – Toggle task completion status

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

### Authentication

- Implement user signup/signin using Better Auth
- Better Auth Config: Enable JWT plugin to issue tokens
- Frontend API Client: Attach JWT token to every API request header
- FastAPI Backend: Add middleware to verify JWT and extract user
- API Routes: Filter all queries by the authenticated user's ID

### Authentication Flow

1. User logs in on Frontend → Better Auth creates a session and issues a JWT token
2. Frontend makes API call → Includes the JWT token in the `Authorization: Bearer <token>` header
3. Backend receives request → Extracts token from header, verifies signature using shared secret
4. Backend identifies user → Decodes token to get user ID, email, etc. and matches it with the user ID in the URL
5. Backend filters data → Returns only tasks belonging to that user

### API Behavior After Auth

- All endpoints require valid JWT token
- Requests without token receive 401 Unauthorized
- Each user only sees/modifies their own tasks
- Task ownership is enforced on every operation

---

## Non-Functional Requirements

### Security Benefits

| Benefit | Description |
|---------|-------------|
| User Isolation | Each user only sees their own tasks |
| Stateless Auth | Backend doesn't need to call frontend to verify users |
| Token Expiry | JWTs expire automatically (e.g., after 7 days) |
| No Shared DB Session | Frontend and backend can verify auth independently |

### Interface Requirements

- Build responsive frontend interface
- Create RESTful API endpoints

### Data Persistence

- Store data in Neon Serverless PostgreSQL database

---

## Constraints

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Spec-Driven | Claude Code + Spec-Kit Plus |
| Authentication | Better Auth |

### Development Constraints

- You cannot write the code manually. You must refine the Spec until Claude Code generates the correct output.
- Must use spec-driven development with Claude Code and Spec-Kit Plus

### Shared Secret Constraint

Both frontend (Better Auth) and backend (FastAPI) must use the same secret key for JWT signing and verification. This is typically set via environment variable `BETTER_AUTH_SECRET` in both services.

### Monorepo Structure

```
phase-2-web-todo/
├── frontend/
│   ├── CLAUDE.md
│   └── ... (Next.js app)
├── backend/
│   ├── CLAUDE.md
│   └── ... (FastAPI app)
├── specs/
├── CLAUDE.md
└── README.md
```

---

## Assumptions

1. Phase 1 (CLI Todo) is completed and can be referenced for business logic
2. Users table is managed by Better Auth
3. Default database name is `neondb` if not specified
4. Task model includes: id, user_id, title, description, completed, created_at, updated_at
5. Title is required (1-200 characters)
6. Description is optional (max 1000 characters)
7. Task is associated with logged-in user
8. Windows users must use WSL 2 (Windows Subsystem for Linux) for development
