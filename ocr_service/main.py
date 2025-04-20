from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
import requests
from io import BytesIO
from PIL import Image
from pdf2image import convert_from_bytes, convert_from_path
import pytesseract
import os
import shutil
import tempfile
import re
from urllib.parse import urlparse

# Increase timeout constants
REQUEST_TIMEOUT = 360  # 3 minutes for downloading files
LARGE_FILE_THRESHOLD = 5_000_000  # 5MB (reduced from 90MB)

app = FastAPI()

# Import and include the table extraction router
# from table_extractor import router as table_router
# app.include_router(table_router)

class ImageURLRequest(BaseModel):
    image_url: str

class PDFURLRequest(BaseModel):
    pdf_url: str

def is_cloudinary_url(url):
    """Check if a URL is from Cloudinary."""
    parsed_url = urlparse(url)
    return 'cloudinary.com' in parsed_url.netloc

def is_google_drive_url(url):
    """Check if a URL is from Google Drive."""
    return 'drive.google.com' in url or 'docs.google.com' in url

def get_cloudinary_direct_url(url):
    """
    Get direct access URL for Cloudinary images.
    Add fl_attachment to prevent transformations that might affect OCR quality.
    """
    # If it already has parameters, add our parameters
    if '?' in url:
        return f"{url}&fl_attachment=true&fl_sanitize=true"
    else:
        return f"{url}?fl_attachment=true&fl_sanitize=true"

