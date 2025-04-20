from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
import tempfile
import os
import logging
import services.ocr as ocr_service
from typing import Dict, Any
import requests

# Create router
router = APIRouter(tags=["extraction"])
logger = logging.getLogger(__name__)

# Models
class ImageURLRequest(BaseModel):
    image_url: str

class PDFURLRequest(BaseModel):
    pdf_url: str


@router.post("/extract-text/")
async def extract_text(request: ImageURLRequest):
    """
    Extract text from an image URL using OCR
    """
    try:
        # Extract text from the image URL
        text = ocr_service.extract_text_from_url(request.image_url)
        
        # Log success
        logger.info(f"Successfully extracted text from image URL, length: {len(text) if text else 0}")
        
        # If text extraction failed, raise an HTTP error
        if not text:
            raise HTTPException(status_code=400, detail="Text extraction failed")
        
        return {"extracted_text": text}
    
    except Exception as e:
        logger.exception(f"Error extracting text from image URL: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )


@router.post("/extract-text-from-pdf/")
async def extract_text_from_pdf_endpoint(request: PDFURLRequest):
    """
    Extract text from a PDF URL using OCR
    """
    try:
        # Check if the URL is accessible
        try:
            head_response = requests.head(request.pdf_url, timeout=10)
            if head_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"PDF URL not accessible: HTTP {head_response.status_code}")
        except requests.RequestException as e:
            raise HTTPException(status_code=400, detail=f"Error accessing PDF URL: {str(e)}")
        
        # Extract text from the PDF URL
        text = ocr_service.extract_text_from_pdf_content(
            requests.get(request.pdf_url, timeout=ocr_service.REQUEST_TIMEOUT).content
        )
        
        # Log success
        logger.info(f"Successfully extracted text from PDF URL, length: {len(text) if text else 0}")
        
        # If text extraction failed, raise an HTTP error
        if not text:
            raise HTTPException(status_code=400, detail="PDF text extraction failed")
        
        return {"extracted_text": text}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error extracting text from PDF URL: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing PDF: {str(e)}"
        )


@router.post("/extract-text-from-uploaded-pdf/")
async def extract_text_from_uploaded_pdf(file: UploadFile = File(...)):
    """
    Extract text from an uploaded PDF file using OCR
    """
    try:
        # Validate the file
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Save the file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Read and write in chunks to handle large files
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        try:
            # Process the PDF file
            text = ocr_service.extract_text_from_pdf_content(content)
            
            # Log success
            logger.info(f"Successfully extracted text from uploaded PDF, length: {len(text) if text else 0}")
            
            # If text extraction failed, raise an HTTP error
            if not text:
                raise HTTPException(status_code=400, detail="PDF text extraction failed")
            
            return {"extracted_text": text}
        
        finally:
            # Ensure the temporary file is deleted
            try:
                os.unlink(temp_path)
            except Exception as e:
                logger.warning(f"Failed to delete temporary file: {str(e)}")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error extracting text from uploaded PDF: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing uploaded PDF: {str(e)}"
        )