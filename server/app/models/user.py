from typing import Literal
from beanie import Document


class User(Document):
    uid: str
    name: str
    email: str
    username: str
    password_hash: str
    role: Literal["Admin", "Physician", "Therapist", "Staff"]

    class Settings:
        name = "users"
        indexes = ["email", "username"]
