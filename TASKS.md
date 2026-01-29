# Phase 2: Task Breakdown

---

## Task Checklist

### Stage 1: Project Setup

- [ ] **1.1** Create monorepo folder structure
- [ ] **1.2** Initialize Next.js 16+ frontend with App Router
- [ ] **1.3** Initialize Python FastAPI backend with UV
- [ ] **1.4** Create root `CLAUDE.md` file
- [ ] **1.5** Create `frontend/CLAUDE.md` file
- [ ] **1.6** Create `backend/CLAUDE.md` file
- [ ] **1.7** Create root `README.md` with setup instructions

---

### Stage 2: Database Setup

- [ ] **2.1** Create Neon PostgreSQL project/database
- [ ] **2.2** Create `backend/db.py` - database connection
- [ ] **2.3** Create `backend/models.py` - Task model with SQLModel
- [ ] **2.4** Create database migration/table creation script
- [ ] **2.5** Test database connection

---

### Stage 3: Backend API (No Auth Yet)

- [ ] **3.1** Create `backend/main.py` - FastAPI app entry point
- [ ] **3.2** Create `backend/schemas/task.py` - Pydantic request/response schemas
- [ ] **3.3** Create `backend/routes/tasks.py` - Task CRUD routes
- [ ] **3.4** Implement `POST /api/{user_id}/tasks` - Create task
- [ ] **3.5** Implement `GET /api/{user_id}/tasks` - List tasks
- [ ] **3.6** Implement `GET /api/{user_id}/tasks/{id}` - Get single task
- [ ] **3.7** Implement `PUT /api/{user_id}/tasks/{id}` - Update task
- [ ] **3.8** Implement `DELETE /api/{user_id}/tasks/{id}` - Delete task
- [ ] **3.9** Implement `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle complete
- [ ] **3.10** Add input validation (title required, max lengths)
- [ ] **3.11** Test all endpoints with sample user_id

---

### Stage 4: Frontend Basic UI (No Auth Yet)

- [ ] **4.1** Set up Tailwind CSS (or preferred styling)
- [ ] **4.2** Create `frontend/lib/api.ts` - API client
- [ ] **4.3** Create `frontend/app/layout.tsx` - Root layout
- [ ] **4.4** Create `frontend/app/page.tsx` - Landing page
- [ ] **4.5** Create `frontend/components/TaskList.tsx` - Display tasks
- [ ] **4.6** Create `frontend/components/TaskItem.tsx` - Single task
- [ ] **4.7** Create `frontend/components/TaskForm.tsx` - Add/Edit form
- [ ] **4.8** Create temporary dashboard page to test CRUD
- [ ] **4.9** Test Add, View, Update, Delete, Complete features

---

### Stage 5: Authentication - Backend

- [ ] **5.1** Create `backend/middleware/auth.py` - JWT verification
- [ ] **5.2** Add JWT decoding logic using shared secret
- [ ] **5.3** Create dependency to extract user from token
- [ ] **5.4** Add user_id validation (URL must match token)
- [ ] **5.5** Protect all task routes with auth middleware
- [ ] **5.6** Return 401 for missing/invalid token
- [ ] **5.7** Return 403 for user_id mismatch

---

### Stage 6: Authentication - Frontend

- [ ] **6.1** Install and configure Better Auth
- [ ] **6.2** Create `frontend/lib/auth.ts` - Better Auth config with JWT
- [ ] **6.3** Create `frontend/lib/auth-client.ts` - Auth client instance
- [ ] **6.4** Create `frontend/app/(auth)/signup/page.tsx` - Signup page
- [ ] **6.5** Create `frontend/app/(auth)/signin/page.tsx` - Signin page
- [ ] **6.6** Create `frontend/components/AuthForm.tsx` - Auth form component
- [ ] **6.7** Update `lib/api.ts` to include JWT in headers
- [ ] **6.8** Create auth provider/context for app
- [ ] **6.9** Add logout functionality

---

### Stage 7: Protected Dashboard

- [ ] **7.1** Create `frontend/app/dashboard/page.tsx` - Protected dashboard
- [ ] **7.2** Add auth check - redirect to signin if not logged in
- [ ] **7.3** Fetch and display user's tasks only
- [ ] **7.4** Create `frontend/components/Navbar.tsx` - Nav with logout
- [ ] **7.5** Test complete auth flow (signup → signin → dashboard)

---

### Stage 8: CORS & Integration

- [ ] **8.1** Configure CORS in FastAPI `main.py`
- [ ] **8.2** Set environment variables (both services)
- [ ] **8.3** Test frontend ↔ backend communication
- [ ] **8.4** Verify user isolation (User A cannot see User B's tasks)

---

### Stage 9: Error Handling & Validation

- [ ] **9.1** Add proper error responses (400, 401, 403, 404, 500)
- [ ] **9.2** Add frontend error handling and display
- [ ] **9.3** Add loading states in UI
- [ ] **9.4** Test edge cases from acceptance criteria

---

### Stage 10: Deployment

- [ ] **10.1** Deploy frontend to Vercel
- [ ] **10.2** Deploy backend to Vercel (Serverless Functions)
- [ ] **10.3** Update environment variables for production
- [ ] **10.4** Test deployed application end-to-end
- [ ] **10.5** Update README with deployment URLs

---

### Stage 11: Final Checks

- [ ] **11.1** Verify all 5 basic features work
- [ ] **11.2** Verify authentication works
- [ ] **11.3** Verify user isolation works
- [ ] **11.4** Verify data persists after restart
- [ ] **11.5** Check responsive design (mobile)
- [ ] **11.6** Record demo video (under 90 seconds)
- [ ] **11.7** Submit via Google Form

---

## Suggested Folder Structure

```
phase-2-web-todo/
│
├── CLAUDE.md                         # Root Claude Code instructions
├── README.md                         # Project setup & run instructions
├── TASKS.md                          # This file
│
├── spec/                             # Specifications (already created)
│   ├── phase-2.spec.md
│   └── acceptance.md
│
├── design/                           # Design documents (already created)
│   └── architecture.md
│
├── frontend/                         # Next.js 16+ Application
│   ├── CLAUDE.md                     # Frontend-specific instructions
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .env.local                    # Environment variables
│   │
│   ├── app/                          # App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home/landing page
│   │   │
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   └── dashboard/                # Protected route
│   │       └── page.tsx
│   │
│   ├── components/                   # React components
│   │   ├── Navbar.tsx
│   │   ├── AuthForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskForm.tsx
│   │
│   └── lib/                          # Utilities
│       ├── api.ts                    # API client with JWT
│       ├── auth.ts                   # Better Auth config
│       └── auth-client.ts            # Auth client instance
│
├── backend/                          # Python FastAPI Application
│   ├── CLAUDE.md                     # Backend-specific instructions
│   ├── pyproject.toml                # UV project config
│   ├── requirements.txt              # Dependencies
│   ├── .env                          # Environment variables
│   │
│   ├── main.py                       # FastAPI app entry point
│   ├── db.py                         # Database connection
│   ├── models.py                     # SQLModel models
│   │
│   ├── routes/                       # API routes
│   │   └── tasks.py                  # Task CRUD endpoints
│   │
│   ├── middleware/                   # Custom middleware
│   │   └── auth.py                   # JWT verification
│   │
│   └── schemas/                      # Pydantic schemas
│       └── task.py                   # Request/Response schemas
│
└── .gitignore                        # Git ignore file
```

---

## Technologies (From Spec Only)

### Frontend

| Technology | Purpose | Source |
|------------|---------|--------|
| Next.js 16+ | Frontend framework | Spec: "Next.js 16+ (App Router)" |
| App Router | Routing | Spec: "Next.js 16+ (App Router)" |
| Better Auth | Authentication | Spec: "Authentication – Better Auth" |
| JWT | Token format | Spec: "Enable JWT plugin to issue tokens" |

### Backend

| Technology | Purpose | Source |
|------------|---------|--------|
| Python | Language | Spec: "Python FastAPI" |
| FastAPI | Web framework | Spec: "Python FastAPI" |
| SQLModel | ORM | Spec: "ORM – SQLModel" |
| Pydantic | Validation | Implied by FastAPI/SQLModel |

### Database

| Technology | Purpose | Source |
|------------|---------|--------|
| PostgreSQL | Database | Spec: "Neon Serverless PostgreSQL" |
| Neon | Hosting | Spec: "Neon Serverless PostgreSQL" |

### Development

| Technology | Purpose | Source |
|------------|---------|--------|
| Claude Code | AI coding | Spec: "Claude Code + Spec-Kit Plus" |
| Spec-Kit Plus | Spec management | Spec: "Claude Code + Spec-Kit Plus" |

### Deployment

| Technology | Purpose | Source |
|------------|---------|--------|
| Vercel | Frontend hosting | Spec: "Published App Link for Vercel" |

---

## Environment Variables Required

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-shared-secret-here
```

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@host/neondb
BETTER_AUTH_SECRET=your-shared-secret-here
FRONTEND_URL=http://localhost:3000
```

---

## Awaiting Your Approval

Before I start coding, please confirm:

1. Is this task breakdown clear and appropriate?
2. Is the folder structure acceptable?
3. Any tasks you want to add, remove, or reorder?
4. Ready to proceed with Stage 1 (Project Setup)?
