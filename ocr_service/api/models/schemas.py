from pydantic import BaseModel, Field, AnyHttpUrl
from typing import Dict, List, Optional, Any
from datetime import datetime

class ProcessCloudinaryURLRequest(BaseModel):
    """Request model for processing a document (PDF or image) from Cloudinary URL"""
    document_url: AnyHttpUrl = Field(..., description="Cloudinary URL of the document to process")

class TestParameter(BaseModel):
    """Model for a single test parameter"""
    name: str
    value: str
    unit: Optional[str] = None
    normal_range: Optional[str] = None

class TestResult(BaseModel):
    """Model for a medical test result"""
    test_type: str
    parameters: Dict[str, Any]

class OCRResponse(BaseModel):
    """Response model for OCR processing"""
    test_date: Optional[datetime] = None
    lab_name: Optional[str] = "Unknown Lab"
    test_type: Optional[str] = None
    tests: Optional[List[TestResult]] = None
    # Legacy fields for backward compatibility
    cbc: Optional[Dict[str, Any]] = None
    ure: Optional[Dict[str, Any]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "test_date": "2025-04-15T00:00:00",
                "lab_name": "Metro Medical Laboratory",
                "test_type": "Multiple Tests",
                "tests": [
                    {
                        "test_type": "CBC",
                        "parameters": {
                            "wbc": {"value": "7.5", "unit": "10^9/L", "normal_range": "4.0-11.0"},
                            "rbc": {"value": "4.8", "unit": "10^12/L", "normal_range": "4.5-5.5"}
                        }
                    }
                ]
            }
        }