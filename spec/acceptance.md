# Phase II: Acceptance Criteria

---

## 1. Authentication Acceptance Criteria

### User Signup
- [ ] User can create account with email and password
- [ ] Duplicate email registration is rejected
- [ ] Password meets minimum security requirements
- [ ] Successful signup redirects to login or dashboard

### User Signin
- [ ] User can login with valid credentials
- [ ] Invalid credentials return appropriate error message
- [ ] Successful login issues JWT token
- [ ] JWT token is stored and sent with subsequent requests

### JWT Token Handling
- [ ] Token is included in `Authorization: Bearer <token>` header
- [ ] Expired tokens are rejected with 401 Unauthorized
- [ ] Invalid/malformed tokens are rejected with 401 Unauthorized
- [ ] Frontend and backend use same `BETTER_AUTH_SECRET`

---

## 2. Task CRUD Acceptance Criteria

### Add Task (POST `/api/{user_id}/tasks`)
- [ ] Task is created with valid title
- [ ] Task is associated with authenticated user
- [ ] Returns created task object with id
- [ ] `created_at` timestamp is set automatically
- [ ] `completed` defaults to false

### View Task List (GET `/api/{user_id}/tasks`)
- [ ] Returns array of tasks for authenticated user only
- [ ] Empty array returned if user has no tasks
- [ ] Tasks include: id, title, description, completed, created_at, updated_at

### Get Task Details (GET `/api/{user_id}/tasks/{id}`)
- [ ] Returns single task object
- [ ] Returns 404 if task does not exist
- [ ] Returns 403/404 if task belongs to different user

### Update Task (PUT `/api/{user_id}/tasks/{id}`)
- [ ] Task title can be updated
- [ ] Task description can be updated
- [ ] `updated_at` timestamp is modified
- [ ] Returns 404 if task does not exist
- [ ] Returns 403/404 if task belongs to different user

### Delete Task (DELETE `/api/{user_id}/tasks/{id}`)
- [ ] Task is removed from database
- [ ] Returns success confirmation
- [ ] Returns 404 if task does not exist
- [ ] Returns 403/404 if task belongs to different user

### Mark Complete (PATCH `/api/{user_id}/tasks/{id}/complete`)
- [ ] Toggles `completed` from false to true
- [ ] Toggles `completed` from true to false
- [ ] `updated_at` timestamp is modified
- [ ] Returns updated task object

---

## 3. Data Validation Acceptance Criteria

### Title Field
- [ ] Title is required (cannot be empty)
- [ ] Title minimum length: 1 character
- [ ] Title maximum length: 200 characters
- [ ] Empty title returns 400 Bad Request

### Description Field
- [ ] Description is optional (can be null/empty)
- [ ] Description maximum length: 1000 characters
- [ ] Exceeding max length returns 400 Bad Request

---

## 4. User Isolation Acceptance Criteria

- [ ] User A cannot see User B's tasks
- [ ] User A cannot update User B's tasks
- [ ] User A cannot delete User B's tasks
- [ ] User A cannot mark User B's tasks as complete
- [ ] API filters all queries by authenticated user's ID
- [ ] URL user_id must match JWT token user_id

---

## 5. Frontend Acceptance Criteria

- [ ] Responsive interface (works on mobile and desktop)
- [ ] Signup page functional
- [ ] Signin page functional
- [ ] Dashboard displays user's tasks
- [ ] Form to add new task
- [ ] Ability to edit existing task
- [ ] Ability to delete task (with confirmation)
- [ ] Ability to toggle task completion
- [ ] Logout functionality clears session/token

---

## 6. Database Acceptance Criteria

- [ ] Data persists in Neon Serverless PostgreSQL
- [ ] Tasks survive server restart
- [ ] Users table managed by Better Auth
- [ ] Tasks table has foreign key to users

---

## Edge Cases

### Authentication Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Request without token | 401 Unauthorized |
| Request with expired token | 401 Unauthorized |
| Request with malformed token | 401 Unauthorized |
| Request with token for deleted user | 401 Unauthorized |
| URL user_id does not match token user_id | 403 Forbidden |

### Task Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Create task with empty title | 400 Bad Request |
| Create task with title > 200 chars | 400 Bad Request |
| Create task with description > 1000 chars | 400 Bad Request |
| Get task that doesn't exist | 404 Not Found |
| Update task that doesn't exist | 404 Not Found |
| Delete task that doesn't exist | 404 Not Found |
| Get another user's task | 403 Forbidden or 404 Not Found |
| Update another user's task | 403 Forbidden or 404 Not Found |
| Delete another user's task | 403 Forbidden or 404 Not Found |
| Toggle complete on non-existent task | 404 Not Found |
| View tasks when user has none | 200 OK with empty array `[]` |

### Database Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Database connection fails | 500 Internal Server Error with retry |
| Duplicate task id (race condition) | Handled by database constraints |
| Very long valid title (200 chars) | Accepted and stored |
| Unicode characters in title/description | Accepted and stored correctly |
| Special characters in title | Accepted and stored correctly |

---

## What Would Cause Phase 2 to FAIL Evaluation

### Automatic Failures

1. **Wrong Technology Stack**
   - Using React instead of Next.js 16+ (App Router)
   - Using Django/Flask instead of FastAPI
   - Using MongoDB instead of Neon PostgreSQL
   - Using any ORM other than SQLModel
   - Using authentication other than Better Auth

2. **Missing Core Features**
   - Cannot add tasks
   - Cannot view tasks
   - Cannot update tasks
   - Cannot delete tasks
   - Cannot mark tasks as complete

3. **No Authentication**
   - No signup/signin functionality
   - API endpoints accessible without JWT token
   - JWT not properly validated

4. **No User Isolation**
   - User can see other users' tasks
   - User can modify other users' tasks
   - No filtering by user_id

5. **No Data Persistence**
   - Tasks lost on server restart
   - Not using Neon PostgreSQL
   - Data stored only in memory

6. **Code Written Manually**
   - Evidence of manually written code without specs
   - No specification files in `/specs` folder
   - No CLAUDE.md files

7. **Broken Deployment**
   - Frontend not deployable to Vercel
   - Backend API not accessible
   - CORS errors blocking frontend-backend communication

### Partial Credit Deductions

| Issue | Impact |
|-------|--------|
| Missing responsive design | Minor deduction |
| Poor error messages | Minor deduction |
| No input validation | Moderate deduction |
| Security vulnerabilities (exposed secrets) | Major deduction |
| Missing API endpoints | Deduction per endpoint |
| Incomplete authentication flow | Moderate to major deduction |
| No README with setup instructions | Minor deduction |

---

## Submission Checklist

- [ ] Public GitHub repository
- [ ] `/specs` folder with specification files
- [ ] `CLAUDE.md` files (root, frontend, backend)
- [ ] `README.md` with setup instructions
- [ ] Frontend deployed to Vercel (URL provided)
- [ ] Backend API accessible (URL provided)
- [ ] Demo video under 90 seconds
- [ ] All 5 basic features working
- [ ] Authentication working
- [ ] User isolation enforced
- [ ] Data persisted in Neon PostgreSQL
