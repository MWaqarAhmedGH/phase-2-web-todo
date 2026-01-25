# Phase 2: Task Validation Status

Comparison of TASKS.md against:
- `spec/phase-2.spec.md`
- `spec/acceptance.md`

---

## Legend

| Label | Meaning |
|-------|---------|
| **MUST DO** | Explicitly required by spec or acceptance criteria |
| **NICE TO HAVE** | Helpful but not explicitly required |
| **REMOVE** | Not required by spec, out of scope |

---

## Stage 1: Project Setup

| Task | Status | Justification |
|------|--------|---------------|
| ✅ 1.1 Create monorepo folder structure | **DONE** | Spec: Monorepo Structure section explicitly shows `frontend/`, `backend/`, `specs/` |
| ✅ 1.2 Initialize Next.js 16+ frontend with App Router | **DONE** | Spec: Technology Stack - "Next.js 16+ (App Router)" |
| 1.3 Initialize Python FastAPI backend with UV | **MUST DO** | Spec: Technology Stack - "Python FastAPI". Note: UV not specified, any Python package manager acceptable |
| 1.4 Create root `CLAUDE.md` file | **MUST DO** | Spec: Monorepo Structure shows `CLAUDE.md`. Acceptance: "CLAUDE.md files" required |
| 1.5 Create `frontend/CLAUDE.md` file | **MUST DO** | Spec: Monorepo Structure shows `frontend/CLAUDE.md` |
| 1.6 Create `backend/CLAUDE.md` file | **MUST DO** | Spec: Monorepo Structure shows `backend/CLAUDE.md` |
| 1.7 Create root `README.md` with setup instructions | **MUST DO** | Spec: Monorepo Structure shows `README.md`. Acceptance: "README.md with setup instructions" |

---

## Stage 2: Database Setup

| Task | Status | Justification |
|------|--------|---------------|
| 2.1 Create Neon PostgreSQL project/database | **MUST DO** | Spec: "Store data in Neon Serverless PostgreSQL database" |
| 2.2 Create `backend/db.py` - database connection | **MUST DO** | Spec: Data Persistence requirement |
| 2.3 Create `backend/models.py` - Task model with SQLModel | **MUST DO** | Spec: "ORM – SQLModel". Assumptions: "Task model includes: id, user_id, title, description, completed, created_at, updated_at" |
| 2.4 Create database migration/table creation script | **NICE TO HAVE** | Not explicitly required. SQLModel can auto-create tables. |
| 2.5 Test database connection | **NICE TO HAVE** | Good practice, not explicitly required by spec |

---

## Stage 3: Backend API (No Auth Yet)

| Task | Status | Justification |
|------|--------|---------------|
| 3.1 Create `backend/main.py` - FastAPI app entry point | **MUST DO** | Spec: "Python FastAPI" |
| 3.2 Create `backend/schemas/task.py` - Pydantic schemas | **NICE TO HAVE** | Not explicitly required. Can define inline with SQLModel. |
| 3.3 Create `backend/routes/tasks.py` - Task CRUD routes | **MUST DO** | Spec: API Endpoints section |
| 3.4 Implement `POST /api/{user_id}/tasks` | **MUST DO** | Spec: API Endpoints - "Create a new task" |
| 3.5 Implement `GET /api/{user_id}/tasks` | **MUST DO** | Spec: API Endpoints - "List all tasks" |
| 3.6 Implement `GET /api/{user_id}/tasks/{id}` | **MUST DO** | Spec: API Endpoints - "Get task details" |
| 3.7 Implement `PUT /api/{user_id}/tasks/{id}` | **MUST DO** | Spec: API Endpoints - "Update a task" |
| 3.8 Implement `DELETE /api/{user_id}/tasks/{id}` | **MUST DO** | Spec: API Endpoints - "Delete a task" |
| 3.9 Implement `PATCH /api/{user_id}/tasks/{id}/complete` | **MUST DO** | Spec: API Endpoints - "Toggle completion" |
| 3.10 Add input validation (title required, max lengths) | **MUST DO** | Acceptance: Data Validation criteria - "Title is required", "Title maximum length: 200 characters" |
| 3.11 Test all endpoints with sample user_id | **NICE TO HAVE** | Good practice, not required by spec |

