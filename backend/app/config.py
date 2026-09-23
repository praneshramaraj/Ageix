import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AEGISX (ResQLink v2) Disaster Management Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # JWT & Auth
    SECRET_KEY: str = "AEGISX_RESQ_LINK_V2_SUPER_SECRET_KEY_2026_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # PostgreSQL & PostGIS
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "aegisx_db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis & TileServer
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    TILESERVER_URL: str = os.getenv("TILESERVER_URL", "http://localhost:8080")
    VALHALLA_URL: str = os.getenv("VALHALLA_URL", "http://localhost:8002")

    class Config:
        case_sensitive = True

settings = Settings()
