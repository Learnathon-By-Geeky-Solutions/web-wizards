from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import shutil
import logging
from datetime import datetime
from pdf_validator import is_valid_pdf
from table_extractor import extract_tables_from_pdf
from services.ocr import process_image, extract_text_from_pdf
import json

app = FastAPI(title="Medical Document OCR Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test type mappings - add more as needed
TEST_TYPE_KEYWORDS = {
    "complete blood count": "CBC",
    "cbc": "CBC",
    "hemogram": "CBC",
    "blood count": "CBC",
    "urea and electrolytes": "URE",
    "u&e": "URE",
    "electrolytes": "URE",
    "kidney function": "URE",
    "renal function": "URE",
    "liver function": "LFT",
    "lft": "LFT",
    "hepatic function": "LFT",
    "lipid profile": "LIPID",
    "cholesterol": "LIPID",
    "thyroid function": "TFT",
    "tft": "TFT",
    "glucose": "GLUCOSE",
    "hba1c": "GLUCOSE",
    "blood sugar": "GLUCOSE",
    "coagulation": "COAG",
    "iron studies": "IRON",
    "ferritin": "IRON"
}

@app.get("/")
async def root():
    return {"message": "Medical Document OCR Service is online"}

@app.post("/process")
async def process_document(file: UploadFile = File(...)):
    """
    Process a medical document with OCR to extract structured data
    """
    # Check if the file is a PDF
    if not file.filename.lower().endswith('.pdf'):
        # Assume it's an image
        try:
            contents = await file.read()
            await file.seek(0)  # Reset file pointer
            
            # Process the image with OCR
            extracted_text = process_image(contents)
            
            # Extract structured data from text
            structured_data = extract_structured_data(extracted_text)
            
            return {
                "file_name": file.filename,
                "file_type": "image",
                "raw_text": extracted_text,
                "structured_data": structured_data,
                **structured_data  # Include structured data at top level for backwards compatibility
            }
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
    # Handle PDF file
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)
        
        # Validate PDF
        if not is_valid_pdf(temp_file_path):
            os.unlink(temp_file_path)  # Clean up temp file
            raise HTTPException(status_code=400, detail="Invalid PDF file")
        
        # Extract text from PDF
        extracted_text = extract_text_from_pdf(temp_file_path)
        
        # Extract tables from PDF
        tables = extract_tables_from_pdf(temp_file_path)
        
        # Extract structured data from text and tables
        structured_data = extract_structured_data(extracted_text, tables)
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        return {
            "file_name": file.filename,
            "file_type": "pdf",
            "raw_text": extracted_text,
            "tables": tables,
            "structured_data": structured_data,
            **structured_data  # Include structured data at top level for backwards compatibility
        }
        
    except Exception as e:
        # Clean up temp file if it exists
        if 'temp_file_path' in locals():
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
        
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

def extract_structured_data(text, tables=None):
    """
    Extract structured data from text and tables
    """
    structured_data = {
        "test_date": extract_date(text),
        "lab_name": extract_lab_name(text),
    }
    
    # Detect test type
    test_type = detect_test_type(text)
    structured_data["test_type"] = test_type
    
    # Extract test parameters based on test type
    tests = []
    
    # Complete Blood Count (CBC)
    if test_type == "CBC":
        cbc_params = extract_cbc_parameters(text, tables)
        if cbc_params:
            tests.append({
                "test_type": "CBC",
                "parameters": cbc_params
            })
            # Also include at top level for backwards compatibility
            structured_data["cbc"] = cbc_params
    
    # Urea and Electrolytes (URE)
    elif test_type == "URE":
        ure_params = extract_ure_parameters(text, tables)
        if ure_params:
            tests.append({
                "test_type": "URE",
                "parameters": ure_params
            })
            # Also include at top level for backwards compatibility
            structured_data["ure"] = ure_params
            
    # Liver Function Tests (LFT)
    elif test_type == "LFT":
        lft_params = extract_lft_parameters(text, tables)
        if lft_params:
            tests.append({
                "test_type": "LFT",
                "parameters": lft_params
            })
            structured_data["lft"] = lft_params
            
    # Add support for other test types as needed
    
    # Store all tests in a single list
    structured_data["tests"] = tests
    
    return structured_data

def detect_test_type(text):
    """
    Detect the type of test from the text
    """
    text_lower = text.lower()
    
    for keyword, test_code in TEST_TYPE_KEYWORDS.items():
        if keyword in text_lower:
            return test_code
    
    # Default to CBC as fallback for now
    return "CBC"