---

## Stage 4: Frontend Basic UI (No Auth Yet)

| Task | Status | Justification |
|------|--------|---------------|
| 4.1 Set up Tailwind CSS (or preferred styling) | **NICE TO HAVE** | Spec says "responsive frontend interface" but doesn't specify CSS framework |
| 4.2 Create `frontend/lib/api.ts` - API client | **MUST DO** | Spec: "Frontend API Client: Attach JWT token to every API request header" |
| 4.3 Create `frontend/app/layout.tsx` - Root layout | **MUST DO** | Required by Next.js App Router |
| 4.4 Create `frontend/app/page.tsx` - Landing page | **NICE TO HAVE** | Not explicitly required. Could redirect to signin/dashboard. |
| 4.5 Create `frontend/components/TaskList.tsx` | **MUST DO** | Acceptance: "Dashboard displays user's tasks" |
| 4.6 Create `frontend/components/TaskItem.tsx` | **NICE TO HAVE** | Implementation detail. Could be part of TaskList. |
| 4.7 Create `frontend/components/TaskForm.tsx` | **MUST DO** | Acceptance: "Form to add new task", "Ability to edit existing task" |
| 4.8 Create temporary dashboard page to test CRUD | **REMOVE** | Temporary scaffolding. Not needed for submission. |
| 4.9 Test Add, View, Update, Delete, Complete features | **NICE TO HAVE** | Good practice, not required by spec |

---

## Stage 5: Authentication - Backend

| Task | Status | Justification |
|------|--------|---------------|
| 5.1 Create `backend/middleware/auth.py` - JWT verification | **MUST DO** | Spec: "FastAPI Backend: Add middleware to verify JWT and extract user" |
| 5.2 Add JWT decoding logic using shared secret | **MUST DO** | Spec: "Extracts token from header, verifies signature using shared secret" |
| 5.3 Create dependency to extract user from token | **MUST DO** | Spec: "Decodes token to get user ID, email, etc." |
| 5.4 Add user_id validation (URL must match token) | **MUST DO** | Spec: "matches it with the user ID in the URL" |
| 5.5 Protect all task routes with auth middleware | **MUST DO** | Spec: "All endpoints require valid JWT token" |
| 5.6 Return 401 for missing/invalid token | **MUST DO** | Spec: "Requests without token receive 401 Unauthorized" |
| 5.7 Return 403 for user_id mismatch | **MUST DO** | Acceptance: "URL user_id does not match token user_id → 403 Forbidden" |

---

## Stage 6: Authentication - Frontend

| Task | Status | Justification |
|------|--------|---------------|
| 6.1 Install and configure Better Auth | **MUST DO** | Spec: "Implement user signup/signin using Better Auth" |
| 6.2 Create `frontend/lib/auth.ts` - Better Auth config with JWT | **MUST DO** | Spec: "Better Auth Config: Enable JWT plugin to issue tokens" |
| 6.3 Create `frontend/lib/auth-client.ts` - Auth client instance | **NICE TO HAVE** | Implementation detail. Could be in auth.ts. |
| 6.4 Create `frontend/app/(auth)/signup/page.tsx` | **MUST DO** | Spec: "user signup/signin". Acceptance: "Signup page functional" |
| 6.5 Create `frontend/app/(auth)/signin/page.tsx` | **MUST DO** | Spec: "user signup/signin". Acceptance: "Signin page functional" |
| 6.6 Create `frontend/components/AuthForm.tsx` | **NICE TO HAVE** | Implementation detail. Could be inline. |
| 6.7 Update `lib/api.ts` to include JWT in headers | **MUST DO** | Spec: "Attach JWT token to every API request header" |
| 6.8 Create auth provider/context for app | **NICE TO HAVE** | Implementation detail. Better Auth may handle this. |
| 6.9 Add logout functionality | **MUST DO** | Acceptance: "Logout functionality clears session/token" |

---

## Stage 7: Protected Dashboard

