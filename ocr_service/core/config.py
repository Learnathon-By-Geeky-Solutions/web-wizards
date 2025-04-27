import os
from typing import Dict, List

class Settings:
    """Application settings"""
    # App settings
    APP_NAME: str = "OCR Service"
    API_PREFIX: str = "/api"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Gemini settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.0-pro")
    
    # Service configuration
    USE_AI_PROCESSING: bool = os.getenv("USE_AI_PROCESSING", "True").lower() == "true"
    
    # Test type keywords for rule-based extraction
    TEST_TYPE_KEYWORDS: Dict[str, List[str]] = {
        "CBC": ["complete blood count", "cbc", "hemogram", "blood count", "hematology"],
        "Lipid Panel": ["lipid", "cholesterol", "triglycerides", "hdl", "ldl"],
        "Liver Function": ["liver function", "lft", "ast", "alt", "bilirubin", "hepatic"],
        "Kidney Function": ["kidney function", "renal function", "creatinine", "egfr", "urea", "bun"],
        "Thyroid": ["thyroid", "tsh", "t3", "t4", "thyroxine"],
        "Electrolytes": ["electrolytes", "sodium", "potassium", "chloride", "bicarbonate"],
        "Glucose": ["glucose", "blood sugar", "a1c", "hemoglobin a1c", "hba1c"],
        "Urinalysis": ["urinalysis", "urine analysis", "urine test"],
        "Coagulation": ["coagulation", "prothrombin", "pt", "inr", "ptt", "aptt"],
        "Cardiac": ["cardiac", "troponin", "ck-mb", "bnp", "nt-probnp"],
    }


# Create settings instance
settings = Settings()