from typing import List, Optional, Literal, Union
from beanie import Document
from pydantic import BaseModel


class RequiredMaterial(BaseModel):
    name: str
    quantity: Union[str, int]
    unit: str


class TherapyWorkflowStep(BaseModel):
    id: str
    step: int
    action: str
    duration: str
    notes: str
    requiredMaterials: Optional[List[RequiredMaterial]] = None
    precautions: Optional[List[str]] = None


class TherapyDocument(BaseModel):
    id: str
    name: str
    size: str
    uploadDate: str


class TherapyDefinition(Document):
    tid: str
    name: Literal["Vamana", "Virechana", "Basti", "Nasya", "Raktamokshana"]
    description: str
    workflow: List[TherapyWorkflowStep] = []
    contraindications: List[str] = []
    safetyNotes: str = ""
    documents: List[TherapyDocument] = []

    class Settings:
        name = "therapies"
