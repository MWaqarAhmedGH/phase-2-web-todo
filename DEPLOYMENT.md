# Deployment Guide - Evolution of Todo App (Phase 2)

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│     Vercel      │────▶│      Neon       │
│   (Frontend)    │     │    (Backend)    │     │   (Database)    │
│   Next.js App   │     │   FastAPI App   │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| Frontend | Vercel | 100GB bandwidth/month |
| Backend | Vercel | 100GB bandwidth/month |
| Database | Neon | 0.5GB storage |

---

## Prerequisites

Before deployment, ensure you have:
- [ ] GitHub account with code pushed
- [ ] Neon database URL (already configured)
- [ ] Your `BETTER_AUTH_SECRET` value

---

## Step 1: Push to GitHub

If not already done:

```bash
cd "E:\Quarter - 4\Hackathon-2\Evolution-of-Todo"

git init
git add .
git commit -m "Evolution of Todo - Phase 2"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/Evolution-of-Todo.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Vercel

### 2.1 Sign Up & Create Project

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Continue with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find and select your **Evolution-of-Todo** repository
5. Click **"Import"**

### 2.2 Configure Project (Backend)

1. **Project Name**: `evolution-todo-api` (or similar)
2. **Root Directory**: Click "Edit" and enter `phase-2-web-todo/backend`
3. **Framework Preset**: Other (Vercel will auto-detect Python)
4. Expand **"Environment Variables"** section

### 2.3 Add Environment Variables

Add these variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL URL |
| `FRONTEND_URL` | `https://placeholder.vercel.app` (update later) |
| `BETTER_AUTH_SECRET` | Your secret (min 32 chars) |

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Copy your Backend Vercel URL (e.g., `https://evolution-todo-api.vercel.app`)

**Save this URL - you'll need it for frontend!**

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Another Project

1. Go back to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. Select the **same repository** (Evolution-of-Todo)
4. Click **"Import"**

### 3.2 Configure Project (Frontend)

1. **Project Name**: `evolution-todo-app` (or similar)
2. **Root Directory**: Click "Edit" and enter `phase-2-web-todo/frontend`
3. **Framework Preset**: Next.js (auto-detected)
4. Expand **"Environment Variables"** section

### 3.3 Add Environment Variables

Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app` (from Step 2) |
| `BETTER_AUTH_SECRET` | Same secret as backend |
| `BETTER_AUTH_URL` | `https://your-frontend.vercel.app` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://your-frontend.vercel.app` |

**Note**: For `BETTER_AUTH_URL`, use Vercel's auto-generated URL or your custom domain.

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Copy your Frontend Vercel URL (e.g., `https://evolution-todo-app.vercel.app`)

---

## Step 4: Update Backend CORS

Now that you have your Frontend Vercel URL:

1. Go back to **Vercel** dashboard
2. Select your **backend project** (`evolution-todo-api`)
3. Go to **"Settings"** → **"Environment Variables"**
4. Update `FRONTEND_URL` with your actual Frontend Vercel URL:
   ```
   FRONTEND_URL=https://evolution-todo-app.vercel.app
   ```
5. Go to **"Deployments"** tab and click **"Redeploy"** on the latest deployment

---

## Step 5: Verify Deployment

### Test Backend
- Health check: `https://your-backend.vercel.app/health`
- API docs: `https://your-backend.vercel.app/docs`
- Root: `https://your-backend.vercel.app/`

### Test Frontend
1. Visit your Frontend Vercel URL
2. Click **"Sign Up"** → Create an account
3. You should land on the dashboard
4. Create a task → Verify it saves
5. Toggle task complete → Verify it updates
6. Delete task → Verify it removes

### Verification Checklist
- [ ] Backend health endpoint returns OK
- [ ] Backend /docs page loads
- [ ] Frontend landing page loads
- [ ] Can sign up new user
- [ ] Can sign in existing user
- [ ] Can create tasks
- [ ] Can toggle task completion
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Sign out works

---

## Environment Variables Reference

### Backend (Vercel)

```env
# Neon PostgreSQL connection
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Frontend URL for CORS
FRONTEND_URL=https://your-frontend.vercel.app

# JWT verification secret (MUST match frontend)
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
```

### Frontend (Vercel)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app

# Better Auth configuration
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
BETTER_AUTH_URL=https://your-frontend.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-frontend.vercel.app
```

**CRITICAL**: `BETTER_AUTH_SECRET` must be IDENTICAL on both platforms!

---

## Troubleshooting

### CORS Errors (Frontend can't reach backend)
```
Access to fetch blocked by CORS policy
```
**Solution**: Ensure `FRONTEND_URL` in backend exactly matches your frontend Vercel URL (no trailing slash)

### 401 Unauthorized Errors
```
401: Unauthorized
```
**Solution**:
- Verify `BETTER_AUTH_SECRET` is identical on both platforms
- Check there are no extra spaces in the secret

### Database Connection Failed
```
Connection refused / timeout
```
**Solution**:
- Verify `DATABASE_URL` is correct
- Ensure `?sslmode=require` is at the end
- Check Neon console - database might be paused

### Build Failed on Vercel (Frontend)
**Solution**: Check build logs. Common issues:
- Wrong root directory
- Missing environment variables
- TypeScript errors

### Build Failed on Vercel (Backend)
**Solution**: Check deploy logs. Common issues:
- Wrong root directory
- Missing dependencies in requirements.txt
- Python version mismatch
- Missing `api/index.py` entry point

### Function Timeout (Backend)
```
FUNCTION_INVOCATION_TIMEOUT
```
**Solution**:
- Vercel serverless functions have a 10s timeout on free tier
- Ensure database queries are optimized
- Consider upgrading Vercel plan if needed

---

## Redeployment

Both projects auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Redeploy
- Go to Vercel Dashboard → Select Project → "Deployments" → "Redeploy"

---

## Custom Domain (Optional)

### Adding Custom Domain
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

Remember to update `FRONTEND_URL` and `BETTER_AUTH_URL` if you use custom domains!

---

## Cost Estimation

| Service | Free Tier | Typical Usage |
|---------|-----------|---------------|
| Vercel (Frontend) | 100GB bandwidth | Sufficient for demo |
| Vercel (Backend) | 100GB bandwidth, 100 hrs/month | Sufficient for demo |
| Neon | 0.5GB storage | Sufficient for demo |

Your app should run within free tiers for development and demo purposes.

---

## Architecture Notes

### Why Vercel for Both?
- **Simplified Deployment**: Single platform for both services
- **Free Tier**: Generous limits for demo/development
- **Auto-scaling**: Serverless functions scale automatically
- **Edge Network**: Fast global performance
- **Easy CI/CD**: Auto-deploy on git push

### Backend as Serverless
The FastAPI backend runs as Vercel Serverless Functions using:
- `api/index.py` - Entry point that exports the FastAPI app
- `mangum` - ASGI adapter for serverless environments
- Cold starts may add ~500ms latency on first request

---

## Support Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/runtimes/python)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI with Vercel](https://fastapi.tiangolo.com/deployment/manually/)
