from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    OPENAI_API_KEY: str
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ielts_tutor"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton instance
settings = Settings()

