"""Application-wide configuration.

Centralizing settings here means every layer (API, services, infrastructure)
reads config from one place instead of scattering os.environ calls around
the codebase.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Physiofit Clinical API"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"

    # Comma-separated list of origins allowed to call this API from the browser.
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        env_prefix = "PHYSIOFIT_"


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor so we parse env vars once per process."""
    return Settings()
