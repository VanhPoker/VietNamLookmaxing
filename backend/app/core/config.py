"""
Configuration settings for Project Adam Backend
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Literal


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Keys
    anthropic_api_key: str = ""
    google_api_key: str = ""
    
    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # LLM Provider
    llm_provider: Literal["claude", "gemini"] = "gemini"
    
    # CORS Settings
    frontend_url: str = "http://localhost:3000"
    
    # Model Settings - Best value choices
    claude_model: str = "claude-3-5-sonnet-20241022"  # If using Anthropic
    gemini_model: str = "gemini-1.5-pro"  # Best quality for GCP credits ($300 = ~100K requests)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
