import os
import io
import tempfile
import PyPDF2
import shutil
from typing import Tuple, Optional, BinaryIO, Union, Callable
from fastapi import UploadFile, HTTPException
import inspect
import logging

logger = logging.getLogger(__name__)

def is_valid_pdf(file_content: bytes) -> bool:
    """
    Check if the file content is a valid PDF.
    
    Args:
        file_content: The binary content of the file
    
    Returns:
        bool: True if valid PDF, False otherwise
    """
    try:
        # Try to open as PDF
        with io.BytesIO(file_content) as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            # Check if it has at least one page
            if len(reader.pages) > 0:
                return True
            else:
                return False
    except Exception:
        return False

def validate_pdf_file(upload_file: UploadFile) -> Tuple[str, bool]:
    """
    Validate an uploaded file to ensure it's a PDF and save to temp location.
    
    Args:
        upload_file: The uploaded file from FastAPI
        
    Returns:
        Tuple of (temp_file_path, is_simple_pdf)
        
    Raises:
        HTTPException: If file is invalid
    """
    # Check file extension
    if not upload_file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # Create a temporary file to save the upload
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        # Copy the uploaded file to the temporary file
        try:
            # Read the file content
            content = upload_file.file.read()
            
            # Check if it's a valid PDF
            if not is_valid_pdf(content):
                os.unlink(temp_file.name)
                raise HTTPException(status_code=400, detail="Invalid or corrupted PDF file")
            
            # Write content to temp file
            temp_file.write(content)
            temp_file_path = temp_file.name
            
            # Reset file pointer for future use
            upload_file.file.seek(0)
            
            # Simple heuristic: PDFs under 5MB with few pages are likely simpler
            is_simple = len(content) < 5_000_000
            
            # Return temporary file path and simplicity flag
            return temp_file_path, is_simple
            
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            # Clean up temp file if anything goes wrong
            try:
                os.unlink(temp_file.name)
            except:
                pass
            raise HTTPException(status_code=400, detail=f"Failed to process PDF: {str(e)}")

def safe_process_pdf(func):
    """
    Decorator to safely process PDF files or URLs that point to PDFs.
    This handles both UploadFile objects and URLs as strings.
    """
    async def wrapper(*args, **kwargs):
        # Get the first argument which should be either UploadFile or a request object with URL
        if not args:
            # No positional arguments, check if there's a file or URL in kwargs
            file_arg = kwargs.get('file')
            request_arg = kwargs.get('request')
        else:
            # Get first positional argument
            file_arg = args[0]
            request_arg = args[0] if not isinstance(args[0], UploadFile) else None
            
        temp_path = None
        
        try:
            # Handle UploadFile case
            if isinstance(file_arg, UploadFile):
                # Validate the PDF and get temp path
                temp_path, is_simple = validate_pdf_file(file_arg)
                
                # Now actually call the function
                return await func(*args, **kwargs)
            
            # Handle URL case - this has already been handled in the endpoint itself
            # so we just pass through the call with no additional processing
            return await func(*args, **kwargs)
            
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            # Log any other exceptions
            logger.exception(f"Error in safe_process_pdf: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred processing the PDF file: {str(e)}"
            )
        finally:
            # Clean up temporary file if one was created
            if temp_path:
                try:
                    os.unlink(temp_path)
                except Exception as e:
                    logger.warning(f"Failed to delete temporary file: {str(e)}")
            
            # Close file if it's an UploadFile
            if isinstance(file_arg, UploadFile):
                file_arg.file.close()
                
    return wrapper