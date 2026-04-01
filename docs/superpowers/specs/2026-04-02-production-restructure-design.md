# PTAS Production Restructure - Design Spec

## Context

The Panchakarma Therapy Automation System (PTAS) is a full-stack IEEE conference paper project with a React frontend and FastAPI backend. Currently, frontend files sit at the repo root mixed with backend in `backend/`. This restructure converts it into a clean `client/` + `server/` monorepo with production hardening for real deployment.

## Goals

1. Clean monorepo: `client/` (React) + `server/` (FastAPI) with shared root config
2. Production hardening: input validation, logging, error handling, security headers
3. CI/CD: GitHub Actions for lint, type-check, test on PRs; deploy on main
4. Developer experience: Makefile for common commands, proper env management

## Non-Goals

- Docker Compose (skipped per user request)
- Comprehensive test suite (add basic tests only)
- Database migrations (MongoDB is schema-less, Beanie handles it)
- Feature flags, monitoring, rate limiting

---

## 1. Target Project Structure

```
panchakarma-therapy/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── algorithms/
│   │   ├── components/{atoms,molecules,organisms}
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/slices/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── server/                          # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── error_handler.py     # NEW: global exception handler
│   │   ├── models/
│   │   ├── schemas/                 # EXPANDED: all endpoint schemas
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── patient.py           # NEW
│   │   │   ├── schedule.py          # NEW
│   │   │   └── common.py            # NEW: pagination, error response
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── logging.py           # NEW: structured logging setup
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py              # NEW: test fixtures, test DB
│   │   ├── test_auth.py             # NEW
│   │   └── test_patients.py         # NEW
│   ├── seed_data.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   ├── .env.example
│   └── README.md
│
├── docs/
│   ├── architecture.md              # NEW: system architecture
│   ├── api.md                       # NEW: endpoint reference
│   └── deployment.md                # NEW: deployment guide
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # NEW: lint + type-check + test
│       └── deploy.yml               # UPDATED: Vercel + Render deploy
│
├── Makefile                         # NEW: dev, test, seed, lint, build
├── .gitignore                       # UPDATED: both client + server
├── .env.example                     # NEW: root template
├── LICENSE                          # NEW
└── README.md                        # UPDATED: full-stack overview
```

---

## 2. File Moves

All moves use `git mv` to preserve history.

| Source | Destination |
|--------|-------------|
| `src/` | `client/src/` |
| `public/` | `client/public/` |
| `index.html` | `client/index.html` |
| `package.json` | `client/package.json` |
| `package-lock.json` | `client/package-lock.json` |
| `tsconfig.json` | `client/tsconfig.json` |
| `tsconfig.node.json` | `client/tsconfig.node.json` |
| `vite.config.ts` | `client/vite.config.ts` |
| `eslint.config.js` | `client/eslint.config.js` |
| `vercel.json` | `client/vercel.json` |
| `backend/` | `server/` |

Files to delete: `build_output.txt`, `plans/`

---

## 3. Production Hardening

### 3.1 Backend: Global Error Handler

New file: `server/app/middleware/error_handler.py`

- Catches all unhandled exceptions, returns JSON `{"detail": "...", "status_code": 500}`
- Logs full traceback with structured logging
- Returns 422 for Pydantic validation errors with field details
- Returns 404 for `HTTPException(404)`

### 3.2 Backend: Structured Logging

New file: `server/app/utils/logging.py`

- Configure Python `logging` with JSON format for production
- Request/response logging middleware (method, path, status, duration)
- Log level controlled by `LOG_LEVEL` env var

### 3.3 Backend: Input Validation Schemas

Expand `server/app/schemas/` with proper Pydantic models:

- `patient.py`: CreatePatient, UpdatePatient schemas with field validation
- `schedule.py`: CreateScheduleEntry, UpdateScheduleEntry with datetime validation
- `common.py`: PaginatedResponse, ErrorResponse, SuccessResponse

### 3.4 Backend: Security Headers

Add to FastAPI middleware in `main.py`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (for HTTPS)

### 3.5 Frontend: Vite API Proxy

Update `client/vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```
Eliminates CORS issues in development.

### 3.6 Frontend: Nginx Dockerfile

New file: `client/Dockerfile`
- Stage 1: `node:20-alpine` build
- Stage 2: `nginx:alpine` serving static files
- SPA fallback routing in nginx config

### 3.7 Frontend: Error Boundary

Wrap `<App />` with a React error boundary to catch render crashes gracefully.

---

## 4. CI/CD

### 4.1 `.github/workflows/ci.yml`

Triggers on PR to `main` and `dev`:

```yaml
jobs:
  client:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm run build

  server:
    - pip install -r requirements.txt
    - python -m pytest tests/ -v
```

### 4.2 `.github/workflows/deploy.yml`

Triggers on push to `main`:
- Frontend: Vercel deploy (from `client/`)
- Backend: Render deploy (from `server/`)

---

## 5. Makefile

```makefile
.PHONY: dev-client dev-server seed test lint build

dev-client:
	cd client && npm run dev

dev-server:
	cd server && uvicorn app.main:app --reload --port 8000

seed:
	cd server && python seed_data.py

test:
	cd server && python -m pytest tests/ -v

lint:
	cd client && npm run lint
	cd client && npm run type-check

build:
	cd client && npm run build
```

---

## 6. Documentation

### README.md (root)

- Project name, one-line description
- Architecture diagram (text-based)
- Quick start (3 commands: clone, seed, run both)
- Links to client/README.md and server/README.md
- Tech stack table
- Demo credentials

### client/README.md

- Frontend-specific setup
- Available npm scripts
- Component architecture (atomic design)
- Environment variables

### server/README.md

- Backend-specific setup
- API endpoint summary table
- Environment variables
- Seeding instructions
- Algorithm 1 & 2 overview

### docs/architecture.md

- 4-layer architecture from IEEE paper
- Data flow diagram
- Technology justifications

### docs/api.md

- All endpoints with method, path, request/response schemas
- Authentication requirements per endpoint

### docs/deployment.md

- Vercel (frontend) setup steps
- Render (backend) setup steps
- MongoDB Atlas configuration
- Environment variables checklist

---

## 7. Basic Tests

### server/tests/conftest.py
- Test MongoDB database (separate from production)
- Test client fixture using `httpx.AsyncClient`
- Auth helper to get test tokens

### server/tests/test_auth.py
- Login success with valid credentials
- Login failure with wrong password
- Protected endpoint rejects unauthenticated request

### server/tests/test_patients.py
- List patients returns 200
- Get patient by ID returns correct data
- Get nonexistent patient returns 404

---

## 8. What Stays the Same

- All React components, pages, Redux slices - code unchanged, just moved
- All backend models, routes, services - code unchanged, just moved
- Scheduling algorithms (GA, PSO) - unchanged
- LLM, OCR, FAISS services - unchanged
- MongoDB Atlas for production - unchanged
- Seed data script - unchanged

---

## Verification

After restructure:
1. `cd client && npm install && npm run dev` starts frontend on :5173
2. `cd server && pip install -r requirements.txt && uvicorn app.main:app --reload` starts backend on :8000
3. Frontend login + all pages work with real backend data
4. `make test` runs backend tests successfully
5. `make lint` passes frontend lint + type-check
6. GitHub Actions CI runs on PR