def get_image_from_url(url):
    """Get image from URL with special handling for different URL types."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    # Handle Google Drive URLs
    if is_google_drive_url(url):
        print("Processing Google Drive URL")
        # Google Drive URLs work well as-is
        response = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
    
    # Handle Cloudinary URLs
    elif is_cloudinary_url(url):
        print("Processing Cloudinary URL")
        # Get direct URL for Cloudinary
        direct_url = get_cloudinary_direct_url(url)
        response = requests.get(direct_url, headers=headers, timeout=REQUEST_TIMEOUT)
    
    # Handle other URLs
    else:
        print("Processing standard URL")
        response = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch image from URL: HTTP {response.status_code}")
    
    return Image.open(BytesIO(response.content))

def convert_image_to_pdf(image: Image) -> BytesIO:
    """Convert an image to PDF and return the PDF in-memory."""
    pdf_output = BytesIO()
    image.save(pdf_output, format="PDF")
    pdf_output.seek(0)
    return pdf_output

def extract_text_from_pdf(pdf_url: str) -> str:
    """Fetch image from URL, convert to PDF, and extract text using Tesseract OCR."""
    try:
        # Use the enhanced image downloading function
        image = get_image_from_url(pdf_url)
        
        # Convert the image to a PDF in-memory
        pdf_bytes = convert_image_to_pdf(image)
        
        # Convert the PDF content (in bytes) to images (one image per page)
        images = convert_from_bytes(pdf_bytes.read())  # Read the byte stream
        
        extracted_text = ""
        
        # Iterate through the images and extract text from each page
        for img in images:
            custom_config = r'--oem 3 --psm 6'  # You can experiment with different psm modes
            text = pytesseract.image_to_string(img, config=custom_config)
            extracted_text += text + "\n"  # Append the extracted text from each page
            
        if extracted_text:
            print(f"Extracted Text: {extracted_text}")
        else:
            print("No text extracted.")
        
        return extracted_text
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return None

def extract_text_from_pdf_url(pdf_url: str) -> str:
    """Fetch PDF directly from URL and extract text using Tesseract OCR."""
    try:
        # Special handling for different URL types
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Handle Cloudinary URLs
        if is_cloudinary_url(pdf_url):
            print("Processing Cloudinary PDF URL")
            # Get direct URL for Cloudinary
            pdf_url = get_cloudinary_direct_url(pdf_url)
            
        # Handle Google Drive URLs - they require special handling
        elif is_google_drive_url(pdf_url):
            print("Processing Google Drive PDF URL")
            # Google Drive URLs may need direct download parameter
            if 'export=download' not in pdf_url and '/uc?' not in pdf_url:
                # Convert view URL to download URL if needed
                if '/file/d/' in pdf_url:
                    file_id = pdf_url.split('/file/d/')[1].split('/')[0]
                    pdf_url = f"https://drive.google.com/uc?id={file_id}&export=download"
        
        # Check if the file is large before downloading
        try:
            head_response = requests.head(pdf_url, headers=headers, timeout=10)
            content_length = int(head_response.headers.get('content-length', 0))
            
            if content_length > LARGE_FILE_THRESHOLD:
                print(f"Warning: Large PDF detected ({content_length/1_000_000:.2f}MB). Processing may take longer.")
        except Exception as e:
            print(f"Could not get content length: {e}")
            content_length = 0
        
        # Download the PDF from the provided URL with increased timeout
        response = requests.get(pdf_url, headers=headers, timeout=REQUEST_TIMEOUT)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch PDF from URL: HTTP {response.status_code}")
        
        # Convert the PDF content to images with default high quality
        # Memory optimization: process one page at a time for large files
        if content_length > LARGE_FILE_THRESHOLD:
            # For large files, process one page at a time to avoid memory issues
            from pdf2image import pdfinfo_from_bytes
            
            pdf_bytes = BytesIO(response.content)
            info = pdfinfo_from_bytes(pdf_bytes.getvalue())
            max_pages = info["Pages"]
            
            extracted_text = ""
            
            # Process each page individually to conserve memory
            for page in range(1, max_pages + 1):
                print(f"Processing page {page}/{max_pages}")
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
            images = convert_from_bytes(response.content)
            extracted_text = ""
            
            for img in images:
                custom_config = r'--oem 3 --psm 6'
                text = pytesseract.image_to_string(img, config=custom_config)
                extracted_text += text + "\n"
            
        if extracted_text:
            print(f"Extracted Text from PDF: {extracted_text[:100]}...")  # Print just a preview
        else:
            print("No text extracted from PDF.")
        
        return extracted_text
    
    except Exception as e:
        print(f"Error processing PDF URL: {e}")
        return None

def extract_text_from_local_pdf(file_path: str) -> str:
    """Extract text from a local PDF file using Tesseract OCR."""
    try:
        # Get file size to check if it's large
        file_size = os.path.getsize(file_path)
        
        # Set a lower DPI for faster processing
        dpi = 150  # Lower DPI for faster processing (default is 200)
        
        # Get page count before deciding on processing strategy
        from pdf2image import pdfinfo_from_path
        info = pdfinfo_from_path(file_path)
        max_pages = info["Pages"]
        
        print(f"PDF has {max_pages} page(s) and size {file_size/1_000_000:.2f}MB")
        extracted_text = ""
        
        # Optimized path for single-page PDFs that aren't too large
        if max_pages == 1 and file_size < LARGE_FILE_THRESHOLD:
            print("Processing single-page PDF with optimized settings")
            images = convert_from_path(file_path, dpi=dpi)
            
            if images:
                text = pytesseract.image_to_string(images[0], config=r'--oem 3 --psm 6')
                extracted_text = text + "\n"
                # Explicitly delete the image to free memory
                del images
        elif file_size > LARGE_FILE_THRESHOLD:
            print(f"Warning: Large PDF detected ({file_size/1_000_000:.2f}MB). Processing may take longer.")
            
            # Process each page individually to conserve memory
            for page in range(1, max_pages + 1):
                print(f"Processing page {page}/{max_pages}")
                images = convert_from_path(
                    file_path,
                    first_page=page,
                    last_page=page,
                    dpi=dpi
                )
                
                if images:
                    text = pytesseract.image_to_string(images[0], config=r'--oem 3 --psm 6')
                    extracted_text += f"{text}\n"
                    # Free memory
                    del images
        else:
            # For smaller multi-page files, process all at once but with lower DPI
            images = convert_from_path(file_path, dpi=dpi)
            
            for img in images:
                custom_config = r'--oem 3 --psm 6'
                text = pytesseract.image_to_string(img, config=custom_config)
                extracted_text += text + "\n"
            
            # Free memory
            del images
        
        if extracted_text:
            print(f"Extracted Text from local PDF: {extracted_text[:100]}...")  # Print just a preview
        else:
            print("No text extracted from PDF.")
        
        return extracted_text
    
    except Exception as e:
        print(f"Error processing local PDF file: {e}")
        return None

@app.post("/extract-text/")
async def extract_text(request: ImageURLRequest):
    # Extract text from the image URL
    text = extract_text_from_pdf(request.image_url)
    print(text)
    # If text extraction failed, raise an HTTP error
    if not text:
        raise HTTPException(status_code=400, detail="Text extraction failed")
    
    return {"extracted_text": text}

@app.post("/extract-text-from-pdf/")
async def extract_text_from_pdf_endpoint(request: PDFURLRequest):
    # Extract text from the PDF URL
    text = extract_text_from_pdf_url(request.pdf_url)
    # If text extraction failed, raise an HTTP error
    if not text:
        raise HTTPException(status_code=400, detail="PDF text extraction failed")
    
    return {"extracted_text": text}

# Import the PDF validator
from pdf_validator import safe_process_pdf, validate_pdf_file

@app.post("/extract-text-from-uploaded-pdf/")
@safe_process_pdf
async def extract_text_from_uploaded_pdf(file: UploadFile = File(...)):
    """Extract text from an uploaded PDF file."""
    try:
        # Validate and save the PDF to a temporary file
        temp_file_path, is_simple = validate_pdf_file(file)
        
        try:
            # Extract text from the local PDF file
            text = extract_text_from_local_pdf(temp_file_path)
            
            # If text extraction failed, raise an HTTP error
            if not text:
                raise HTTPException(status_code=400, detail="PDF text extraction failed")
            
            return {"extracted_text": text}
        finally:
            # Remove the temporary file after processing
            try:
                os.unlink(temp_file_path)
            except:
                pass
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

