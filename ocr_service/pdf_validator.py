import functools
import os
import tempfile
from fastapi import UploadFile, HTTPException

def safe_process_pdf(func):
    """
    Decorator to ensure PDF processing is done safely.
    Catches and handles exceptions appropriately.
    """
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            # Log the error
            print(f"Error processing PDF: {str(e)}")
            # Return a user-friendly error
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process PDF: {str(e)}"
            )
    return wrapper

def validate_pdf_file(file: UploadFile):
    """
    Validate a PDF file and save it to a temporary location.
    
    Args:
        file: The uploaded PDF file
        
    Returns:
        tuple: (temp_file_path, is_simple_pdf)
            - temp_file_path: Path to temporary file
            - is_simple_pdf: Whether the PDF is simple (few pages)
            
    Raises:
        HTTPException: If file validation fails
    """
    # Check file extension
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    # Create a temporary file to save the uploaded file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    temp_file_path = temp_file.name
    
    try:
        # Save the uploaded file to the temporary file
        with open(temp_file_path, "wb") as buffer:
            buffer.write(file.file.read())
        
        # Get file size
        file_size = os.path.getsize(temp_file_path)
        
        # Simple check if file is too large
        max_file_size = 50_000_000  # 50 MB
        if file_size > max_file_size:
            os.unlink(temp_file_path)
            raise HTTPException(
                status_code=400,
                detail=f"PDF file too large. Maximum allowed size is {max_file_size / 1_000_000} MB"
            )
        
        # Simple check if file is empty
        if file_size == 0:
            os.unlink(temp_file_path)
            raise HTTPException(
                status_code=400,
                detail="PDF file is empty"
            )
            
        # Consider a PDF simple if it's smaller than 5MB
        is_simple = file_size < 5_000_000
        
        return temp_file_path, is_simple
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Clean up the temporary file
        try:
            os.unlink(temp_file_path)
        except:
            pass
        
        # Raise a generic HTTP exception
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF file: {str(e)}"
        )