| Task | Status | Justification |
|------|--------|---------------|
| 7.1 Create `frontend/app/dashboard/page.tsx` | **MUST DO** | Acceptance: "Dashboard displays user's tasks" |
| 7.2 Add auth check - redirect to signin if not logged in | **MUST DO** | Implied by "protected route" and user isolation |
| 7.3 Fetch and display user's tasks only | **MUST DO** | Spec: User Isolation. Acceptance: "Each user only sees their own tasks" |
| 7.4 Create `frontend/components/Navbar.tsx` | **NICE TO HAVE** | Not explicitly required. Logout can be elsewhere. |
| 7.5 Test complete auth flow | **NICE TO HAVE** | Good practice, not required by spec |

---

## Stage 8: CORS & Integration

| Task | Status | Justification |
|------|--------|---------------|
| 8.1 Configure CORS in FastAPI `main.py` | **MUST DO** | Acceptance: "CORS errors blocking frontend-backend communication" = failure |
| 8.2 Set environment variables (both services) | **MUST DO** | Spec: "BETTER_AUTH_SECRET" must be shared |
| 8.3 Test frontend ↔ backend communication | **NICE TO HAVE** | Good practice, not required by spec |
| 8.4 Verify user isolation | **MUST DO** | Acceptance: "User isolation enforced" |

---

## Stage 9: Error Handling & Validation

| Task | Status | Justification |
|------|--------|---------------|
| 9.1 Add proper error responses (400, 401, 403, 404, 500) | **MUST DO** | Acceptance: Edge Cases define expected responses |
| 9.2 Add frontend error handling and display | **NICE TO HAVE** | Good UX. Acceptance: "Poor error messages" = minor deduction |
| 9.3 Add loading states in UI | **NICE TO HAVE** | Good UX, not required by spec |
| 9.4 Test edge cases from acceptance criteria | **NICE TO HAVE** | Good practice, not required by spec |

---

## Stage 10: Deployment

| Task | Status | Justification |
|------|--------|---------------|
| 10.1 Deploy frontend to Vercel | **MUST DO** | Acceptance: "Frontend deployed to Vercel (URL provided)" |
| 10.2 Deploy backend (Railway/Render/Fly.io) | **MUST DO** | Acceptance: "Backend API accessible (URL provided)" |
| 10.3 Update environment variables for production | **MUST DO** | Required for deployment to work |
| 10.4 Test deployed application end-to-end | **NICE TO HAVE** | Good practice, not required by spec |
| 10.5 Update README with deployment URLs | **MUST DO** | Acceptance: Submission requires URLs |

---

## Stage 11: Final Checks

| Task | Status | Justification |
|------|--------|---------------|
| 11.1 Verify all 5 basic features work | **MUST DO** | Acceptance: "All 5 basic features working" |
| 11.2 Verify authentication works | **MUST DO** | Acceptance: "Authentication working" |
| 11.3 Verify user isolation works | **MUST DO** | Acceptance: "User isolation enforced" |
| 11.4 Verify data persists after restart | **MUST DO** | Acceptance: "Data persisted in Neon PostgreSQL" |
| 11.5 Check responsive design (mobile) | **MUST DO** | Spec: "Build responsive frontend interface" |
| 11.6 Record demo video (under 90 seconds) | **MUST DO** | Acceptance: "Demo video under 90 seconds" |
| 11.7 Submit via Google Form | **MUST DO** | Required for submission |

---

## Summary

### Count by Status

| Status | Count |
|--------|-------|
| **MUST DO** | 47 |
| **NICE TO HAVE** | 19 |
| **REMOVE** | 1 |

### Tasks to REMOVE

| Task | Reason |
|------|--------|
| 4.8 Create temporary dashboard page to test CRUD | Temporary scaffolding not needed for final submission |

### Tasks Marked NICE TO HAVE (Can Skip If Time Constrained)

