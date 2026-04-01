from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings
from app.database import init_db, close_db
from app.routes import auth, patients, therapies, therapy_plans, therapists, resources, schedule, audit, documents, dashboard
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)
from app.utils.logging import setup_logging, RequestLoggingMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


setup_logging(settings.LOG_LEVEL)

app = FastAPI(
    title="Panchakarma Therapy Automation System",
    description="Backend API for PTAS - IEEE Conference Paper Implementation",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Register all routers under /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(therapies.router, prefix="/api")
app.include_router(therapy_plans.router, prefix="/api")
app.include_router(therapists.router, prefix="/api")
app.include_router(resources.router, prefix="/api")
app.include_router(schedule.router, prefix="/api")
app.include_router(audit.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "Panchakarma Therapy Automation System",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
