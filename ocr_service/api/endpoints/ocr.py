from fastapi import APIRouter, HTTPException
import logging
import json

from api.models.schemas import DocumentURLRequest, OCRResponse
from api.endpoints.extraction import ocr_processor, URLHandler
from utils.ai_processor import ai_processor
from core.config import settings

# Create router
router = APIRouter(tags=["ocr"])
logger = logging.getLogger(__name__)

@router.post("/process_document", response_model=OCRResponse)
async def process_document(request: DocumentURLRequest):
    """
    Process any document (PDF or image) from a URL and extract structured data.
    
    Automatically detects document type (PDF or image) and processes accordingly.
    Extracted text is processed through AI to structure medical test data.
    
    Currently supports Cloudinary URLs only.
    """
    try:
        document_url = str(request.document_url)
        logger.info(f"Processing document from URL: {document_url}")
        
        # Verify it's a Cloudinary URL (this validation can be modified or removed for other URL sources)
        if not URLHandler.is_cloudinary_url(document_url):
            raise HTTPException(
                status_code=400,
                detail="Only Cloudinary URLs are supported"
            )
        
        # Extract the raw text first using OCR functionality
        extracted_text = ocr_processor.extract_text_from_url(document_url)
        
        # Log the extracted text for debugging purposes
        logger.info(f"Text extraction successful, text length: {len(extracted_text) if extracted_text else 0}")
        logger.debug(f"Extracted text: {extracted_text[:500]}...")  # Log only first 500 chars
        
        # Check if we got a string (raw text) or structured data already
        if isinstance(extracted_text, str) and extracted_text:
            # Try AI processing if enabled
            if settings.USE_AI_PROCESSING:
                # Use the async version of the AI processing function
                logger.info("Using AI processing for extracted text")
                structured_data = await ai_processor.process_text_with_ai_async(extracted_text)
                
                # Add raw text to the response
                structured_data["raw_text"] = extracted_text
                return structured_data
            else:
                logger.info("Using rule-based processing for extracted text")
                structured_data = await ai_processor.structure_medical_data(extracted_text)
                
                # Add raw text to the response
                structured_data["raw_text"] = extracted_text
                return structured_data
                
        elif isinstance(extracted_text, dict):
            # Already structured data
            logger.info("Using pre-structured data from extraction")
            # Try to add raw text if possible
            extracted_text["raw_text"] = "Pre-structured data - no raw text available"
            return extracted_text
        else:
            # No text extracted or empty text
            raise HTTPException(
                status_code=422,
                detail="Failed to extract any text from the provided document URL"
            )
        
    except Exception as e:
        logger.exception(f"Error processing document: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing document: {str(e)}"
        )

# Add backward compatibility with previous endpoint for existing integrations
@router.post("/process_cloudinary", response_model=OCRResponse)
async def process_cloudinary_document(request: DocumentURLRequest):
    """
    Legacy endpoint for Cloudinary document processing.
    Redirects to the more generic process_document endpoint.
    """
    return await process_document(request)