from fastapi import FastAPI, HTTPException, File, UploadFile, APIRouter
from pydantic import BaseModel
import requests
import tempfile
import os
import shutil
import camelot
import pandas as pd
from io import BytesIO
import json

# Create a router for table extraction endpoints
router = APIRouter(prefix="/tables", tags=["tables"])

class PDFURLRequest(BaseModel):
    pdf_url: str
    pages: str = "all"  # Default to all pages

def extract_tables_from_local_pdf(file_path: str, pages: str = "all"):
    """Extract tables from a local PDF file using camelot."""
    try:
        # Read tables from the PDF
        print(f"Extracting tables from {file_path} (pages: {pages})")
        tables = camelot.read_pdf(file_path, pages=pages, flavor="stream")
        
        if len(tables) == 0:
            print("No tables found in the PDF")
            return []
        
        print(f"Found {len(tables)} tables in the PDF")
        result = []
        
        # Process each table
        for i, table in enumerate(tables):
            # Convert to DataFrame and then to dictionary
            df = table.df
            table_dict = {
                "table_number": i + 1,
                "page": table.page,
                "data": json.loads(df.to_json(orient="records")),
                "shape": df.shape,
                "accuracy": table.parsing_report.get('accuracy', 'unknown')
            }
            result.append(table_dict)
            
        return result
    
    except Exception as e:
        print(f"Error extracting tables from PDF: {e}")
        return None


def extract_tables_from_pdf_url(pdf_url: str, pages: str = "all"):
    """Fetch PDF from URL and extract tables using camelot."""
    try:
        # Download the PDF from the provided URL
        response = requests.get(pdf_url)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch PDF from URL: {response.status_code}")
        
        # Save the PDF content to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name
        
        try:
            # Extract tables from the local PDF file
            tables = extract_tables_from_local_pdf(temp_file_path, pages)
            return tables
        finally:
            # Remove the temporary file after processing
            os.unlink(temp_file_path)
    
    except Exception as e:
        print(f"Error processing PDF URL for table extraction: {e}")
        return None


@router.post("/extract-tables-from-pdf")
async def extract_tables_from_pdf_endpoint(request: PDFURLRequest):
    """Extract tables from a PDF URL using camelot."""
    tables = extract_tables_from_pdf_url(request.pdf_url, request.pages)
    
    if tables is None:
        raise HTTPException(status_code=400, detail="Failed to extract tables from PDF")
    
    if len(tables) == 0:
        return {"message": "No tables found in the PDF", "tables": []}
    
    return {"tables": tables}


@router.post("/extract-tables-from-uploaded-pdf")
async def extract_tables_from_uploaded_pdf(pages: str = "all", file: UploadFile = File(...)):
    """Extract tables from an uploaded PDF file using camelot."""
    # Check if the file has a PDF extension
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Create a temporary file to store the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Save uploaded file to the temp file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        try:
            # Extract tables from the local PDF file
            tables = extract_tables_from_local_pdf(temp_file_path, pages)
            
            if tables is None:
                raise HTTPException(status_code=400, detail="Failed to extract tables from PDF")
            
            if len(tables) == 0:
                return {"message": "No tables found in the PDF", "tables": []}
            
            return {"tables": tables}
        finally:
            # Remove the temporary file after processing
            os.unlink(temp_file_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    finally:
        # Make sure to close the file
        file.file.close()

# Example usage
if __name__ == "__main__":
    # This can be used for testing the module independently
    import sys
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        pages = sys.argv[2] if len(sys.argv) > 2 else "all"
        tables = extract_tables_from_local_pdf(file_path, pages)
        print(json.dumps(tables, indent=2))
    else:
        print("Usage: python table_extractor.py <pdf_file> [pages]")
