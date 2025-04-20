import os
from pydantic_settings import BaseSettings
from typing import ClassVar, Dict  # Add this import

class Settings(BaseSettings):
    """Application settings"""
    APP_NAME: str = "Medical Document OCR Service"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"
    
    # AI integration settings
    OPENAI_API_KEY: str = ""  # Set from environment variable
    GEMINI_API_KEY: str = ""  # Set from environment variable for Google's Gemini AI
    USE_AI_PROCESSING: bool = True  # Whether to use AI for processing extracted text
    AI_MODEL: str = "gpt-3.5-turbo"  # Default OpenAI model
    GEMINI_MODEL: str = "gemini-2.0-flash"  # Default Gemini model
    AI_PROVIDER: str = "gemini"  # Options: "openai", "gemini"
    
    # Cloudinary settings
    CLOUDINARY_CLOUD_NAME: str = ""  # Set from environment variable
    CLOUDINARY_API_KEY: str = ""     # Set from environment variable
    CLOUDINARY_API_SECRET: str = ""  # Set from environment variable
    CLOUDINARY_SECURE: bool = True   # Use HTTPS by default
    
    # Dictionary of test type keywords for mapping
    # Added ClassVar annotation to fix Pydantic v2 error
    TEST_TYPE_KEYWORDS: ClassVar[Dict[str, str]] = {
        "complete blood count": "CBC",
        "cbc": "CBC",
        "hemogram": "CBC",
        "blood count": "CBC",
        "urea and electrolytes": "URE",
        "u&e": "URE",
        "electrolytes": "URE",
        "kidney function": "URE",
        "renal function": "URE",
        "liver function": "LFT",
        "lft": "LFT",
        "hepatic function": "LFT",
        "lipid profile": "LIPID",
        "cholesterol": "LIPID",
        "thyroid function": "TFT",
        "tft": "TFT",
        "glucose": "GLUCOSE",
        "hba1c": "GLUCOSE",
        "blood sugar": "GLUCOSE",
        "coagulation": "COAG",
        "iron studies": "IRON",
        "ferritin": "IRON"
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Add this to ignore extra fields in environment variables

# Create settings instance
settings = Settings()