# Production Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure PTAS into a clean client/server monorepo with production hardening, CI/CD, and documentation.

**Architecture:** Move frontend to `client/`, rename `backend/` to `server/`, add production middleware (error handling, logging, security headers, input validation), basic backend tests, GitHub Actions CI, Makefile, and documentation.

**Tech Stack:** React 19 + Vite (client), FastAPI + MongoDB (server), GitHub Actions (CI), Nginx (client Dockerfile), pytest (tests)

---

### Task 1: Move Frontend Files to `client/`

**Files:**
- Move: `src/` -> `client/src/`
- Move: `public/` -> `client/public/`
- Move: `index.html` -> `client/index.html`
- Move: `package.json` -> `client/package.json`
- Move: `package-lock.json` -> `client/package-lock.json`
- Move: `tsconfig.json` -> `client/tsconfig.json`
- Move: `tsconfig.node.json` -> `client/tsconfig.node.json`
- Move: `vite.config.ts` -> `client/vite.config.ts`
- Move: `eslint.config.js` -> `client/eslint.config.js`
- Move: `vercel.json` -> `client/vercel.json`
- Delete: `build_output.txt`, `plans/`

- [ ] **Step 1: Create client directory and move files**

```bash
cd "C:/Users/Arun/Downloads/panchakarma-therapy-main (1)/panchakarma-therapy-main"
mkdir -p client
git mv src/ client/src/
git mv public/ client/public/
git mv index.html client/index.html
git mv package.json client/package.json
git mv package-lock.json client/package-lock.json
git mv tsconfig.json client/tsconfig.json
git mv tsconfig.node.json client/tsconfig.node.json
git mv vite.config.ts client/vite.config.ts
git mv eslint.config.js client/eslint.config.js
git mv vercel.json client/vercel.json
```

