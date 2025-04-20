import pytesseract
from PIL import Image
import requests
from io import BytesIO
import logging
import os
import pdf2image
import re
from datetime import datetime
from typing import Dict, Any, Union

# Import improved functionality from services.ocr
from services.ocr import preprocess_image, extract_text_from_url as ocr_extract_text_from_url
from utils.url_handler import is_url_pdf, get_pdf_from_url
from core.config import settings

logger = logging.getLogger(__name__)


async def process_image(image: Image.Image) -> str:
    """
    Process a single image through OCR
    
    Args:
        image: PIL Image object
    
    Returns:
        Extracted text
    """
    try:
        # Use the improved preprocessing from services.ocr
        preprocessed_image = preprocess_image(image)
        
        # Configure OCR with the same settings as in services.ocr
        custom_config = r'--oem 3 --psm 6'  # Experiment with `psm` values
        
        # Extract text
        text = pytesseract.image_to_string(
            preprocessed_image,
            config=custom_config
        )
        return text
    except Exception as e:
        logger.exception("Error in OCR processing: %s", str(e))
        return ""


async def extract_text_from_url(url: str) -> Union[str, Dict[str, Any]]: 
    """
    Extract text from a URL (image or PDF) - optimized for Cloudinary URLs
    
    Args:
        url: Cloudinary URL of the image or PDF
    
    Returns:
        Extracted text or structured data if PDF
    """
    try:
        # Use the enhanced OCR functionality from services.ocr
        extracted_text = ocr_extract_text_from_url(url)
        
        if extracted_text:
            logger.info("Successfully extracted text using enhanced OCR")
            return extracted_text
        
        # Fall back to the previous implementation if the enhanced method fails
        logger.warning("Enhanced OCR failed, falling back to original implementation")
        
        # Check if URL points to a PDF
        if is_url_pdf(url):
            # Process as PDF
            temp_path = get_pdf_from_url(url)
            
            try:
                # Convert PDF to images
                images = pdf2image.convert_from_path(temp_path)
                
                # Extract text from each page
                all_text = ""
                for image in images:
                    page_text = await process_image(image)
                    all_text += page_text + "\n\n"
                
                return all_text
            finally:
                # Clean up temporary file
                try:
                    os.unlink(temp_path)
                except Exception as e:
                    logger.warning(
                        "Failed to delete temporary PDF file: %s",
                        str(e)
                    )
        else:
            # Direct image processing 
            try:
                response = requests.get(url, timeout=30)
                if response.status_code != 200:
                    logger.error(
                        "Failed to fetch image from URL: %s, status code: %s",
                        url,
                        response.status_code
                    )
                    return None
                    
                image = Image.open(BytesIO(response.content))
                return await process_image(image)
            except Exception as e:
                logger.exception(
                    "Error processing image URL: %s, error: %s",
                    url,
                    str(e)
                )
                return None
    except Exception as e:
        logger.exception("Error processing content from URL: %s", str(e))
        return None