| Stage | Tasks |
|-------|-------|
| Stage 2 | 2.4 Migration script, 2.5 Test DB connection |
| Stage 3 | 3.2 Separate schemas file, 3.11 Manual endpoint testing |
| Stage 4 | 4.1 Tailwind CSS, 4.4 Landing page, 4.6 TaskItem component, 4.9 Manual testing |
| Stage 6 | 6.3 Separate auth-client file, 6.6 AuthForm component, 6.8 Auth provider |
| Stage 7 | 7.4 Navbar component, 7.5 Manual auth flow testing |
| Stage 8 | 8.3 Integration testing |
| Stage 9 | 9.2 Frontend error display, 9.3 Loading states, 9.4 Edge case testing |
| Stage 10 | 10.4 E2E testing |

---

## Milestones

### Milestone 1: Project Foundation

**Goal:** Set up monorepo structure with Next.js frontend and FastAPI backend initialized, including all required CLAUDE.md files.

| Task | Description |
|------|-------------|
| ✅ 1.1 | Create monorepo folder structure |
| ✅ 1.2 | Initialize Next.js 16+ frontend with App Router |
| 1.3 | Initialize Python FastAPI backend |
| 1.4 | Create root `CLAUDE.md` file |
| 1.5 | Create `frontend/CLAUDE.md` file |
| 1.6 | Create `backend/CLAUDE.md` file |
| 1.7 | Create root `README.md` with setup instructions |

**Deliverable:** Project skeleton ready for development. Both `npm run dev` (frontend) and `uvicorn` (backend) can start without errors.

---

### Milestone 2: Database & Models

**Goal:** Establish connection to Neon PostgreSQL and define the Task data model using SQLModel.

| Task | Description |
|------|-------------|
| 2.1 | Create Neon PostgreSQL project/database |
| 2.2 | Create `backend/db.py` - database connection |
| 2.3 | Create `backend/models.py` - Task model with SQLModel |

**Deliverable:** Database connected. Task table created with fields: id, user_id, title, description, completed, created_at, updated_at.

---

### Milestone 3: Backend API (Unprotected)

**Goal:** Implement all 6 REST API endpoints with input validation. CORS enabled for frontend communication.

