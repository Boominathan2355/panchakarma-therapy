from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.therapy_plan import TherapyPlanDefinition
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/therapy-plans", tags=["Therapy Plans"])


def plan_to_dict(p: TherapyPlanDefinition) -> dict:
    return {
        "id": p.tpid,
        "name": p.name,
        "description": p.description,
        "duration": p.duration,
        "totalSessions": p.totalSessions,
        "difficulty": p.difficulty,
        "status": p.status,
        "therapySequence": [s.model_dump() for s in p.therapySequence],
        "assignedPatients": p.assignedPatients,
        "createdDate": p.createdDate,
        "tags": p.tags,
    }


@router.get("/", response_model=List[dict])
async def list_therapy_plans(user=Depends(get_current_user)):
    plans = await TherapyPlanDefinition.find_all().to_list()
    return [plan_to_dict(p) for p in plans]


@router.get("/{plan_id}")
async def get_therapy_plan(plan_id: str, user=Depends(get_current_user)):
    plan = await TherapyPlanDefinition.find_one(TherapyPlanDefinition.tpid == plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Therapy plan not found")
    return plan_to_dict(plan)
