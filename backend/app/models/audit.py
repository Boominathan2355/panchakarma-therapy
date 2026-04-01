from typing import Optional, Union
from beanie import Document


class AuditLog(Document):
    aid: str
    userId: Optional[int] = None
    userName: Optional[str] = None
    action: str
    entity: Optional[str] = None
    entityId: Optional[Union[str, int]] = None
    details: Optional[str] = None
    timestamp: str
    ipAddress: Optional[str] = None

    class Settings:
        name = "audit_logs"
