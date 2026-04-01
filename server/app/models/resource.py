from typing import List, Union, Literal
from beanie import Document


Weekday = Literal["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
ResourceStatus = Literal["Available", "Busy", "On Leave"]


class Therapist(Document):
    thid: str
    name: str
    status: ResourceStatus
    specialty: str
    role: Literal["Senior Therapist", "Therapist", "Junior Therapist"]
    skills: List[str] = []
    shifts: List[Weekday] = []

    class Settings:
        name = "therapists"


class Room(Document):
    rid: str
    name: str
    capacity: int
    facilities: List[str] = []
    status: ResourceStatus

    class Settings:
        name = "rooms"


class Material(Document):
    mid: str
    name: str
    quantity: int
    unit: str
    lowStockThreshold: int

    class Settings:
        name = "materials"
