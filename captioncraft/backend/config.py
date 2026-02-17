"""Configuration settings for CaptionCraft backend."""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Server
    port: int = 8080
    host: str = "0.0.0.0"
    debug: bool = False
    
    # AssemblyAI
    assemblyai_api_key: str = ""
    
    # Sarvam AI (for Hinglish transcription)
    sarvam_api_key: str = ""
    
    # Anthropic (for Hinglish transliteration)
    anthropic_api_key: str = ""
    
    # Cloudflare R2
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "captioncraft"
    r2_public_url: str = ""
    
    # Processing
    max_file_size_mb: int = 100
    temp_dir: str = "temp"
    output_dir: str = "output"
    fonts_dir: str = "fonts"
    cleanup_after_hours: int = 24
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
