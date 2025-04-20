import pytesseract
from PIL import Image, ImageFilter
import requests
from io import BytesIO
import os
import tempfile
from pdf2image import convert_from_bytes, convert_from_path
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Constants for timeout and file size thresholds
REQUEST_TIMEOUT = 360  # 6 minutes for downloading files
LARGE_FILE_THRESHOLD = 5_000_000  # 5MB

def preprocess_image(image: Image) -> Image:
    """Preprocess the image for better OCR accuracy."""
    try:
        # Convert to grayscale
        gray_image = image.convert('L')
        
        # Apply thresholding to enhance text visibility
        binary_image = gray_image.point(lambda p: p > 128 and 255)
        
        # Apply multiple filters for better noise removal
        filtered_image = binary_image.filter(ImageFilter.MedianFilter())
        
        # Apply additional enhancement if needed for certain image types
        if image.size[0] > 1000:  # For larger images
            filtered_image = filtered_image.filter(ImageFilter.SHARPEN)
            
        return filtered_image
    except Exception as e:
        logger.exception(f"Error in image preprocessing: {e}")
        # Return original image if preprocessing fails
        return image

def extract_text_from_url(image_url: str) -> str:
    """Fetch image from URL and extract text using Tesseract OCR."""
    try:
        # Check URL response headers to determine file size
        head_response = requests.head(image_url, timeout=10)
        content_length = int(head_response.headers.get('content-length', 0))
        
        if content_length > LARGE_FILE_THRESHOLD:
            logger.info(f"Large file detected ({content_length/1_000_000:.2f}MB). Using optimized processing.")
        
        # Download the content with increased timeout
        response = requests.get(image_url, timeout=REQUEST_TIMEOUT)
        if response.status_code != 200:
            logger.error(f"Failed to fetch image from URL: HTTP {response.status_code}")
            return None
        
        # Detect if the content is a PDF
        content_type = response.headers.get('content-type', '')
        is_pdf = content_type.lower().endswith('pdf') or image_url.lower().endswith('.pdf')
        
        if is_pdf:
            return extract_text_from_pdf_content(response.content)
        else:
            # Process as image
            image = Image.open(BytesIO(response.content))
            preprocessed_image = preprocess_image(image)
            custom_config = r'--oem 3 --psm 6'  # Configuration for standard text
            text = pytesseract.image_to_string(preprocessed_image, config=custom_config)
            logger.info(f"Successfully extracted text from image")
            return text
            
    except Exception as e:
        logger.exception(f"Error processing image URL: {e}")
        return None

def extract_text_from_pdf_content(pdf_content: bytes) -> str:
    """Extract text from PDF content using Tesseract OCR with memory optimization."""
    try:
        # Save PDF content to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_content)
            temp_path = temp_file.name
        
        try:
            # Get page count for processing strategy
            from pdf2image import pdfinfo_from_path
            info = pdfinfo_from_path(temp_path)
            max_pages = info["Pages"]
            file_size = os.path.getsize(temp_path)
            
            logger.info(f"Processing PDF with {max_pages} page(s) and size {file_size/1_000_000:.2f}MB")
            
            # Set DPI based on file size
            dpi = 150  # Lower DPI for faster processing
            extracted_text = ""
            
            # Process based on file size and page count
            if file_size > LARGE_FILE_THRESHOLD:
                # Process each page individually to conserve memory
                for page in range(1, max_pages + 1):
                    logger.info(f"Processing page {page}/{max_pages}")
                    images = convert_from_path(
                        temp_path,
                        first_page=page,
                        last_page=page,
                        dpi=dpi
                    )
                    
                    if images:
                        preprocessed_image = preprocess_image(images[0])
                        text = pytesseract.image_to_string(
                            preprocessed_image, 
                            config=r'--oem 3 --psm 6'
                        )
                        extracted_text += f"{text}\n\n"
                        # Free memory
                        del images
            else:
                # For smaller files, process all at once
                images = convert_from_path(temp_path, dpi=dpi)
                
                for img in images:
                    preprocessed_image = preprocess_image(img)
                    text = pytesseract.image_to_string(
                        preprocessed_image,
                        config=r'--oem 3 --psm 6'
                    )
                    extracted_text += f"{text}\n\n"
                
                # Free memory
                del images
            
            return extracted_text
            
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_path)
            except Exception as e:
                logger.warning(f"Failed to delete temporary PDF file: {e}")
    
    except Exception as e:
        logger.exception(f"Error processing PDF content: {e}")
        return None
