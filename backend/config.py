from typing import List, Optional, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application Configuration Management.
    Loads variables from environment or .env file.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="allow"
    )

    # --- CORE APP INFO ---
    APP_NAME: str = "SULAM Volunteerism API"
    VERSION: str = "1.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # --- NETWORK / SERVER ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security: Allowed Origins (Vercel + Local)
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173", 
        "http://localhost:3000",
        "https://umissionweb.vercel.app",
        "https://umissionweb-git-main-chaziyu.vercel.app"
    ]

    # --- EXTERNAL INFRASTRUCTURE ---
    # Supabase Connection (Transaction Pooler Recommendation: Port 6543)
    DATABASE_URL: Optional[str] = None
    
    # Clerk Auth (Issuer URL from Clerk Dashboard)
    CLERK_ISSUER: Optional[str] = None

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parsed comma-separated CORS string into a list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @field_validator("CLERK_ISSUER", mode="before")
    @classmethod
    def clean_issuer_url(cls, v: Optional[str]) -> Optional[str]:
        """Ensures the issuer URL has no trailing slash (prevents JWKS fetch errors)."""
        if v and isinstance(v, str):
            return v.rstrip("/")
        return v

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_protocol(cls, v: Optional[str]) -> Optional[str]:
        """Ensures SQLAlchemy compatibility by forcing 'postgresql://' protocol."""
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v
    
settings = Settings()