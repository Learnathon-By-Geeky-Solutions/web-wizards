from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
import tempfile
import os
import logging
import requests
from typing import Dict, Any
from io import BytesIO
from PIL import Image
from pdf2image import convert_from_bytes, convert_from_path
import pytesseract
from urllib.parse import urlparse

# Create router
router = APIRouter(tags=["extraction"])
logger = logging.getLogger(__name__)

# Constants
REQUEST_TIMEOUT = 360  # 3 minutes for downloading files
LARGE_FILE_THRESHOLD = 5_000_000  # 5MB threshold for large files

# Models
class ImageURLRequest(BaseModel):
    image_url: str

class PDFURLRequest(BaseModel):
    pdf_url: str

# URL Handler class - simplified for Cloudinary only
class URLHandler:
    @staticmethod
    def is_cloudinary_url(url):
        """Check if a URL is from Cloudinary."""
        parsed_url = urlparse(url)
        return 'cloudinary.com' in parsed_url.netloc

    @staticmethod
    def get_cloudinary_direct_url(url):
        """
        Get direct access URL for Cloudinary images.
        Add fl_attachment to prevent transformations that might affect OCR quality.
        """
        if '?' in url:
            return f"{url}&fl_attachment=true&fl_sanitize=true"
        else:
            return f"{url}?fl_attachment=true&fl_sanitize=true"

# OCR Processor class - simplified for Cloudinary only
class OCRProcessor:
    def __init__(self):
        self.url_handler = URLHandler()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def get_image_from_url(self, url):
        """Get image from Cloudinary URL."""
        logger.info("Processing Cloudinary URL")
        direct_url = URLHandler.get_cloudinary_direct_url(url)
        response = requests.get(direct_url, headers=self.headers, timeout=REQUEST_TIMEOUT)
        
        if response.status_code != 200:
            raise Exception(f"Failed to fetch image from URL: HTTP {response.status_code}")
        
        return Image.open(BytesIO(response.content))

    def extract_text_from_pdf_content(self, pdf_content: bytes) -> str:
        """Extract text from PDF content using Tesseract OCR."""
        try:
            # Check file size to determine processing strategy
            content_length = len(pdf_content)
            
            if content_length > LARGE_FILE_THRESHOLD:
                logger.info(f"Warning: Large PDF detected ({content_length/1_000_000:.2f}MB). Processing may take longer.")
                # For large files, process one page at a time to avoid memory issues
                from pdf2image import pdfinfo_from_bytes
                
                pdf_bytes = BytesIO(pdf_content)
                info = pdfinfo_from_bytes(pdf_bytes.getvalue())
                max_pages = info["Pages"]
                
                extracted_text = ""
                
                # Process each page individually to conserve memory
                for page in range(1, max_pages + 1):
                    logger.info(f"Processing page {page}/{max_pages}")
                    images = convert_from_bytes(
                        pdf_bytes.getvalue(),
                        first_page=page,
                        last_page=page
                    )
                    
                    if images:
                        text = pytesseract.image_to_string(images[0], config=r'--oem 3 --psm 6')
                        extracted_text += f"{text}\n"
            else:
                # For smaller files, process all at once
                images = convert_from_bytes(pdf_content)
                extracted_text = ""
                
                for img in images:
                    custom_config = r'--oem 3 --psm 6'
                    text = pytesseract.image_to_string(img, config=custom_config)
                    extracted_text += text + "\n"
                
            if extracted_text:
                logger.info(f"Extracted Text from PDF: {extracted_text[:100]}...")  # Log just a preview
                return extracted_text
            else:
                logger.warning("No text extracted from PDF.")
                return ""
        
        except Exception as e:
            logger.exception(f"Error processing PDF content: {e}")
            return ""

    def extract_text_from_url(self, url: str) -> str:
        """Extract text from a Cloudinary URL, handling both images and PDFs."""
        try:
            # Handle Cloudinary URL
            if not URLHandler.is_cloudinary_url(url):
                logger.warning("URL is not from Cloudinary, but processing anyway")
            
            logger.info("Processing Cloudinary URL")
            processed_url = URLHandler.get_cloudinary_direct_url(url)
            
            # Check if the file is large before downloading
            try:
                head_response = requests.head(processed_url, headers=self.headers, timeout=10)
                content_length = int(head_response.headers.get('content-length', 0))
                
                if content_length > LARGE_FILE_THRESHOLD:
                    logger.info(f"Warning: Large file detected ({content_length/1_000_000:.2f}MB). Processing may take longer.")
                    
            except Exception as e:
                logger.warning(f"Could not get content length: {e}")
            
            # Download the file from the provided URL
            response = requests.get(processed_url, headers=self.headers, timeout=REQUEST_TIMEOUT)
            if response.status_code != 200:
                raise Exception(f"Failed to fetch file from URL: HTTP {response.status_code}")
            
            content_type = response.headers.get('content-type', '').lower()
            
            # Determine if this is a PDF or image
            if 'pdf' in content_type or url.lower().endswith('.pdf'):
                # Process as PDF
                return self.extract_text_from_pdf_content(response.content)
            else:
                # Process as image
                try:
                    image = Image.open(BytesIO(response.content))
                    custom_config = r'--oem 3 --psm 6'
                    text = pytesseract.image_to_string(image, config=custom_config)
                    
                    if text:
                        logger.info(f"Extracted Text from image: {text[:100]}...")
                        return text
                    else:
                        logger.warning("No text extracted from image.")
                        return ""
                except Exception as e:
                    logger.exception(f"Error processing image: {e}")
                    # Try processing as PDF if image processing fails
                    return self.extract_text_from_pdf_content(response.content)
            
        except Exception as e:
            logger.exception(f"Error processing URL: {e}")
            return ""

# Create a singleton instance of the OCR processor
ocr_processor = OCRProcessor()

# API Endpoints
@router.post("/extract-text/")
async def extract_text_endpoint(request: ImageURLRequest):
    """
    Extract text from an image URL using OCR
    """
    try:
        # Verify it's a Cloudinary URL
        if not URLHandler.is_cloudinary_url(request.image_url):
            raise HTTPException(status_code=400, detail="Only Cloudinary URLs are supported")
            
        # Extract text from the image URL
        text = ocr_processor.extract_text_from_url(request.image_url)
        
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
        # Verify it's a Cloudinary URL
        if not URLHandler.is_cloudinary_url(request.pdf_url):
            raise HTTPException(status_code=400, detail="Only Cloudinary URLs are supported")
            
        # Check if the URL is accessible
        try:
            # Use direct Cloudinary URL
            pdf_url = URLHandler.get_cloudinary_direct_url(request.pdf_url)
            head_response = requests.head(pdf_url, timeout=10)
            if head_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"PDF URL not accessible: HTTP {head_response.status_code}")
        except requests.RequestException as e:
            raise HTTPException(status_code=400, detail=f"Error accessing PDF URL: {str(e)}")
        
        # Extract text from the PDF URL
        text = ocr_processor.extract_text_from_pdf_content(
            requests.get(pdf_url, timeout=REQUEST_TIMEOUT).content
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
            text = ocr_processor.extract_text_from_pdf_content(content)
            
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