import os
import re
import json
import logging
from typing import Dict, Any, Optional, BinaryIO, Tuple
from django.core.files.base import ContentFile
from django.db import transaction
from .ocr_client import ocr_client
from .ai_test_processor import AITestProcessor
from ..models import LabResult, CBCTestResult, URETestResult

logger = logging.getLogger(__name__)

# Initialize the AI test processor
ai_processor = AITestProcessor()

def process_medical_document(file_obj: BinaryIO, filename: str) -> Dict[str, Any]:
    """
    Process a medical document with OCR and extract structured data using AI
    
    Args:
        file_obj: File-like object containing the document
        filename: Original filename of the document
        
    Returns:
        Dict containing the OCR results and structured data
    """
    # Check if file is a PDF
    file_extension = os.path.splitext(filename)[1].lower()
    if file_extension != '.pdf':
        raise ValueError(f"Unsupported file format: {file_extension}. Currently only PDF format is supported.")
    
    try:
        # Reset file pointer to beginning
        file_obj.seek(0)
        
        # Call OCR service
        ocr_result = ocr_client.extract_text_from_document(file_obj, filename)
        
        # Process OCR text with AI to extract structured test data
        ai_result = ai_processor.process_test_report(ocr_result.get('raw_text', ''))
        
        # Validate and clean the AI-extracted data
        cleaned_data = ai_processor.validate_and_clean_data(ai_result)
        
        # Add AI-processed data to OCR result
        ocr_result['test_data'] = cleaned_data
        ocr_result['test_type'] = cleaned_data.get('test_type')
        
        return ocr_result
    
    except Exception as e:
        logger.error(f"Error processing document with OCR and AI: {str(e)}")
        raise

@transaction.atomic
def create_test_result(user, ocr_result: Dict[str, Any], health_issue_id: Optional[int] = None) -> LabResult:
    """
    Create a lab result record with specific test details from AI-processed OCR data
    """
    test_data = ocr_result.get('test_data', {})
    test_type = test_data.get('test_type')
    values = test_data.get('values', {})
    reference_ranges = test_data.get('reference_ranges', {})
    
    if not test_type or not values:
        raise ValueError("No valid test data found in OCR result")
    
    # Create the base lab result
    lab_result = LabResult.objects.create(
        user=user,
        health_issue_id=health_issue_id,
        test_name=test_type,
        test_date=None,  # You might want to extract this from the document
        result=json.dumps(values),
        reference_range=json.dumps(reference_ranges),
        notes=f"Automatically extracted from document using OCR and AI. Original text:\n{ocr_result.get('raw_text', '')[:500]}..."
    )
    
    # Create specific test result record based on type
    if test_type == 'CBC':
        CBCTestResult.objects.create(
            lab_result=lab_result,
            **values,
            reference_ranges=reference_ranges
        )
    elif test_type == 'URE':
        URETestResult.objects.create(
            lab_result=lab_result,
            **values,
            reference_ranges=reference_ranges
        )
    
    return lab_result

def map_ocr_data_to_medical_record(ocr_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Map OCR and AI-processed data to a structure suitable for creating or updating a medical record
    """
    medical_record_data = {
        'patient_data': {},
        'diagnoses': [],
        'medications': [],
        'procedures': [],
        'raw_text': ocr_result.get('raw_text', ''),
        'metadata': {}
    }
    
    # Add AI-processed test result data if present
    test_data = ocr_result.get('test_data')
    if test_data:
        medical_record_data['test_result'] = {
            'type': test_data.get('test_type'),
            'values': test_data.get('values', {}),
            'reference_ranges': test_data.get('reference_ranges', {})
        }
    
    # Extract other structured data if available
    structured_data = ocr_result.get('structured_data', {})
    
    if structured_data:
        # Map patient info
        medical_record_data['patient_data'] = structured_data.get('patient_info', {})
        
        # Map other data
        medical_record_data['diagnoses'] = structured_data.get('diagnoses', [])
        medical_record_data['medications'] = structured_data.get('medications', [])
        medical_record_data['procedures'] = structured_data.get('procedures', [])
    
    # Add metadata
    medical_record_data['metadata'] = {
        'document_name': ocr_result.get('file_name', ''),
        'extracted_dates': structured_data.get('dates', []) if structured_data else []
    }
    
    return medical_record_data