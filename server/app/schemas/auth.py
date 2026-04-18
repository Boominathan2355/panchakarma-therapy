from pydantic import BaseModel


from typing import Optional


class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str


class AuthResponse(BaseModel):
    token: str
    refresh_token: str
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    token: str
    refresh_token: str
