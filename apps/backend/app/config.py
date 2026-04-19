from pydantic_settings import BaseSettings
from pathlib import Path
from typing import List
import os


class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", 8000))
    MODEL_PATH: Path = Path(os.getenv("MODEL_PATH", "model/calories_model.joblib"))
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "*",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
