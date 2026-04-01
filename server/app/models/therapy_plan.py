from typing import List, Optional, Literal
from beanie import Document
from pydantic import BaseModel


class TherapySequenceItem(BaseModel):
    id: str
    therapyId: Optional[str] = None
    therapyName: str
    day: str
    sessions: int
    notes: str
    status: Literal["completed", "in-progress", "pending"]


class TherapyPlanDefinition(Document):
    tpid: str
    name: str
    description: str
    duration: str
    totalSessions: int
    difficulty: Literal["Beginner", "Moderate", "Advanced"]
    status: Literal["Active", "Draft", "Archived"]
    therapySequence: List[TherapySequenceItem] = []
    assignedPatients: int = 0
    createdDate: str = ""
    tags: List[str] = []

    class Settings:
        name = "therapy_plans"