async def structure_medical_data(text: str) -> Dict[str, Any]:
    """
    Structure raw text into medical test data
    
    Args:
        text: Raw text extracted from the document
    
    Returns:
        Dictionary with structured medical test data
    """
    # Extract test date (simplifying regex pattern)
    date_pattern = r'(?:Date|TEST DATE|Report Date)[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{4})'
    date_match = re.search(date_pattern, text, re.IGNORECASE)
    test_date = None
    
    if date_match:
        date_str = date_match.group(1)
        try:
            # Try multiple date formats
            for fmt in ['%d/%m/%Y', '%d-%m-%Y']:
                try:
                    test_date = datetime.strptime(date_str, fmt)
                    break
                except ValueError:
                    continue
        except Exception:
            test_date = None
    
    # Extract lab name with simplified pattern
    lab_pattern = r'(?:Laboratory|Lab)[:\s]+([A-Za-z0-9\s]+)'
    lab_match = re.search(lab_pattern, text, re.IGNORECASE)
    lab_name = lab_match.group(1).strip() if lab_match else "Unknown Lab"
    
    # Determine test types based on keywords
    test_types = []
    for keyword, test_code in settings.TEST_TYPE_KEYWORDS.items():
        if keyword.lower() in text.lower() and test_code not in test_types:
            test_types.append(test_code)
    
    # If multiple test types are found, set as "Multiple Tests"
    if len(test_types) > 1:
        test_type = "Multiple Tests"
    elif len(test_types) == 1:
        test_type = test_types[0]
    else:
        test_type = "Unknown Test"
    
    # Structure for response
    response = {
        "test_date": test_date,
        "lab_name": lab_name,
        "test_type": test_type,
        "tests": []
    }
    
    # Extract specific test data
    for test_code in test_types:
        test_data = {"test_type": test_code, "parameters": {}}
        
        # Extract CBC parameters
        if test_code == "CBC":
            # Common CBC parameters
            cbc_params = extract_cbc_parameters(text)
            test_data["parameters"] = {
                k: v for k, v in cbc_params.items() if v
            }
        
        # Extract URE parameters
        elif test_code == "URE":
            # Common URE parameters
            ure_params = extract_ure_parameters(text)
            test_data["parameters"] = {
                k: v for k, v in ure_params.items() if v
            }
        
        # If parameters were found, add to tests list
        if test_data["parameters"]:
            response["tests"].append(test_data)
    
    # For backward compatibility, add specific CBC and URE data
    cbc_test = next(
        (test for test in response["tests"] if test["test_type"] == "CBC"),
        None
    )
    if cbc_test:
        response["cbc"] = cbc_test["parameters"]
        
    ure_test = next(
        (test for test in response["tests"] if test["test_type"] == "URE"),
        None
    )
    if ure_test:
        response["ure"] = ure_test["parameters"]
    
    return response


def extract_cbc_parameters(text: str) -> Dict[str, Any]:
    """
    Extract common CBC parameters from text
    
    Args:
        text: Raw text to extract parameters from
        
    Returns:
        Dictionary of CBC parameters
    """
    return {
        "wbc": extract_parameter(
            text,
            r'(?:WBC|White\s+Blood\s+Cells)[:\s]+([\d.]+)'
        ),
        "rbc": extract_parameter(
            text,
            r'(?:RBC|Red\s+Blood\s+Cells)[:\s]+([\d.]+)'
        ),
        "hgb": extract_parameter(
            text,
            r'(?:HGB|Hemoglobin)[:\s]+([\d.]+)'
        ),
        "hct": extract_parameter(
            text,
            r'(?:HCT|Hematocrit)[:\s]+([\d.]+)'
        ),
        "plt": extract_parameter(
            text,
            r'(?:PLT|Platelets)[:\s]+([\d.]+)'
        )
    }


def extract_ure_parameters(text: str) -> Dict[str, Any]:
    """
    Extract common URE parameters from text
    
    Args:
        text: Raw text to extract parameters from
        
    Returns:
        Dictionary of URE parameters
    """
    return {
        "urea": extract_parameter(
            text,
            r'(?:Urea|BUN)[:\s]+([\d.]+)'
        ),
        "creatinine": extract_parameter(
            text,
            r'(?:Creatinine)[:\s]+([\d.]+)'
        ),
        "sodium": extract_parameter(
            text,
            r'(?:Sodium|Na)[:\s]+([\d.]+)'
        ),
        "potassium": extract_parameter(
            text,
            r'(?:Potassium|K)[:\s]+([\d.]+)'
        ),
        "chloride": extract_parameter(
            text,
            r'(?:Chloride|Cl)[:\s]+([\d.]+)'
        )
    }


def extract_parameter(text: str, pattern: str) -> Dict[str, Any]:
    """
    Extract a parameter value, unit and normal range
    
    Args:
        text: Text to search in
        pattern: Regex pattern to match
        
    Returns:
        Dictionary with parameter details or None if not found
    """
    match = re.search(pattern, text, re.IGNORECASE)
    if not match:
        return None
    
    value = match.group(1)
    
    # Try to find unit and normal range
    unit_pattern = pattern + r'\s*([a-zA-Z0-9/^]+)'
    unit_match = re.search(unit_pattern, text, re.IGNORECASE)
    unit = unit_match.group(2) if unit_match else None
    
    # Normal range pattern
    range_pattern = pattern + r'(?:.*?)\(([^)]+)\)'
    range_match = re.search(range_pattern, text, re.IGNORECASE)
    normal_range = range_match.group(2) if range_match else None
    
    return {
        "value": value,
        "unit": unit,
        "normal_range": normal_range
    }