from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from io import BytesIO
import os

# Import the OCR service function
from services.ocr import extract_text_from_url

# Import the PDF validator
from pdf_validator import safe_process_pdf, validate_pdf_file

# Import and include the table extraction router
from table_extractor import router as table_router


# Increase timeout constants
REQUEST_TIMEOUT = 360  # 3 minutes for downloading files
LARGE_FILE_THRESHOLD = 5_000_000  # 5MB (reduced from 90MB)

app = FastAPI()
app.include_router(table_router)


class ImageURLRequest(BaseModel):
    image_url: str


class PDFURLRequest(BaseModel):
    pdf_url: str


@app.post("/extract-text/")
async def extract_text(request: ImageURLRequest):
    """Extract text from an image URL."""
    # Extract text from the image URL using the imported function
    text = extract_text_from_url(request.image_url)
    
    # If text extraction failed, raise an HTTP error
    if not text:
        raise HTTPException(status_code=400, detail="Text extraction failed")
    
    return {"extracted_text": text}


@app.post("/extract-text-from-pdf/")
async def extract_text_from_pdf_endpoint(request: PDFURLRequest):
    """Extract text from a PDF URL."""
    # Use the imported function
    text = extract_text_from_url(request.pdf_url)
    
    # If text extraction failed, raise an HTTP error
    if not text:
        raise HTTPException(
            status_code=400, 
            detail="PDF text extraction failed"
        )
    
    return {"extracted_text": text}


@app.post("/extract-text-from-uploaded-pdf/")
@safe_process_pdf
async def extract_text_from_uploaded_pdf(file: UploadFile = File(...)):
    """Extract text from an uploaded PDF file."""
    try:
        # Validate and save the PDF to a temporary file
        temp_file_path, _ = validate_pdf_file(file)
        
        try:
            # Create a URL from the temp file for the OCR function
            file_url = f"file://{temp_file_path}"
            text = extract_text_from_url(file_url)
            
            # If text extraction failed, raise an HTTP error
            if not text:
                raise HTTPException(
                    status_code=400, 
                    detail="PDF text extraction failed"
                )
            
            return {"extracted_text": text}
        finally:
            # Remove the temporary file after processing
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                print(f"Error removing temp file: {e}")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process PDF: {str(e)}"
        ) from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
