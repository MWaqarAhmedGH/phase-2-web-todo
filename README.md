# Phase 2: Web Todo Application

**Hackathon II – Evolution of Todo**
Quarter 4 Student Project

---

## Project Overview

A full-stack web todo application built with:
- Multi-user authentication (Better Auth + JWT)
- User isolation (each user sees only their tasks)
- Persistent storage (Neon PostgreSQL)

This is Phase 2 of a 5-phase hackathon project, transforming a CLI todo app into a modern web application.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth with JWT |

---

## Folder Structure

```
phase-2-web-todo/
├── frontend/               # Next.js application
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities (api.ts, auth.ts)
│   └── CLAUDE.md           # Frontend AI guidelines
│
├── backend/                # FastAPI application
│   ├── main.py             # Entry point
│   ├── routes/             # API endpoints
│   ├── middleware/         # JWT auth middleware
│   ├── models.py           # SQLModel models
│   └── CLAUDE.md           # Backend AI guidelines
│
├── spec/                   # Specifications
│   ├── phase-2.spec.md     # Requirements
│   └── acceptance.md       # Acceptance criteria
│
├── design/                 # Architecture
│   └── architecture.md     # System design
│
├── CLAUDE.md               # Root AI guidelines
├── STATUS.md               # Task tracking
└── README.md               # This file
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- Neon PostgreSQL account (free tier)

### 1. Clone Repository

```bash
git clone <repository-url>
cd phase-2-web-todo
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
./venv/Scripts/activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `.env`:
```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

**Important:** `BETTER_AUTH_SECRET` must be identical in both frontend and backend.

---

## Running the Project

### Start Backend (Terminal 1)

```bash
cd backend
./venv/Scripts/activate          # Windows
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend runs at: http://localhost:3000

---

## Health Check

Verify backend is running:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/{user_id}/tasks` | List tasks |
| POST | `/api/{user_id}/tasks` | Create task |
| GET | `/api/{user_id}/tasks/{id}` | Get task |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle complete |

All task endpoints require JWT authentication.

---

## Spec-Driven Development

This project follows Spec-Driven Development using:
- **Claude Code** – AI coding assistant
- **SpecifyPlus** – Spec management (`specifyplus init .`)

All code is generated from specifications. Manual code writing is prohibited.

### Spec Files
- `spec/phase-2.spec.md` – Functional requirements
- `spec/acceptance.md` – Pass/fail criteria
- `design/architecture.md` – System design

---

## Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | CLI Todo | ✅ Complete |
| Phase 2 | Web Todo | 🔄 In Progress |
| Phase 3 | Containerized | ❌ Not Started |
| Phase 4 | Cloud Native | ❌ Not Started |
| Phase 5 | AI Chatbot | ❌ Not Started |

---

## Deployment

Both frontend and backend are deployed to **Vercel**.

### Backend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import Project → Select repository
3. Set root directory to `phase-2-web-todo/backend`
4. Add environment variables:
   - `DATABASE_URL` - Neon PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `FRONTEND_URL` - Frontend Vercel URL (add after frontend deployment)
5. Deploy and note the Backend Vercel URL

### Frontend (Vercel)

1. Import another Project (same repository)
2. Set root directory to `phase-2-web-todo/frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Backend Vercel URL
   - `BETTER_AUTH_SECRET` - Same secret as backend
   - `BETTER_AUTH_URL` - Your Frontend Vercel URL
   - `NEXT_PUBLIC_BETTER_AUTH_URL` - Your Frontend Vercel URL
4. Deploy

### Post-Deployment

Update Backend `FRONTEND_URL` environment variable with your Frontend Vercel URL for CORS.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Deployment URLs

| Service | URL |
|---------|-----|
| Frontend (Vercel) | _To be added after deployment_ |
| Backend API (Vercel) | _To be added after deployment_ |

---

## License

Student project for educational purposes.
