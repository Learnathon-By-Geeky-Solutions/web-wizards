from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
import tempfile
import logging
import os
import shutil
from datetime import datetime
import requests

from api.models.schemas import ProcessURLRequest, ProcessCloudinaryURLRequest, ImageURLRequest, OCRResponse
from services.extraction.ocr import extract_text_from_pdf, process_image, extract_text_from_url, extract_text_from_document
from utils.pdf.validator import is_valid_pdf, safe_process_pdf
from utils.url_handler import is_url_pdf
from core.config import settings

# Create router
router = APIRouter(tags=["ocr"])
logger = logging.getLogger(__name__)

# Keep the original /process endpoint for backward compatibility with Django app
@router.post("/process", response_model=OCRResponse)
@safe_process_pdf
async def process_document(file: UploadFile = File(...)):
    """
    Process a PDF document and extract structured data
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Copy uploaded file to temporary file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # Process the PDF
            return await extract_text_from_pdf(temp_file_path)
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
    except Exception as e:
        logger.exception(f"Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

# Keep the original /process_url endpoint for backward compatibility with Django app
@router.post("/process_url", response_model=OCRResponse)
async def process_document_url(request: ProcessURLRequest):
    """
    Process a PDF document from URL and extract structured data
    """
    try:
        # Download the PDF
        response = requests.get(str(request.pdf_url))
        if response.status_code != 200:
            raise HTTPException(
                status_code=400, 
                detail=f"Failed to download PDF from URL: HTTP {response.status_code}"
            )
        
        # Validate PDF
        if not is_valid_pdf(response.content):
            raise HTTPException(status_code=400, detail="Invalid or corrupted PDF file")
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name
        
        try:
            # Process the PDF
            return await extract_text_from_pdf(temp_file_path)
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error processing document from URL: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing document from URL: {str(e)}"
        )

# New endpoint to handle any document type from Cloudinary (image or PDF)
@router.post("/process_cloudinary", response_model=OCRResponse)
async def process_cloudinary_document(request: ProcessCloudinaryURLRequest):
    """
    Process any document (PDF or image) from a Cloudinary URL and extract structured data.
    
    Automatically detects document type (PDF or image) and processes accordingly.
    Extracted text is processed through AI to structure medical test data.
    """
    try:
        document_url = str(request.document_url)
        logger.info(f"Processing document from Cloudinary URL: {document_url}")
        
        # Use the document processing function that automatically handles URLs
        result = await extract_text_from_document(document_url)
        return result
        
    except Exception as e:
        logger.exception(f"Error processing document from Cloudinary URL: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing document from Cloudinary URL: {str(e)}"
        )

# Image-specific endpoint
@router.post("/process_image", response_model=OCRResponse)
async def process_image_url(request: ImageURLRequest):
    """
    Extract text from an image URL and structure it as medical data
    """
    try:
        image_url = str(request.image_url)
        logger.info(f"Processing image from URL: {image_url}")
        
        # Extract text from image URL
        raw_text = await extract_text_from_url(image_url)
        
        # Use AI to structure the extracted text
        from utils.ai_processor import process_text_with_ai
        structured_data = process_text_with_ai(raw_text)
        
        return structured_data
        
    except Exception as e:
        logger.exception(f"Error processing image from URL: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing image from URL: {str(e)}"
        )