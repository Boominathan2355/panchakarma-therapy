from typing import Optional, Union, Literal
from beanie import Document


class ScheduleEntry(Document):
    sid: str
    title: str
    start: str
    end: str
    resourceId: str
    therapistId: Union[int, str]
    patientId: str
    type: str
    status: Literal["Scheduled", "Completed", "Cancelled", "In Progress"]
    statusUpdatedAt: Optional[str] = None

    class Settings:
        name = "schedule_entries"
