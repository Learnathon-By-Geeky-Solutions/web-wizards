import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    APP_NAME: str = "Medical Document OCR Service"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"
    
    # AI integration settings
    OPENAI_API_KEY: str = ""  # Set from environment variable
    USE_AI_PROCESSING: bool = True  # Whether to use AI for processing extracted text
    AI_MODEL: str = "gpt-3.5-turbo"  # Default model to use
    
    # Dictionary of test type keywords for mapping
    TEST_TYPE_KEYWORDS = {
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

# Create settings instance
settings = Settings()