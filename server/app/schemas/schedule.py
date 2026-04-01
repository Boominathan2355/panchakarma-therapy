from typing import Optional, Union, Literal
from pydantic import BaseModel, Field


class CreateScheduleEntry(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=1)
    start: str = Field(..., description="ISO datetime string")
    end: str = Field(..., description="ISO datetime string")
    resourceId: str = Field(..., min_length=1)
    therapistId: Union[int, str]
    patientId: str = Field(..., min_length=1)
    type: str = Field(..., min_length=1)
    status: Literal["Scheduled", "Completed", "Cancelled", "In Progress"] = "Scheduled"


class UpdateScheduleEntry(BaseModel):
    title: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    resourceId: Optional[str] = None
    therapistId: Optional[Union[int, str]] = None
    patientId: Optional[str] = None
    type: Optional[str] = None
    status: Optional[Literal["Scheduled", "Completed", "Cancelled", "In Progress"]] = None
