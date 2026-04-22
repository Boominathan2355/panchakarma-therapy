# PTAS Server

FastAPI backend for the Panchakarma Therapy Automation System.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URL
./.venv/bin/python seed_data.py
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000
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

API docs: `http://localhost:8000/docs`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| MONGODB_URL | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing key |
| HF_API_TOKEN | No | HuggingFace API token for LLM |
| HF_MODEL_ID | No | LLM model ID |
| CORS_ORIGINS | No | Allowed CORS origins |
| UPLOAD_DIR | No | File upload directory |
| LOG_LEVEL | No | Logging level (default: INFO) |

## Testing

```bash
python -m pytest tests/ -v
```
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000