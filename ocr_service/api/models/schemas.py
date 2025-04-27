from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class ImageURLRequest(BaseModel):
    """Request model for processing an image URL"""
    image_url: str

class PDFURLRequest(BaseModel):
    """Request model for processing a PDF URL"""
    pdf_url: str

class DocumentURLRequest(BaseModel):
    """Request model for processing any document (image or PDF) from a URL"""
    document_url: str

# Keep for backward compatibility
ProcessCloudinaryURLRequest = DocumentURLRequest

class ExtractedTextResponse(BaseModel):
    """Response model for extracted raw text"""
    extracted_text: str

class OCRResponse(BaseModel):
    """Response model for processed OCR data in structured format"""
    test_date: Optional[str] = None
    lab_name: Optional[str] = None
    test_type: Optional[str] = None
    tests: List[Dict[str, Any]] = []
    raw_text: Optional[str] = None  # Added field to include the raw extracted text