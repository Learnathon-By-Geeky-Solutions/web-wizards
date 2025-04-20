from fastapi import APIRouter, HTTPException
import logging
from openai import OpenAIError, RateLimitError

from api.models.schemas import ProcessCloudinaryURLRequest, OCRResponse
from services.extraction.ocr import extract_text_from_url, structure_medical_data
from utils.ai_processor import process_text_with_ai_async
from core.config import settings

# Create router
router = APIRouter(tags=["ocr"])
logger = logging.getLogger(__name__)

# Cloudinary endpoint - the only one we need
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
        
        # Extract the raw text first using improved OCR functionality
        extracted_text = await extract_text_from_url(document_url)
        
        # Log the extracted text for debugging purposes
        logger.info(f"Text extraction successful, text length: {len(extracted_text) if extracted_text else 0}")
        logger.debug(f"Extracted text: {extracted_text[:500]}...")  # Log only first 500 chars
        
        # Check if we got a string (raw text) or structured data already
        if isinstance(extracted_text, str) and extracted_text:
            # Try AI processing first if enabled
            try:
                if settings.USE_AI_PROCESSING:
                    # Use the async version of the AI processing function
                    logger.info("Using AI processing for extracted text")
                    return await process_text_with_ai_async(extracted_text)
                else:
                    logger.info("Using rule-based processing for extracted text")
                    return await structure_medical_data(extracted_text)
            except (OpenAIError, RateLimitError) as e:
                # Specific handling for OpenAI errors
                logger.warning(f"OpenAI API error encountered: {str(e)}. Falling back to rule-based extraction.")
                return await structure_medical_data(extracted_text)
        elif isinstance(extracted_text, dict):
            # Already structured data
            logger.info("Using pre-structured data from extraction")
            return extracted_text
        else:
            # No text extracted or empty text
            raise HTTPException(
                status_code=422,
                detail="Failed to extract any text from the provided document URL"
            )
        
    except Exception as e:
        logger.exception(f"Error processing document from Cloudinary URL: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing document from Cloudinary URL: {str(e)}"
        )