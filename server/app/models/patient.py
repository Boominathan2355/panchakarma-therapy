from typing import List, Literal
from beanie import Document
from pydantic import BaseModel


class PatientHistoryEntry(BaseModel):
    date: str
    type: Literal["Consultation", "Treatment", "Follow-up", "Lab Test", "Therapy Session"]
    notes: str


class PatientAvailability(BaseModel):
    start: str
    end: str


class Patient(Document):
    pid: str
    name: str
    age: int
    gender: Literal["Male", "Female", "Other"]
    email: str
    phone: str
    complaint: str
    conditions: List[str] = []
    history: List[PatientHistoryEntry] = []
    availability: List[PatientAvailability] = []

    class Settings:
        name = "patients"
