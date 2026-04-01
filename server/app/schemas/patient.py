from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class CreatePatient(BaseModel):
    id: str = Field(..., min_length=1, description="Unique patient ID")
    name: str = Field(..., min_length=1, max_length=200)
    age: int = Field(..., ge=0, le=120)
    gender: Literal["Male", "Female", "Other"]
    email: str = Field(..., min_length=3)
    phone: str = Field(..., min_length=5)
    complaint: str = Field(..., min_length=1)
    conditions: List[str] = []
    history: List[dict] = []
    availability: List[dict] = []


class UpdatePatient(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    complaint: Optional[str] = None
    conditions: Optional[List[str]] = None
