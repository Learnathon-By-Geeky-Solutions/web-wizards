import pytesseract
from PIL import Image
import requests
from io import BytesIO
import logging
import os
import tempfile
import pdf2image
import json
import re
from datetime import datetime
from typing import Dict, Any, List, Optional, Union

from utils.image.preprocessing import preprocess_image
from utils.url_handler import is_url_pdf, get_image_from_url, get_pdf_from_url
from utils.ai_processor import process_text_with_ai
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
        # Preprocess the image
        preprocessed_image = preprocess_image(image)
        
        # Configure OCR
        custom_config = r'--oem 3 --psm 6'
        
        # Extract text
        text = pytesseract.image_to_string(preprocessed_image, config=custom_config)
        return text
    except Exception as e:
        logger.exception(f"Error in OCR processing: {str(e)}")
        return ""

async def extract_text_from_url(url: str) -> Union[str, Dict[str, Any]]:
    """
    Extract text from a URL (image or PDF)
    
    Args:
        url: URL of the image or PDF
    
    Returns:
        Extracted text or structured data if PDF
    """
    try:
        # Check if URL points to a PDF
        if is_url_pdf(url):
            # Process as PDF
            return await extract_text_from_pdf_url(url)
        else:
            # Process as image
            image = get_image_from_url(url)
            return await process_image(image)
    except Exception as e:
        logger.exception(f"Error processing content from URL: {str(e)}")
        return None

async def extract_text_from_pdf_url(url: str) -> Dict[str, Any]:
    """
    Extract text from a PDF URL
    
    Args:
        url: URL of the PDF
    
    Returns:
        Dictionary containing structured medical test data
    """
    try:
        # Download PDF to temporary file
        temp_path = get_pdf_from_url(url)
        
        try:
            # Process the PDF
            return await extract_text_from_pdf(temp_path)
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_path)
            except Exception as e:
                logger.warning(f"Failed to delete temporary PDF file: {str(e)}")
    except Exception as e:
        logger.exception(f"Error extracting text from PDF URL: {str(e)}")
        raise

async def extract_text_from_pdf(pdf_path: str) -> Dict[str, Any]:
    """
    Extract text from a PDF and structure it into medical test data
    
    Args:
        pdf_path: Path to the PDF file
    
    Returns:
        Dictionary containing structured medical test data
    """
    try:
        # Convert PDF to images
        images = pdf2image.convert_from_path(pdf_path)
        
        # Extract text from each page
        all_text = ""
        for image in images:
            page_text = await process_image(image)
            all_text += page_text + "\n\n"
        
        # Process with AI if configured
        if settings.USE_AI_PROCESSING:
            structured_data = process_text_with_ai(all_text)
        else:
            # Structure the extracted text using regex-based approach
            structured_data = await structure_medical_data(all_text)
            
        return structured_data
        
    except Exception as e:
        logger.exception(f"Error extracting text from PDF: {str(e)}")
        raise

async def extract_text_from_document(document: Union[str, bytes, Image.Image]) -> Dict[str, Any]:
    """
    Extract text from any document type (URL, bytes, or image)
    
    Args:
        document: Document to process (URL string, bytes, or PIL Image)
        
    Returns:
        Extracted text or structured data
    """
    try:
        if isinstance(document, str) and (document.startswith('http://') or document.startswith('https://')):
            # Process as URL
            return await extract_text_from_url(document)
        elif isinstance(document, bytes):
            # Process as bytes (likely PDF or image)
            try:
                # Try to open as image first
                image = Image.open(BytesIO(document))
                return await process_image(image)
            except Exception:
                # Not a valid image, try as PDF
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                    temp_file.write(document)
                    temp_path = temp_file.name
                
                try:
                    return await extract_text_from_pdf(temp_path)
                finally:
                    try:
                        os.unlink(temp_path)
                    except:
                        pass
        elif isinstance(document, Image.Image):
            # Process as image
            return await process_image(document)
        else:
            raise ValueError("Unsupported document type")
    except Exception as e:
        logger.exception(f"Error extracting text from document: {str(e)}")
        raise

async def structure_medical_data(text: str) -> Dict[str, Any]:
    """
    Structure raw text into medical test data
    
    Args:
        text: Raw text extracted from the document
    
    Returns:
        Dictionary with structured medical test data
    """
    # Extract test date (simple regex pattern)
    date_pattern = r'(?:Date|TEST DATE|Report Date)[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+\w+\s+\d{2,4})'
    date_match = re.search(date_pattern, text, re.IGNORECASE)
    test_date = None
    
    if date_match:
        date_str = date_match.group(1)
        try:
            # Try multiple date formats
            for fmt in ['%d/%m/%Y', '%d-%m-%Y', '%d %B %Y', '%d %b %Y']:
                try:
                    test_date = datetime.strptime(date_str, fmt)
                    break
                except ValueError:
                    continue
        except Exception:
            test_date = None
    
    # Extract lab name
    lab_pattern = r'(?:Laboratory|Lab|LABORATORY)[:\s]+([A-Za-z0-9\s]+)'
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
            cbc_params = {
                "wbc": extract_parameter(text, r'(?:WBC|White\s+Blood\s+Cells)[:\s]+([\d.]+)'),
                "rbc": extract_parameter(text, r'(?:RBC|Red\s+Blood\s+Cells)[:\s]+([\d.]+)'),
                "hgb": extract_parameter(text, r'(?:HGB|Hemoglobin)[:\s]+([\d.]+)'),
                "hct": extract_parameter(text, r'(?:HCT|Hematocrit)[:\s]+([\d.]+)'),
                "plt": extract_parameter(text, r'(?:PLT|Platelets)[:\s]+([\d.]+)')
            }
            test_data["parameters"] = {k: v for k, v in cbc_params.items() if v}
        
        # Extract URE parameters
        elif test_code == "URE":
            # Common URE parameters
            ure_params = {
                "urea": extract_parameter(text, r'(?:Urea|BUN)[:\s]+([\d.]+)'),
                "creatinine": extract_parameter(text, r'(?:Creatinine)[:\s]+([\d.]+)'),
                "sodium": extract_parameter(text, r'(?:Sodium|Na)[:\s]+([\d.]+)'),
                "potassium": extract_parameter(text, r'(?:Potassium|K)[:\s]+([\d.]+)'),
                "chloride": extract_parameter(text, r'(?:Chloride|Cl)[:\s]+([\d.]+)')
            }
            test_data["parameters"] = {k: v for k, v in ure_params.items() if v}
        
        # If parameters were found, add to tests list
        if test_data["parameters"]:
            response["tests"].append(test_data)
    
    # For backward compatibility, add specific CBC and URE data if present
    cbc_data = next((test["parameters"] for test in response["tests"] if test["test_type"] == "CBC"), None)
    if cbc_data:
        response["cbc"] = cbc_data
        
    ure_data = next((test["parameters"] for test in response["tests"] if test["test_type"] == "URE"), None)
    if ure_data:
        response["ure"] = ure_data
    
    return response

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