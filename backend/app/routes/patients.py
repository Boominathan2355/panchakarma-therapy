from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.patient import Patient
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("/", response_model=List[dict])
async def list_patients(user=Depends(get_current_user)):
    patients = await Patient.find_all().to_list()
    return [
        {
            "id": p.pid,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "email": p.email,
            "phone": p.phone,
            "complaint": p.complaint,
            "conditions": p.conditions,
            "history": [h.model_dump() for h in p.history],
            "availability": [a.model_dump() for a in p.availability],
        }
        for p in patients
    ]


@router.get("/{patient_id}")
async def get_patient(patient_id: str, user=Depends(get_current_user)):
    patient = await Patient.find_one(Patient.pid == patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "id": patient.pid,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "email": patient.email,
        "phone": patient.phone,
        "complaint": patient.complaint,
        "conditions": patient.conditions,
        "history": [h.model_dump() for h in patient.history],
        "availability": [a.model_dump() for a in patient.availability],
    }


@router.post("/")
async def create_patient(data: dict, user=Depends(get_current_user)):
    patient = Patient(**data)
    await patient.insert()
    return {"id": patient.pid, "name": patient.name}


@router.put("/{patient_id}")
async def update_patient(patient_id: str, data: dict, user=Depends(get_current_user)):
    patient = await Patient.find_one(Patient.pid == patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, value in data.items():
        if hasattr(patient, key):
            setattr(patient, key, value)
    await patient.save()
    return {"id": patient.pid, "message": "Patient updated"}
