# User Isolation Verification Checklist

## Prerequisites
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Database connected (check backend logs)

---

## Test Scenario: User Isolation

### Step 1: Create User A
1. Open http://localhost:3000/signup
2. Create account:
   - Name: `User A`
   - Email: `usera@test.com`
   - Password: `password123`
3. Should redirect to /dashboard
4. **Expected:** Empty task list ("No tasks yet")

### Step 2: User A Creates Tasks
1. Add Task 1:
   - Title: `User A Task 1`
   - Description: `This belongs to User A`
2. Add Task 2:
   - Title: `User A Task 2`
   - Description: `Also User A's task`
3. **Expected:** Both tasks visible in list

### Step 3: Logout User A
1. Click "Sign out" button
2. **Expected:** Redirect to /signin

### Step 4: Create User B
1. Go to http://localhost:3000/signup
2. Create account:
   - Name: `User B`
   - Email: `userb@test.com`
   - Password: `password123`
3. Should redirect to /dashboard
4. **Expected:** Empty task list (NOT User A's tasks)

### Step 5: User B Creates Tasks
1. Add Task:
   - Title: `User B Task 1`
   - Description: `This belongs to User B`
2. **Expected:** Only User B's task visible

### Step 6: Verify User A Still Has Their Tasks
1. Click "Sign out"
2. Sign in as User A (`usera@test.com`)
3. **Expected:** User A sees only their 2 tasks (not User B's)

---

## API-Level Verification (Optional)

### Test with curl:

```bash
# Get User A's token (after signing in via frontend, check browser dev tools)
# Or create a test token

# Try to access User B's tasks with User A's token
curl -X GET "http://localhost:8000/api/USER_B_ID/tasks" \
  -H "Authorization: Bearer USER_A_TOKEN"

# Expected: 403 Forbidden {"detail": "Access denied: user_id mismatch"}
```

---

## Verification Results

| Test | Pass/Fail |
|------|-----------|
| User A can create tasks | [ ] |
| User A can only see own tasks | [ ] |
| User B cannot see User A's tasks | [ ] |
| User B can create own tasks | [ ] |
| User A's tasks persist after User B signs in | [ ] |
| API returns 403 for cross-user access | [ ] |

---

## Checklist Complete
- [ ] All tests pass
- [ ] User isolation verified
- [ ] Ready for deployment
