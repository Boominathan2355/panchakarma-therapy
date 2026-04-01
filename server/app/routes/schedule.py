from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
from app.models.schedule import ScheduleEntry
from app.middleware.auth import get_current_user
from app.services.audit_service import log_action
import uuid

router = APIRouter(prefix="/schedule", tags=["Schedule"])


def entry_to_dict(e: ScheduleEntry) -> dict:
    return {
        "id": e.sid,
        "title": e.title,
        "start": e.start,
        "end": e.end,
        "resourceId": e.resourceId,
        "therapistId": e.therapistId,
        "patientId": e.patientId,
        "type": e.type,
        "status": e.status,
        "statusUpdatedAt": e.statusUpdatedAt,
    }


async def detect_conflicts(entry_data: dict, exclude_id: str = None) -> List[dict]:
    """Check for scheduling conflicts with existing entries."""
    conflicts = []
    start = entry_data.get("start")
    end = entry_data.get("end")
    resource_id = entry_data.get("resourceId")
    therapist_id = entry_data.get("therapistId")

    if not start or not end:
        return conflicts

    query_filter = {
        "status": {"$ne": "Cancelled"},
        "$or": [
            {"start": {"$lt": end, "$gte": start}},
            {"end": {"$gt": start, "$lte": end}},
            {"start": {"$lte": start}, "end": {"$gte": end}},
        ],
    }

    existing = await ScheduleEntry.find(query_filter).to_list()

    for e in existing:
        if exclude_id and e.sid == exclude_id:
            continue
        if resource_id and e.resourceId == resource_id:
            conflicts.append({
                "existingEntry": entry_to_dict(e),
                "reason": f"Room conflict: {resource_id} already booked",
            })
        if therapist_id and str(e.therapistId) == str(therapist_id):
            conflicts.append({
                "existingEntry": entry_to_dict(e),
                "reason": f"Therapist conflict: therapist {therapist_id} already assigned",
            })

    return conflicts


@router.get("/", response_model=List[dict])
async def list_sessions(user=Depends(get_current_user)):
    entries = await ScheduleEntry.find_all().to_list()
    return [entry_to_dict(e) for e in entries]


@router.get("/{entry_id}")
async def get_session(entry_id: str, user=Depends(get_current_user)):
    entry = await ScheduleEntry.find_one(ScheduleEntry.sid == entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    return entry_to_dict(entry)


@router.post("/")
async def create_session(data: dict, user=Depends(get_current_user)):
    if "id" in data:
        data["sid"] = data.pop("id")
    if "sid" not in data:
        data["sid"] = f"s-{uuid.uuid4().hex[:8]}"

    conflicts = await detect_conflicts(data)
    if conflicts:
        return {
            "success": False,
            "conflicts": conflicts,
            "message": "Scheduling conflicts detected",
        }

    entry = ScheduleEntry(**data)
    await entry.insert()

    await log_action(
        user_name=user.name,
        action="SCHEDULE",
        entity="Schedule",
        entity_id=entry.sid,
        details=f"Created session: {entry.title}",
    )

    return entry_to_dict(entry)


@router.put("/{entry_id}")
async def update_session(entry_id: str, data: dict, user=Depends(get_current_user)):
    entry = await ScheduleEntry.find_one(ScheduleEntry.sid == entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")

    if "start" in data or "end" in data or "resourceId" in data or "therapistId" in data:
        check_data = entry_to_dict(entry)
        check_data.update(data)
        conflicts = await detect_conflicts(check_data, exclude_id=entry_id)
        if conflicts:
            return {
                "success": False,
                "conflicts": conflicts,
                "message": "Scheduling conflicts detected",
            }

    for key, value in data.items():
        if key == "id":
            continue
        if key == "status":
            entry.status = value
            entry.statusUpdatedAt = datetime.now(timezone.utc).isoformat()
        elif hasattr(entry, key):
            setattr(entry, key, value)

    await entry.save()

    await log_action(
        user_name=user.name,
        action="UPDATE",
        entity="Schedule",
        entity_id=entry.sid,
        details=f"Updated session: {entry.title}",
    )

    return entry_to_dict(entry)


@router.delete("/{entry_id}")
async def delete_session(entry_id: str, user=Depends(get_current_user)):
    entry = await ScheduleEntry.find_one(ScheduleEntry.sid == entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Schedule entry not found")

    await entry.delete()

    await log_action(
        user_name=user.name,
        action="DELETE",
        entity="Schedule",
        entity_id=entry_id,
        details=f"Deleted session: {entry.title}",
    )

    return {"success": True, "message": "Session deleted"}
