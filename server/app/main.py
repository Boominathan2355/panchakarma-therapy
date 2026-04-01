from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, close_db
from app.routes import auth, patients, therapies, therapy_plans, therapists, resources, schedule, audit, documents, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="Panchakarma Therapy Automation System",
    description="Backend API for PTAS - IEEE Conference Paper Implementation",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
