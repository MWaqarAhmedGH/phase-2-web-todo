# Deployment Guide - Evolution of Todo App (Phase 2)

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│     Railway     │────▶│      Neon       │
│   (Frontend)    │     │    (Backend)    │     │   (Database)    │
│   Next.js App   │     │   FastAPI App   │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| Frontend | Vercel | 100GB bandwidth/month |
| Backend | Railway | $5 credit/month |
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

## Step 2: Deploy Backend to Railway

### 2.1 Sign Up & Create Project

1. Go to **https://railway.app**
2. Click **"Login"** → Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Authorize Railway to access your repository
6. Select your **Evolution-of-Todo** repository

### 2.2 Configure Root Directory

1. After selecting repo, Railway will ask for settings
2. Set **Root Directory**: `phase-2-web-todo/backend`
3. Click **"Deploy"**

### 2.3 Add Environment Variables

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL URL |
| `FRONTEND_URL` | `https://placeholder.vercel.app` (update later) |
| `BETTER_AUTH_SECRET` | Your secret (min 32 chars) |

### 2.4 Get Your Railway URL

1. Go to **"Settings"** tab
2. Under **"Domains"**, click **"Generate Domain"**
3. Copy the URL (e.g., `https://evolution-todo-production.up.railway.app`)

**Save this URL - you'll need it for frontend!**

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up & Import Project

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Continue with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find and select your **Evolution-of-Todo** repository
5. Click **"Import"**

### 3.2 Configure Project

1. **Root Directory**: Click "Edit" and enter `phase-2-web-todo/frontend`
2. **Framework Preset**: Next.js (auto-detected)
3. Expand **"Environment Variables"** section

### 3.3 Add Environment Variables

Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-url.railway.app` |
| `BETTER_AUTH_SECRET` | Same secret as backend |
| `BETTER_AUTH_URL` | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://your-project.vercel.app` |

**Note**: For `BETTER_AUTH_URL`, use Vercel's auto-generated URL or your custom domain.

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Copy your Vercel URL (e.g., `https://evolution-todo.vercel.app`)

---

## Step 4: Update Backend CORS

Now that you have your Vercel URL:

1. Go back to **Railway** dashboard
2. Click on your service → **"Variables"**
3. Update `FRONTEND_URL` with your actual Vercel URL:
   ```
   FRONTEND_URL=https://your-actual-app.vercel.app
   ```
4. Railway will automatically redeploy

---

## Step 5: Verify Deployment

### Test Backend
- Health check: `https://your-railway-url.railway.app/health`
- API docs: `https://your-railway-url.railway.app/docs`

### Test Frontend
1. Visit your Vercel URL
2. Click **"Sign Up"** → Create an account
3. You should land on the dashboard
4. Create a task → Verify it saves
5. Toggle task complete → Verify it updates
6. Delete task → Verify it removes

### Verification Checklist
- [ ] Backend health endpoint returns OK
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

### Backend (Railway)

```env
# Neon PostgreSQL connection
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Frontend URL for CORS
FRONTEND_URL=https://your-app.vercel.app

# JWT verification secret (MUST match frontend)
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
```

### Frontend (Vercel)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-api.railway.app

# Better Auth configuration
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
BETTER_AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.vercel.app
```

**CRITICAL**: `BETTER_AUTH_SECRET` must be IDENTICAL on both platforms!

---

## Troubleshooting

### CORS Errors (Frontend can't reach backend)
```
Access to fetch blocked by CORS policy
```
**Solution**: Ensure `FRONTEND_URL` in Railway exactly matches your Vercel URL (no trailing slash)

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

### Build Failed on Vercel
**Solution**: Check build logs. Common issues:
- Wrong root directory
- Missing environment variables
- TypeScript errors

### Build Failed on Railway
**Solution**: Check deploy logs. Common issues:
- Wrong root directory
- Missing dependencies in requirements.txt
- Python version mismatch

---

## Redeployment

Both platforms auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Redeploy
- **Vercel**: Dashboard → Project → "Redeploy"
- **Railway**: Dashboard → Service → "Redeploy"

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Railway
1. Go to Service Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

Remember to update `FRONTEND_URL` and `BETTER_AUTH_URL` if you use custom domains!

---

## Cost Estimation

| Service | Free Tier | Typical Usage |
|---------|-----------|---------------|
| Vercel | 100GB bandwidth | Sufficient for demo |
| Railway | $5/month credit | ~500 hours |
| Neon | 0.5GB storage | Sufficient for demo |

Your app should run within free tiers for development and demo purposes.

---

## Support Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