def extract_date(text):
    """
    Extract test date from text
    """
    # This is a simplified implementation - a real implementation would use regex or NLP
    # to extract dates in various formats
    try:
        # For demonstration, just return today's date as ISO format
        return datetime.now().date().isoformat()
    except:
        return None

def extract_lab_name(text):
    """
    Extract lab name from text
    """
    # This is a simplified implementation - a real implementation would look for known lab names
    # or use patterns to identify the lab name
    common_labs = ["LabCorp", "Quest Diagnostics", "Mayo Clinic Laboratories", "ARUP Laboratories"]
    
    for lab in common_labs:
        if lab.lower() in text.lower():
            return lab
    
    return "Unknown Lab"

def extract_cbc_parameters(text, tables=None):
    """
    Extract CBC parameters from text and tables
    """
    # This is a simplified implementation - a real implementation would use more sophisticated
    # pattern matching, NLP, or machine learning to extract CBC parameters
    
    # Define CBC parameters and their regex patterns
    # For demonstration, we'll use a simulated approach
    cbc_params = {}
    
    # Simulate found parameters with random values
    # In a real implementation, these would be extracted from the text/tables
    if "hemoglobin" in text.lower() or "hgb" in text.lower():
        cbc_params["HGB"] = 14.2
        
    if "hematocrit" in text.lower() or "hct" in text.lower():
        cbc_params["HCT"] = 42.1
        
    if "red blood cell" in text.lower() or "rbc" in text.lower():
        cbc_params["RBC"] = 4.8
        
    if "white blood cell" in text.lower() or "wbc" in text.lower():
        cbc_params["WBC"] = 7.5
    
    if "platelets" in text.lower() or "plt" in text.lower():
        cbc_params["PLT"] = 250
        
    if "mean corpuscular volume" in text.lower() or "mcv" in text.lower():
        cbc_params["MCV"] = 88
        
    if "mean corpuscular hemoglobin" in text.lower() or "mch" in text.lower():
        cbc_params["MCH"] = 29.5
        
    if "mean corpuscular hemoglobin concentration" in text.lower() or "mchc" in text.lower():
        cbc_params["MCHC"] = 33.5
        
    # Add more CBC parameters as needed
    
    return cbc_params

def extract_ure_parameters(text, tables=None):
    """
    Extract URE parameters from text and tables
    """
    # This is a simplified implementation - a real implementation would use more sophisticated
    # pattern matching, NLP, or machine learning to extract URE parameters
    
    ure_params = {}
    
    # Simulate found parameters with random values
    # In a real implementation, these would be extracted from the text/tables
    if "sodium" in text.lower() or "na" in text.lower():
        ure_params["NA"] = 140
        
    if "potassium" in text.lower() or "k" in text.lower():
        ure_params["K"] = 4.2
        
    if "chloride" in text.lower() or "cl" in text.lower():
        ure_params["CL"] = 101
        
    if "bicarbonate" in text.lower() or "hco3" in text.lower():
        ure_params["HCO3"] = 24
        
    if "urea" in text.lower():
        ure_params["UREA"] = 5.2
        
    if "creatinine" in text.lower() or "creat" in text.lower():
        ure_params["CREAT"] = 80
        
    if "egfr" in text.lower():
        ure_params["EGFR"] = 90
        
    # Add more URE parameters as needed
    
    return ure_params

def extract_lft_parameters(text, tables=None):
    """
    Extract LFT parameters from text and tables
    """
    lft_params = {}
    
    # Simulate found parameters with random values
    if "albumin" in text.lower() or "alb" in text.lower():
        lft_params["ALB"] = 40
        
    if "total protein" in text.lower() or "tp" in text.lower():
        lft_params["TP"] = 72
        
    if "bilirubin" in text.lower() or "bili" in text.lower():
        lft_params["BILI"] = 12
        
    if "alkaline phosphatase" in text.lower() or "alp" in text.lower():
        lft_params["ALP"] = 80
        
    if "alanine transaminase" in text.lower() or "alt" in text.lower():
        lft_params["ALT"] = 25
        
    if "aspartate transaminase" in text.lower() or "ast" in text.lower():
        lft_params["AST"] = 22
        
    if "gamma-glutamyl transferase" in text.lower() or "ggt" in text.lower():
        lft_params["GGT"] = 30
        
    return lft_params
