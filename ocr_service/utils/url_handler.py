import requests
import io
import os
import logging
import tempfile
import mimetypes
from PIL import Image
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

def is_url_pdf(url):
    """
    Determine if URL likely points to a PDF based on extension or content-type
    
    Args:
        url: The URL to check
        
    Returns:
        bool: True if the URL likely points to a PDF, False otherwise
    """
    # Check file extension first
    parsed_url = urlparse(url)
    path = parsed_url.path.lower()
    if path.endswith('.pdf'):
        return True
        
    # If no extension, try to get content-type from headers
    try:
        response = requests.head(url, allow_redirects=True, timeout=5)
        content_type = response.headers.get('Content-Type', '')
        if 'application/pdf' in content_type:
            return True
    except Exception as e:
        logger.warning(f"Error checking content type of URL {url}: {str(e)}")
    
    return False

def download_from_url(url):
    """
    Download content from URL and return as bytes
    
    Args:
        url: The URL to download from
        
    Returns:
        bytes: The content of the URL
        
    Raises:
        Exception: If download fails
    """
    try:
        response = requests.get(url, timeout=30)
        if response.status_code != 200:
            raise Exception(f"Failed to download from URL: HTTP {response.status_code}")
        return response.content
    except Exception as e:
        logger.error(f"Error downloading from URL {url}: {str(e)}")
        raise

def get_image_from_url(url):
    """
    Download image from URL and return as PIL Image
    
    Args:
        url: The URL to download from
        
    Returns:
        PIL.Image: The image
        
    Raises:
        Exception: If download fails or content is not an image
    """
    content = download_from_url(url)
    try:
        return Image.open(io.BytesIO(content))
    except Exception as e:
        logger.error(f"Error opening image from URL {url}: {str(e)}")
        raise Exception(f"Content from URL is not a valid image: {str(e)}")

def get_pdf_from_url(url):
    """
    Download PDF from URL and save to temporary file
    
    Args:
        url: The URL to download from
        
    Returns:
        str: Path to temporary PDF file
        
    Raises:
        Exception: If download fails or content is not a PDF
    """
    content = download_from_url(url)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(content)
        temp_path = temp_file.name
    
    return temp_path