| Task | Description |
|------|-------------|
| 3.1 | Create `backend/main.py` - FastAPI app entry point |
| 3.3 | Create `backend/routes/tasks.py` - Task CRUD routes |
| 3.4 | Implement `POST /api/{user_id}/tasks` - Create task |
| 3.5 | Implement `GET /api/{user_id}/tasks` - List tasks |
| 3.6 | Implement `GET /api/{user_id}/tasks/{id}` - Get single task |
| 3.7 | Implement `PUT /api/{user_id}/tasks/{id}` - Update task |
| 3.8 | Implement `DELETE /api/{user_id}/tasks/{id}` - Delete task |
| 3.9 | Implement `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle complete |
| 3.10 | Add input validation (title required, max lengths) |
| 8.1 | Configure CORS in FastAPI `main.py` |

**Deliverable:** All 6 API endpoints working. Can test with curl/Postman using any user_id. Returns proper 400 errors for invalid input.

---

### Milestone 4: Backend Authentication

**Goal:** Secure all API endpoints with JWT validation. Implement user isolation so users can only access their own tasks.

| Task | Description |
|------|-------------|
| 5.1 | Create `backend/middleware/auth.py` - JWT verification |
| 5.2 | Add JWT decoding logic using shared secret |
| 5.3 | Create dependency to extract user from token |
| 5.4 | Add user_id validation (URL must match token) |
| 5.5 | Protect all task routes with auth middleware |
| 5.6 | Return 401 for missing/invalid token |
| 5.7 | Return 403 for user_id mismatch |
| 9.1 | Add proper error responses (400, 401, 403, 404, 500) |

**Deliverable:** API rejects requests without valid JWT. Returns 401/403/404 appropriately. User A cannot access User B's tasks.

---

### Milestone 5: Frontend Authentication

**Goal:** Implement Better Auth with JWT plugin. Create signup, signin, and logout functionality.

| Task | Description |
|------|-------------|
| 6.1 | Install and configure Better Auth |
| 6.2 | Create `frontend/lib/auth.ts` - Better Auth config with JWT |
| 6.4 | Create `frontend/app/(auth)/signup/page.tsx` - Signup page |
| 6.5 | Create `frontend/app/(auth)/signin/page.tsx` - Signin page |
| 6.9 | Add logout functionality |

**Deliverable:** Users can create accounts and sign in. JWT token is issued on successful login. Logout clears session.

---

### Milestone 6: Frontend Dashboard

**Goal:** Build the protected dashboard with task management UI. Connect to backend API with JWT authentication.

| Task | Description |
|------|-------------|
| 4.2 | Create `frontend/lib/api.ts` - API client |
| 4.3 | Create `frontend/app/layout.tsx` - Root layout |
| 4.5 | Create `frontend/components/TaskList.tsx` - Display tasks |
| 4.7 | Create `frontend/components/TaskForm.tsx` - Add/Edit form |
| 6.7 | Update `lib/api.ts` to include JWT in headers |
| 7.1 | Create `frontend/app/dashboard/page.tsx` - Protected dashboard |
| 7.2 | Add auth check - redirect to signin if not logged in |
| 7.3 | Fetch and display user's tasks only |

**Deliverable:** Logged-in users see their dashboard with task list. Can add, edit, delete, and toggle tasks. Non-logged-in users redirected to signin.

---

### Milestone 7: Integration & Verification

**Goal:** Configure shared secrets, verify frontend-backend communication, and confirm user isolation.

| Task | Description |
|------|-------------|
| 8.2 | Set environment variables (both services) |
| 8.4 | Verify user isolation (User A cannot see User B's tasks) |

**Deliverable:** Complete working application locally. Two test users confirmed to have isolated data.

---

### Milestone 8: Deployment

**Goal:** Deploy frontend to Vercel and backend to cloud hosting. Update documentation with live URLs.

| Task | Description |
|------|-------------|
| 10.1 | Deploy frontend to Vercel |
| 10.2 | Deploy backend (Railway/Render/Fly.io) |
| 10.3 | Update environment variables for production |
| 10.5 | Update README with deployment URLs |

**Deliverable:** Live application accessible via URLs. Both frontend and backend working in production.

---

### Milestone 9: Final Verification & Submission

**Goal:** Verify all acceptance criteria are met. Record demo video and submit project.

| Task | Description |
|------|-------------|
| 11.1 | Verify all 5 basic features work |
| 11.2 | Verify authentication works |
| 11.3 | Verify user isolation works |
| 11.4 | Verify data persists after restart |
| 11.5 | Check responsive design (mobile) |
| 11.6 | Record demo video (under 90 seconds) |
| 11.7 | Submit via Google Form |

**Deliverable:** Project submitted with GitHub URL, Vercel URL, Backend URL, and demo video link.

---

## Milestone Summary

| Milestone | Tasks | Goal |
|-----------|-------|------|
| 1. Project Foundation | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 | Monorepo structure ready |
| 2. Database & Models | 2.1, 2.2, 2.3 | Neon PostgreSQL connected |
| 3. Backend API | 3.1, 3.3-3.10, 8.1 | 6 REST endpoints working |
| 4. Backend Auth | 5.1-5.7, 9.1 | JWT protection enabled |
| 5. Frontend Auth | 6.1, 6.2, 6.4, 6.5, 6.9 | Signup/Signin/Logout working |
| 6. Frontend Dashboard | 4.2, 4.3, 4.5, 4.7, 6.7, 7.1-7.3 | Task management UI complete |
| 7. Integration | 8.2, 8.4 | Full app working locally |
| 8. Deployment | 10.1, 10.2, 10.3, 10.5 | Live on Vercel + backend host |
| 9. Submission | 11.1-11.7 | Project submitted |

**Total MUST-DO Tasks: 47**

---

## Execution Order

```
Milestone 1 ──► Milestone 2 ──► Milestone 3 ──► Milestone 4
    │                                              │
    │                                              ▼
    │                                         Milestone 5
    │                                              │
    │                                              ▼
    │                                         Milestone 6
    │                                              │
    └──────────────────────────────────────► Milestone 7
                                                   │
                                                   ▼
                                             Milestone 8
                                                   │
                                                   ▼
                                             Milestone 9
```

**Note:** Milestones 1-4 (Backend) and Milestones 5-6 (Frontend Auth + Dashboard) can potentially be developed in parallel after Milestone 1 is complete, but the flow above represents the safest sequential order.
