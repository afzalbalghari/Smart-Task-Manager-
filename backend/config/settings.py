from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "smart_task_manager"
    JWT_SECRET: str = "change_me_in_production"
    JWT_EXPIRE_HOURS: int = 24
    OPENAI_API_KEY: str = ""
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()