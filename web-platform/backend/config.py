"""Configuration settings for Luna Ice Mapper backend platform."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration settings loaded from environment or defaults."""

    PROJECT_NAME: str = "Luna Ice Mapper API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "FastAPI backend for 6U CubeSat water-ice mapping mission "
        "supporting NASA Artemis lunar south polar exploration."
    )
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api"

    # Database & Cache settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/luna_ice_db"
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
