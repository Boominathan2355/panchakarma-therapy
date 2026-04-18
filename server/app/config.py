from pydantic_settings import BaseSettings
from typing import List
import secrets


def generate_jwt_secret() -> str:
    return secrets.token_urlsafe(32)


class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017/ptas"
    JWT_SECRET: str = generate_jwt_secret()
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 480
    REFRESH_TOKEN_SECRET: str = generate_jwt_secret()
    REFRESH_TOKEN_EXPIRATION_DAYS: int = 7
    HF_API_TOKEN: str = ""
    HF_MODEL_ID: str = "mistralai/Mistral-7B-Instruct-v0.3"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"
    UPLOAD_DIR: str = "./uploads"
    LOG_LEVEL: str = "INFO"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
