# CLAUDE.md – Frontend

## Scope

This directory contains the **Next.js 16+ frontend** for the Phase 2 Web Todo application.

**Responsibilities:**
- User interface (signup, signin, dashboard)
- Better Auth configuration with JWT
- API client to communicate with backend
- Task management UI (list, add, edit, delete, complete)
- Protected routes (redirect if not authenticated)

**NOT Responsible For:**
- Database access (backend handles this)
- JWT verification (backend middleware)
- Task business logic (backend API)

---

## Allowed Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16+ | Framework (App Router) |
| React | 19+ | UI library |
| TypeScript | 5+ | Type safety |
| Better Auth | Latest | Authentication |

**CSS:** Use what's installed (Tailwind came with Next.js init). Keep styling minimal.

---

## Directory Structure

```
frontend/
├── app/                    # App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── (auth)/             # Auth route group
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   └── dashboard/page.tsx  # Protected route
│
├── components/             # React components
│   ├── TaskList.tsx
│   ├── TaskForm.tsx
│   └── ...
│
├── lib/                    # Utilities
│   ├── api.ts              # API client with JWT
│   └── auth.ts             # Better Auth config
│
└── CLAUDE.md               # This file
```

---

## Source of Truth

| File | What to Check |
|------|---------------|
| `../spec/phase-2.spec.md` | Frontend requirements |
| `../spec/acceptance.md` | UI acceptance criteria |
| `../design/architecture.md` | Component structure |
| `../STATUS.md` | Current task |

---

## Prohibited Actions

**DO NOT:**
1. Access database directly (use backend API)
2. Create backend files
3. Modify `../spec/` or `../design/` files
4. Install packages not in spec (Next.js, Better Auth only)
5. Hardcode API URLs (use environment variables)
6. Store sensitive data in client code
7. Skip authentication on protected routes
8. Assume user_id (get from auth token)

---

## API Communication

**Base URL:** `process.env.NEXT_PUBLIC_API_URL`

**All API calls must:**
1. Include JWT token in `Authorization: Bearer <token>` header
2. Use the authenticated user's ID in the URL path
3. Handle errors gracefully (401, 403, 404, 500)

**Endpoints to call:**
```typescript
GET    /api/{user_id}/tasks           // List tasks
POST   /api/{user_id}/tasks           // Create task
GET    /api/{user_id}/tasks/{id}      // Get task
PUT    /api/{user_id}/tasks/{id}      // Update task
DELETE /api/{user_id}/tasks/{id}      // Delete task
PATCH  /api/{user_id}/tasks/{id}/complete  // Toggle complete
```

---

## Authentication Flow

1. User signs up/in via Better Auth
2. Better Auth issues JWT token
3. Store token (Better Auth handles this)
4. Include token in all API requests
5. Redirect to `/signin` if token missing/expired

---

## Task Workflow

### Before Creating a Component
1. Check if it exists in `../design/architecture.md`
2. Verify it's needed for current task in `../STATUS.md`
3. Follow naming conventions (PascalCase for components)

### After Creating a Component
1. Verify it renders without errors
2. Ensure it follows spec requirements
3. Update `../STATUS.md` if task complete

---

## Environment Variables

**File:** `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<shared-with-backend>
```

**Rules:**
- Never commit `.env.local` to git
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Keep `BETTER_AUTH_SECRET` same as backend

---

## Quick Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```
