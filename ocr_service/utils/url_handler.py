import requests
import io
import os
import logging
import tempfile
import time
from PIL import Image
from urllib.parse import urlparse
import re
import cloudinary
import cloudinary.uploader
import cloudinary.api
import cloudinary.utils
from core.config import settings

logger = logging.getLogger(__name__)

# Initialize Cloudinary if credentials are available
def init_cloudinary():
    """Initialize Cloudinary with credentials from settings"""
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=settings.CLOUDINARY_SECURE
        )
        return True
    return False

# Try to initialize cloudinary at module load time
cloudinary_initialized = init_cloudinary()

def is_cloudinary_url(url):
    """Check if URL is a Cloudinary URL"""
    # Match standard Cloudinary URL patterns
    pattern = r"https?://(?:res\.cloudinary\.com|(?:[^/]+\.)?cloudinary\.com)/(?:[^/]+)"
    return bool(re.search(pattern, url))

def extract_cloudinary_info(url):
    """
    Extract all needed information from a Cloudinary URL
    
    Args:
        url: The Cloudinary URL
        
    Returns:
        dict: Dictionary containing cloud_name, resource_type, delivery_type, version, and public_id
    """
    # Example URL: https://res.cloudinary.com/dqmvu48nv/image/upload/v1745095264/medical_documents/document_5.pdf
    
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip('/').split('/')
    
    if len(path_parts) < 4:
        logger.error(f"Invalid Cloudinary URL format: {url}")
        return None
    
    result = {
        'cloud_name': path_parts[0],
        'resource_type': path_parts[1],
        'delivery_type': path_parts[2],
        'version': None,
        'public_id': None,
        'format': None
    }
    
    # Check for version
    start_idx = 3
    if start_idx < len(path_parts) and path_parts[start_idx].startswith('v') and path_parts[start_idx][1:].isdigit():
        result['version'] = path_parts[start_idx][1:]  # Remove 'v' prefix
        start_idx += 1
    
    # Extract public ID
    if start_idx < len(path_parts):
        # Join the remaining parts for the public ID
        public_id_with_ext = '/'.join(path_parts[start_idx:])
        
        # Handle file extension
        if '.' in public_id_with_ext:
            public_id, file_ext = public_id_with_ext.rsplit('.', 1)
            result['public_id'] = public_id
            result['format'] = file_ext
        else:
            result['public_id'] = public_id_with_ext
    
    logger.info(f"Extracted Cloudinary info: {result}")
    return result

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

def download_from_cloudinary_url(url):
    """
    Download content from Cloudinary URL with proper authentication
    
    Args:
        url: The Cloudinary URL to download from
        
    Returns:
        bytes: The content of the URL
        
    Raises:
        Exception: If download fails
    """
    try:
        # Extract all information from the URL for logging purposes
        info = extract_cloudinary_info(url)
        
        # First try to use the Cloudinary SDK if we have credentials
        if cloudinary_initialized and info and info['public_id']:
            try:
                logger.info(f"Attempting authenticated download via Cloudinary SDK for {url}")
                
                # Determine resource type (image, video, raw or auto)
                resource_type = info['resource_type'] if info['resource_type'] in ['image', 'video', 'raw'] else 'auto'
                
                # Generate a signed URL with proper authentication
                signed_url = cloudinary.utils.cloudinary_url(
                    info['public_id'],
                    resource_type=resource_type,
                    format=info['format'],
                    type=info['delivery_type'],
                    version=info['version'],
                    secure=True,
                    sign_url=True
                )[0]
                
                logger.info(f"Generated signed URL: {signed_url}")
                
                # Download using the signed URL
                response = requests.get(signed_url, timeout=30)
                if response.status_code == 200:
                    logger.info("Success: Authenticated download succeeded")
                    return response.content
                else:
                    logger.warning(f"Authenticated download failed with status code: {response.status_code}, trying direct download")
            except Exception as sdk_error:
                logger.warning(f"Error using Cloudinary SDK: {str(sdk_error)}, falling back to direct download")
        
        # Fallback to direct download if SDK method failed or wasn't available
        logger.info(f"Attempting direct download from URL: {url}")
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, timeout=30, headers=headers)
        
        if response.status_code == 200:
            logger.info("Success: Direct download succeeded")
            return response.content
        else:
            logger.error(f"Direct download failed with status code: {response.status_code}")
            raise Exception(f"Failed to download from URL: HTTP {response.status_code}")
            
    except Exception as e:
        logger.error(f"Error downloading from Cloudinary URL {url}: {str(e)}")
        raise

def get_image_from_url(url):
    """
    Download image from Cloudinary URL and return as PIL Image
    
    Args:
        url: The Cloudinary URL to download from
        
    Returns:
        PIL.Image: The image
        
    Raises:
        Exception: If download fails or content is not an image
    """
    content = download_from_cloudinary_url(url)
    try:
        return Image.open(io.BytesIO(content))
    except Exception as e:
        logger.error(f"Error opening image from URL {url}: {str(e)}")
        raise Exception(f"Content from URL is not a valid image: {str(e)}")

def get_pdf_from_url(url):
    """
    Download PDF from Cloudinary URL and save to temporary file
    
    Args:
        url: The Cloudinary URL to download from
        
    Returns:
        str: Path to temporary PDF file
        
    Raises:
        Exception: If download fails or content is not a PDF
    """
    content = download_from_cloudinary_url(url)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(content)
        temp_path = temp_file.name
    
    return temp_path