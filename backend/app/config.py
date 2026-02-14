from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "cultivate365-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:////tmp/cultivate365.db"
    WEATHER_API_KEY: str = "9d7cde1f6d07ec55650544be1631307e"
    GEMINI_API_KEY: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
