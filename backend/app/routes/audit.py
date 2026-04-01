from fastapi import APIRouter, Depends
from typing import List
from app.models.audit import AuditLog
from app.middleware.auth import get_current_user
from app.services.audit_service import log_action

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/", response_model=List[dict])
async def list_audit_logs(user=Depends(get_current_user)):
    logs = await AuditLog.find_all().sort("-timestamp").to_list()
    return [
        {
            "id": log.aid,
            "userId": log.userId,
            "userName": log.userName,
            "action": log.action,
            "entity": log.entity,
            "entityId": log.entityId,
            "details": log.details,
            "timestamp": log.timestamp,
            "ipAddress": log.ipAddress,
        }
        for log in logs
    ]


@router.post("/")
async def create_audit_log(data: dict, user=Depends(get_current_user)):
    result = await log_action(
        user_id=data.get("userId"),
        user_name=data.get("userName"),
        action=data.get("action", "VIEW"),
        entity=data.get("entity"),
        entity_id=data.get("entityId"),
        details=data.get("details"),
        ip_address=data.get("ipAddress"),
    )
    return {"id": result.aid, "message": "Audit log created"}
