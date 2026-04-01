from datetime import datetime, timezone
from app.models.audit import AuditLog
import uuid


async def log_action(
    user_id: int = None,
    user_name: str = None,
    action: str = "VIEW",
    entity: str = None,
    entity_id: str = None,
    details: str = None,
    ip_address: str = None,
):
    log = AuditLog(
        aid=f"audit-{uuid.uuid4().hex[:8]}",
        userId=user_id,
        userName=user_name,
        action=action,
        entity=entity,
        entityId=entity_id,
        details=details,
        timestamp=datetime.now(timezone.utc).isoformat(),
        ipAddress=ip_address,
    )
    await log.insert()
    return log
