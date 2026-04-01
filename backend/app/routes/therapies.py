from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.therapy import TherapyDefinition
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/therapies", tags=["Therapies"])


def therapy_to_dict(t: TherapyDefinition) -> dict:
    return {
        "id": t.tid,
        "name": t.name,
        "description": t.description,
        "workflow": [
            {
                "id": step.id,
                "step": step.step,
                "action": step.action,
                "duration": step.duration,
                "notes": step.notes,
                "requiredMaterials": [m.model_dump() for m in (step.requiredMaterials or [])],
                "precautions": step.precautions or [],
            }
            for step in t.workflow
        ],
        "contraindications": t.contraindications,
        "safetyNotes": t.safetyNotes,
        "documents": [d.model_dump() for d in t.documents],
    }


@router.get("/", response_model=List[dict])
async def list_therapies(user=Depends(get_current_user)):
    therapies = await TherapyDefinition.find_all().to_list()
    return [therapy_to_dict(t) for t in therapies]


@router.get("/{therapy_id}")
async def get_therapy(therapy_id: str, user=Depends(get_current_user)):
    therapy = await TherapyDefinition.find_one(TherapyDefinition.tid == therapy_id)
    if not therapy:
        raise HTTPException(status_code=404, detail="Therapy not found")
    return therapy_to_dict(therapy)