- [ ] **Step 2: Rename backend/ to server/**

```bash
git mv backend/ server/
```

- [ ] **Step 3: Remove stale files**

```bash
rm build_output.txt
rm -rf plans/
```

- [ ] **Step 4: Verify frontend still builds from client/**

```bash
cd client && npm install && npx vite build 2>&1 | tail -5
```

Expected: Build succeeds (or pre-existing TS errors only, no path errors).

- [ ] **Step 5: Verify backend still imports from server/**

```bash
cd ../server && python -c "from app.main import app; print('OK:', app.title)"
```

Expected: `OK: Panchakarma Therapy Automation System`

- [ ] **Step 6: Commit**

```bash
cd ..
git add -A
git commit -m "refactor: restructure into client/server monorepo"
```

---

### Task 2: Update Vite Config with API Proxy

**Files:**
- Modify: `client/vite.config.ts`

- [ ] **Step 1: Update vite.config.ts with proxy and build settings**

Replace the full contents of `client/vite.config.ts` with:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

- [ ] **Step 2: Update appConfig.ts to use relative /api path in dev**

In `client/src/constants/appConfig.ts`, change `baseUrl` to:

```typescript
baseUrl: import.meta.env.VITE_API_URL || '/api',
```

This means in dev the Vite proxy forwards `/api` to the backend. In production, set `VITE_API_URL` to the full backend URL.

- [ ] **Step 3: Commit**

```bash
git add client/vite.config.ts client/src/constants/appConfig.ts
git commit -m "feat: add Vite API proxy for dev, relative API paths"
```

---

### Task 3: Frontend Client Dockerfile + .env.example

**Files:**
- Create: `client/Dockerfile`
- Create: `client/.env.example`
- Create: `client/nginx.conf`

- [ ] **Step 1: Create Nginx config for SPA**

Create `client/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

- [ ] **Step 2: Create multi-stage Dockerfile**

Create `client/Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: Create .env.example**

Create `client/.env.example`:

```
VITE_API_URL=http://localhost:8000/api
```

- [ ] **Step 4: Commit**

```bash
git add client/Dockerfile client/nginx.conf client/.env.example
git commit -m "feat: add client Dockerfile (Nginx) and env template"
```

---

### Task 4: Backend Error Handler Middleware

**Files:**
- Create: `server/app/middleware/error_handler.py`
- Modify: `server/app/main.py`

- [ ] **Step 1: Create global error handler**

Create `server/app/middleware/error_handler.py`:

```python
import logging
import traceback
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code},
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        })
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": errors, "status_code": 422},
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(
        "Unhandled exception on %s %s: %s",
        request.method,
        request.url.path,
        str(exc),
    )
    logger.debug(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "status_code": 500},
    )
```

- [ ] **Step 2: Register handlers in main.py**

Add these imports and registrations to `server/app/main.py`. After the `app = FastAPI(...)` block and before CORS middleware, add:

```python
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)
```

- [ ] **Step 3: Commit**

```bash
git add server/app/middleware/error_handler.py server/app/main.py
git commit -m "feat: add global error handler middleware"
```

---

### Task 5: Structured Logging

**Files:**
- Create: `server/app/utils/logging.py`
- Modify: `server/app/main.py`
- Modify: `server/app/config.py`

- [ ] **Step 1: Add LOG_LEVEL to config**

In `server/app/config.py`, add to the `Settings` class:

```python
LOG_LEVEL: str = "INFO"
```

- [ ] **Step 2: Create logging setup**

Create `server/app/utils/logging.py`:

```python
import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


def setup_logging(log_level: str = "INFO"):
    logging.basicConfig(
        level=getattr(logging, log_level.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    # Quiet noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("motor").setLevel(logging.WARNING)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = round((time.time() - start) * 1000)

        logger = logging.getLogger("api")
        logger.info(
            "%s %s -> %d (%dms)",
            request.method,
            request.url.path,
            response.status_code,
            duration,
        )
        return response
```

- [ ] **Step 3: Wire logging into main.py**

In `server/app/main.py`, add after imports:

```python
from app.utils.logging import setup_logging, RequestLoggingMiddleware

setup_logging(settings.LOG_LEVEL)
```

And after CORS middleware add:

```python
app.add_middleware(RequestLoggingMiddleware)
```

- [ ] **Step 4: Commit**

```bash
git add server/app/utils/logging.py server/app/main.py server/app/config.py
git commit -m "feat: add structured logging with request middleware"
```

---

### Task 6: Security Headers Middleware

**Files:**
- Modify: `server/app/main.py`

- [ ] **Step 1: Add security headers middleware**

In `server/app/main.py`, add this middleware class and register it after CORS:

```python
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)
```

Note: Import `Request` from `fastapi` (already imported for routes).

- [ ] **Step 2: Commit**

```bash
git add server/app/main.py
git commit -m "feat: add security headers middleware"
```

---

### Task 7: Input Validation Schemas

**Files:**
- Create: `server/app/schemas/patient.py`
- Create: `server/app/schemas/schedule.py`
- Create: `server/app/schemas/common.py`
- Modify: `server/app/routes/patients.py`
- Modify: `server/app/routes/schedule.py`

- [ ] **Step 1: Create common schemas**

Create `server/app/schemas/common.py`:

```python
from typing import Generic, List, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    detail: str
    status_code: int


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "Operation successful"
```

- [ ] **Step 2: Create patient schemas**

Create `server/app/schemas/patient.py`:

```python
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class CreatePatient(BaseModel):
    id: str = Field(..., min_length=1, description="Unique patient ID")
    name: str = Field(..., min_length=1, max_length=200)
    age: int = Field(..., ge=0, le=120)
    gender: Literal["Male", "Female", "Other"]
    email: str = Field(..., min_length=3)
    phone: str = Field(..., min_length=5)
    complaint: str = Field(..., min_length=1)
    conditions: List[str] = []
    history: List[dict] = []
    availability: List[dict] = []


class UpdatePatient(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    complaint: Optional[str] = None
    conditions: Optional[List[str]] = None
```

- [ ] **Step 3: Create schedule schemas**

Create `server/app/schemas/schedule.py`:

```python
from typing import Optional, Union, Literal
from pydantic import BaseModel, Field


class CreateScheduleEntry(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=1)
    start: str = Field(..., description="ISO datetime string")
    end: str = Field(..., description="ISO datetime string")
    resourceId: str = Field(..., min_length=1)
    therapistId: Union[int, str]
    patientId: str = Field(..., min_length=1)
    type: str = Field(..., min_length=1)
    status: Literal["Scheduled", "Completed", "Cancelled", "In Progress"] = "Scheduled"


class UpdateScheduleEntry(BaseModel):
    title: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    resourceId: Optional[str] = None
    therapistId: Optional[Union[int, str]] = None
    patientId: Optional[str] = None
    type: Optional[str] = None
    status: Optional[Literal["Scheduled", "Completed", "Cancelled", "In Progress"]] = None
```

- [ ] **Step 4: Update patients route to use schemas**

In `server/app/routes/patients.py`, change the `create_patient` and `update_patient` endpoints:

Replace `async def create_patient(data: dict, ...)` with:

```python
from app.schemas.patient import CreatePatient, UpdatePatient

@router.post("/")
async def create_patient(data: CreatePatient, user=Depends(get_current_user)):
    patient = Patient(
        pid=data.id, name=data.name, age=data.age, gender=data.gender,
        email=data.email, phone=data.phone, complaint=data.complaint,
        conditions=data.conditions, history=[], availability=[],
    )
    await patient.insert()
    return {"id": patient.pid, "name": patient.name}
```

Replace `async def update_patient(patient_id: str, data: dict, ...)` with:

```python
@router.put("/{patient_id}")
async def update_patient(patient_id: str, data: UpdatePatient, user=Depends(get_current_user)):
    patient = await Patient.find_one(Patient.pid == patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    update_data = data.model_dump(exclude_none=True)
    for key, value in update_data.items():
        if hasattr(patient, key):
            setattr(patient, key, value)
    await patient.save()
    return {"id": patient.pid, "message": "Patient updated"}
```

- [ ] **Step 5: Update schedule route to use schemas**

In `server/app/routes/schedule.py`, update the `create_session` signature:

Replace `async def create_session(data: dict, ...)` with:

```python
from app.schemas.schedule import CreateScheduleEntry, UpdateScheduleEntry

@router.post("/")
async def create_session(data: CreateScheduleEntry, user=Depends(get_current_user)):
    entry_dict = data.model_dump()
    sid = entry_dict.pop("id", None) or f"s-{uuid.uuid4().hex[:8]}"
    entry_dict["sid"] = sid
    # ... rest of existing logic using entry_dict instead of data
```

Replace `async def update_session(entry_id: str, data: dict, ...)` with:

```python
@router.put("/{entry_id}")
async def update_session(entry_id: str, data: UpdateScheduleEntry, user=Depends(get_current_user)):
    entry = await ScheduleEntry.find_one(ScheduleEntry.sid == entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    update_data = data.model_dump(exclude_none=True)
    # ... rest of existing update logic using update_data
```

- [ ] **Step 6: Commit**

```bash
git add server/app/schemas/ server/app/routes/patients.py server/app/routes/schedule.py
git commit -m "feat: add input validation schemas for patients and schedule"
```

---

### Task 8: Backend Tests

**Files:**
- Create: `server/tests/conftest.py`
- Create: `server/tests/test_auth.py`
- Create: `server/tests/test_patients.py`

- [ ] **Step 1: Create test fixtures**

Create `server/tests/conftest.py`:

```python
import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db, close_db
from app.models.user import User
from app.services.auth_service import hash_password, create_access_token


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    await init_db()
    # Ensure test user exists
    existing = await User.find_one(User.email == "admin@panchakarma.com")
    if not existing:
        await User(
            uid="u1",
            name="Admin User",
            email="admin@panchakarma.com",
            password_hash=hash_password("admin123"),
            role="Admin",
        ).insert()
    yield
    await close_db()


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture
def auth_token():
    return create_access_token("u1", "Admin")


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}
```

- [ ] **Step 2: Create auth tests**

Create `server/tests/test_auth.py`:

```python
import pytest


@pytest.mark.asyncio
async def test_login_success(client):
    response = await client.post(
        "/api/auth/login",
        json={"username": "admin@panchakarma.com", "password": "admin123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "admin@panchakarma.com"
    assert data["user"]["role"] == "Admin"


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    response = await client.post(
        "/api/auth/login",
        json={"username": "admin@panchakarma.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_protected_endpoint_rejects_unauthenticated(client):
    response = await client.get("/api/patients/")
    assert response.status_code == 403
```

- [ ] **Step 3: Create patient tests**

Create `server/tests/test_patients.py`:

```python
import pytest


@pytest.mark.asyncio
async def test_list_patients(client, auth_headers):
    response = await client.get("/api/patients/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_patient_by_id(client, auth_headers):
    response = await client.get("/api/patients/p1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "p1"
    assert "name" in data


@pytest.mark.asyncio
async def test_get_nonexistent_patient(client, auth_headers):
    response = await client.get("/api/patients/does-not-exist", headers=auth_headers)
    assert response.status_code == 404
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd server && python -m pytest tests/ -v
```

Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add server/tests/
git commit -m "test: add auth and patient endpoint tests"
```

---

### Task 9: Frontend Error Boundary

**Files:**
- Create: `client/src/components/ErrorBoundary.tsx`
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Create ErrorBoundary component**

Create `client/src/components/ErrorBoundary.tsx`:

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif',
                    padding: '2rem', textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a2e' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        An unexpected error occurred. Please refresh the page or contact support.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 1.5rem', backgroundColor: '#5b5fc7',
                            color: 'white', border: 'none', borderRadius: '8px',
                            cursor: 'pointer', fontSize: '1rem',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
```

- [ ] **Step 2: Wrap App with ErrorBoundary**

Update `client/src/App.tsx`:

```tsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <div className="app-container">
                <AppRoutes />
            </div>
        </ErrorBoundary>
    );
};

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/ErrorBoundary.tsx client/src/App.tsx
git commit -m "feat: add React error boundary for crash handling"
```

---

### Task 10: Root Makefile and .gitignore

**Files:**
- Create: `Makefile`
- Create: `.env.example` (root)
- Create: `LICENSE`
- Modify: `.gitignore`

- [ ] **Step 1: Create Makefile**

Create `Makefile` at project root:

```makefile
.PHONY: dev-client dev-server seed test lint build install

install:
	cd client && npm install
	cd server && pip install -r requirements.txt

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

- [ ] **Step 2: Create root .env.example**

Create `.env.example` at project root:

```
# See client/.env.example for frontend environment variables
# See server/.env.example for backend environment variables
```

- [ ] **Step 3: Create LICENSE**

Create `LICENSE` (MIT):

```
MIT License

Copyright (c) 2026 Panchakarma Therapy Automation System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Update .gitignore for monorepo**

Replace `.gitignore` contents with:

```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo

# Build outputs
dist/
dist-ssr/
build/
*.egg-info/

# Environment
.env
*.local

# IDE
.vscode/*
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.DS_Store

# Backend specific
server/uploads/
server/faiss_index/
server/.pytest_cache/

# Logs
logs/
*.log

# Temp
*.tmp
```

- [ ] **Step 5: Commit**

```bash
git add Makefile .env.example LICENSE .gitignore
git commit -m "feat: add Makefile, LICENSE, root config"
```

---

### Task 11: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `.github/workflows/vercel-deployment.yml` -> `.github/workflows/deploy.yml`

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [dev]

jobs:
  client:
    name: Client Lint & Build
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  server:
    name: Server Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: server
    env:
      MONGODB_URL: ${{ secrets.MONGODB_URL }}
      JWT_SECRET: test-secret-key
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: python -m pytest tests/ -v
```

- [ ] **Step 2: Update deploy workflow for monorepo**

Replace `.github/workflows/vercel-deployment.yml` with `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-client:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

- [ ] **Step 3: Remove old workflow file**

```bash
git rm .github/workflows/vercel-deployment.yml
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/
git commit -m "ci: add CI pipeline and update deploy workflow for monorepo"
```

---

### Task 12: Documentation

**Files:**
- Create: `README.md` (root - overwrite)
- Create: `client/README.md`
- Create: `server/README.md`
- Create: `docs/architecture.md`
- Create: `docs/api.md`
- Create: `docs/deployment.md`

- [ ] **Step 1: Create root README.md**

Overwrite `README.md` with:

```markdown
# Panchakarma Therapy Automation System (PTAS)

A web-based therapy automation system for Panchakarma - an Ayurvedic healthcare management platform that digitizes therapy protocols using LLMs and optimizes scheduling with hybrid algorithms (GA + PSO).

**IEEE Conference Paper Implementation** | Dr. Mahalingam College of Engineering and Technology

## Architecture

```
Browser  -->  React Client (:5173)  -->  FastAPI Server (:8000)  -->  MongoDB Atlas
                                              |
                                    HuggingFace LLM API
                                    Tesseract OCR
                                    FAISS Vector Search
```

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Boominathan2355/panchakarma-therapy.git
cd panchakarma-therapy

# 2. Install
make install

# 3. Configure backend
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URL and JWT secret

# 4. Seed database
make seed

# 5. Run (two terminals)
make dev-server   # Terminal 1: Backend on :8000
make dev-client   # Terminal 2: Frontend on :5173
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@panchakarma.com | admin123 |
| Physician | doctor@panchakarma.com | doctor123 |
| Therapist | therapist@panchakarma.com | therapist123 |
| Staff | staff@panchakarma.com | staff123 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Redux Toolkit, Vite |
| Backend | FastAPI, Python 3.11, Beanie ODM |
| Database | MongoDB Atlas |
| AI/ML | HuggingFace Inference API, Sentence-Transformers, FAISS |
| OCR | Tesseract, PyPDF2, python-docx |
| Scheduling | Genetic Algorithm + Particle Swarm Optimization |
| CI/CD | GitHub Actions, Vercel (frontend), Render (backend) |

## Project Structure

```
panchakarma-therapy/
├── client/          # React frontend
├── server/          # FastAPI backend
├── docs/            # Architecture, API docs, deployment guide
├── .github/         # CI/CD workflows
└── Makefile         # Common commands
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for details.

## Core Algorithms (from IEEE paper)

**Algorithm 1 - LLM Document Processing:** Upload therapy protocol PDFs/DOCs, extract text (OCR for scanned), send to LLM for structured JSON, generate semantic embeddings for search.

**Algorithm 2 - Hybrid Scheduling:** Rule-based constraint validation + Genetic Algorithm optimization + Particle Swarm refinement + Priority-based emergency handling.

## License

MIT
```

- [ ] **Step 2: Create client/README.md**

Create `client/README.md`:

```markdown
# PTAS Client

React frontend for the Panchakarma Therapy Automation System.

## Setup

```bash
npm install
npm run dev       # Start dev server on :5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to dist/ |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run preview` | Preview production build |

## Architecture

Uses **Atomic Design** pattern:
- `atoms/` - Basic UI (Button, Input, Card)
- `molecules/` - Composite (FormField, StatsCard)
- `organisms/` - Complex (PatientList, TherapyCalendar, ScheduleOptimizer)
- `templates/` - Layouts (MainLayout, AuthLayout)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (proxied in dev) |
| `VITE_USE_MOCK` | Enable mock mode | `false` |
```

- [ ] **Step 3: Create server/README.md**

Create `server/README.md`:

```markdown
# PTAS Server

FastAPI backend for the Panchakarma Therapy Automation System.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URL
python seed_data.py
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/auth/login | User login | No |
| GET | /api/patients | List patients | Yes |
| GET | /api/patients/:id | Get patient | Yes |
| GET | /api/therapies | List therapies | Yes |
| GET | /api/therapies/:id | Get therapy | Yes |
| GET | /api/therapy-plans | List plans | Yes |
| GET/POST | /api/schedule | List/Create sessions | Yes |
| PUT/DELETE | /api/schedule/:id | Update/Delete session | Yes |
| GET | /api/therapists | List therapists | Yes |
| GET | /api/rooms | List rooms | Yes |
| GET/PUT | /api/materials | List/Update materials | Yes |
| GET/POST | /api/audit | Audit logs | Yes |
| POST/GET/DELETE | /api/documents | Document management | Yes |
| GET | /api/dashboard/* | Dashboard data | Yes |
| GET | /api/health | Health check | No |

API docs available at: `http://localhost:8000/docs`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing key |
| `HF_API_TOKEN` | No | HuggingFace API token for LLM |
| `HF_MODEL_ID` | No | LLM model ID |
| `CORS_ORIGINS` | No | Allowed CORS origins |
| `UPLOAD_DIR` | No | File upload directory |
| `LOG_LEVEL` | No | Logging level (default: INFO) |

## Testing

```bash
python -m pytest tests/ -v
```
```

- [ ] **Step 4: Create docs/architecture.md**

Create `docs/architecture.md`:

```markdown
# System Architecture

## 4-Layer Architecture (from IEEE paper)

```
+--------------------------------------------------+
|              Application Layer                     |
|    React SPA + Redux State Management             |
+--------------------------------------------------+
|           Workflow Automation Layer                 |
|    Hybrid Scheduling (GA + PSO + Rules)           |
|    Conflict Detection, Rescheduling               |
+--------------------------------------------------+
|            AI Intelligence Layer                   |
|    LLM Processing (HuggingFace)                   |
|    OCR (Tesseract), Embeddings (FAISS)            |
+--------------------------------------------------+
|          Document Processing Layer                 |
|    PDF/DOC/Image Text Extraction                  |
|    Structured JSON Generation                      |
+--------------------------------------------------+
|               Data Layer                           |
|    MongoDB Atlas (Beanie ODM)                     |
+--------------------------------------------------+
```

## Data Flow

1. Admin uploads therapy protocol document (PDF/DOC/image)
2. Server extracts text (PyPDF2/python-docx/Tesseract OCR)
3. LLM (HuggingFace) converts text to structured JSON workflow
4. Embeddings generated (Sentence-Transformers) and stored in FAISS
5. Physician selects therapy for patient
6. Hybrid scheduler generates optimized session plan
7. Staff manages sessions via dashboard with real-time conflict detection
```

- [ ] **Step 5: Create docs/api.md**

Create `docs/api.md`:

```markdown
# API Reference

Base URL: `http://localhost:8000/api`

Auto-generated Swagger docs: `http://localhost:8000/docs`

## Authentication

All endpoints except `/auth/login` and `/health` require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

### POST /auth/login

Request: `{ "username": "email@example.com", "password": "..." }`

Response: `{ "token": "jwt...", "user": { "id", "name", "email", "role" } }`

## Patients

- `GET /patients/` - List all patients
- `GET /patients/:id` - Get patient by ID

## Therapies

- `GET /therapies/` - List therapy definitions with workflows
- `GET /therapies/:id` - Get single therapy

## Schedule

- `GET /schedule/` - List all sessions
- `POST /schedule/` - Create session (returns conflicts if detected)
- `PUT /schedule/:id` - Update session
- `DELETE /schedule/:id` - Delete session

## Documents

- `POST /documents/` - Upload document (multipart/form-data)
- `GET /documents/` - List documents
- `GET /documents/:id` - Get document with processing status
- `GET /documents/:id/status` - Check processing status
- `GET /documents/search?q=...` - Semantic search
- `DELETE /documents/:id` - Delete document

## Dashboard

- `GET /dashboard/kpis` - Key performance indicators
- `GET /dashboard/trends` - Session trends
- `GET /dashboard/availability` - Therapist/room status
- `GET /dashboard/alerts` - System alerts
- `GET /dashboard/notifications?role=` - Role-based notifications
```

- [ ] **Step 6: Create docs/deployment.md**

Create `docs/deployment.md`:

```markdown
# Deployment Guide

## Prerequisites

- MongoDB Atlas account (free M0 cluster)
- Vercel account (frontend)
- Render account (backend)
- HuggingFace account (optional, for LLM features)

## MongoDB Atlas Setup

1. Create free M0 cluster at mongodb.com/cloud/atlas
2. Create database user
3. Allow network access from anywhere (0.0.0.0/0)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ptas`

## Backend (Render)

1. Connect GitHub repo to Render
2. Set root directory: `server`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables (see server/.env.example)
6. Seed database: Run `python seed_data.py` via Render shell

## Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your Render backend URL

## Environment Variables Checklist

### Server (Render)
- [ ] MONGODB_URL
- [ ] JWT_SECRET (generate a secure random string)
- [ ] CORS_ORIGINS (include your Vercel frontend URL)
- [ ] HF_API_TOKEN (optional)

### Client (Vercel)
- [ ] VITE_API_URL (your Render backend URL + /api)
```

- [ ] **Step 7: Commit**

```bash
git add README.md client/README.md server/README.md docs/
git commit -m "docs: add project documentation and READMEs"
```

---

### Task 13: Final Verification and Push

**Files:** None (verification only)

- [ ] **Step 1: Verify project structure**

```bash
ls -la
ls client/
ls server/
ls docs/
ls .github/workflows/
```

Expected: Clean monorepo with `client/`, `server/`, `docs/`, `Makefile`, `.github/workflows/ci.yml`.

- [ ] **Step 2: Verify backend starts**

```bash
cd server && python -c "from app.main import app; print('OK:', app.title)"
```

- [ ] **Step 3: Verify frontend builds**

```bash
cd ../client && npm run build 2>&1 | tail -3
```

- [ ] **Step 4: Run backend tests**

```bash
cd ../server && python -m pytest tests/ -v
```

Expected: All tests pass.

- [ ] **Step 5: Push to dev**

```bash
cd ..
git push origin dev
```
