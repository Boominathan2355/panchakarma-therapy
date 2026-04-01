from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.resource import Therapist
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/therapists", tags=["Therapists"])


def therapist_to_dict(t: Therapist) -> dict:
    return {
        "id": t.thid,
        "name": t.name,
        "status": t.status,
        "specialty": t.specialty,
        "role": t.role,
        "skills": t.skills,
        "shifts": t.shifts,
    }


@router.get("/", response_model=List[dict])
async def list_therapists(user=Depends(get_current_user)):
    therapists = await Therapist.find_all().to_list()
    return [therapist_to_dict(t) for t in therapists]


@router.get("/{therapist_id}")
async def get_therapist(therapist_id: str, user=Depends(get_current_user)):
    therapist = await Therapist.find_one(Therapist.thid == therapist_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return therapist_to_dict(therapist)


@router.put("/{therapist_id}")
async def update_therapist(therapist_id: str, data: dict, user=Depends(get_current_user)):
    therapist = await Therapist.find_one(Therapist.thid == therapist_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    for key, value in data.items():
        if key == "id":
            continue
        if hasattr(therapist, key):
            setattr(therapist, key, value)
    await therapist.save()
    return therapist_to_dict(therapist)
