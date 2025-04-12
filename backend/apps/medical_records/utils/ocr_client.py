import requests
import os
import json
from django.conf import settings
from typing import Dict, Any, Optional, BinaryIO
import logging

logger = logging.getLogger(__name__)

class OCRClient:
    """
    Client for communicating with the OCR service
    """
    def __init__(self):
        # Get OCR service URL from settings or use default
        self.base_url = getattr(settings, 'OCR_SERVICE_URL', 'http://ocr_service:8000')
    
    def extract_text_from_document(self, file_obj: BinaryIO, filename: str) -> Dict[str, Any]:
        """
        Extract text from a document using the OCR service
        
        Args:
            file_obj: File-like object containing the document
            filename: Original filename of the document
            
        Returns:
            Dict containing the extracted text
        """
        try:
            # Determine the appropriate endpoint based on file extension
            file_extension = os.path.splitext(filename)[1].lower()
            
            if file_extension == '.pdf':
                # Prepare the file for upload to PDF endpoint
                files = {'file': (filename, file_obj)}
                
                # Make request to OCR service PDF endpoint
                response = requests.post(
                    f"{self.base_url}/extract-text-from-uploaded-pdf/",
                    files=files,
                    timeout=600  # Increased timeout for large medical documents
                )
            else:
                # For non-PDF files, we'll need to handle differently
                # Currently, the OCR service only has specific endpoints for PDFs
                # You might need to implement additional handling for other file types
                raise ValueError(f"Unsupported file format: {file_extension}. Currently only PDF format is supported.")
            
            # Check if request was successful
            response.raise_for_status()
            
            # Parse the JSON response
            result = response.json()
            
            # Add structured data extraction if needed
            # Currently returning raw OCR result
            return {
                'raw_text': result.get('extracted_text', ''),
                'structured_data': self._extract_structured_data(result.get('extracted_text', ''))
            }
            
        except requests.RequestException as e:
            logger.error(f"Error communicating with OCR service: {str(e)}")
            # Re-raise as a more generic exception
            raise Exception(f"Failed to process document with OCR service: {str(e)}")
    
    def _extract_structured_data(self, text: str) -> Dict[str, Any]:
        """
        Extract structured data from OCR text
        This is a basic implementation that can be expanded
        
        Args:
            text: The extracted text from OCR
            
        Returns:
            Dict with structured data extracted from the text
        """
        # Initialize with empty data structure
        data = {
            'patient_info': {},
            'diagnosis': [],
            'medications': [],
            'procedures': [],
            'dates': []
        }
        
        # Extract patient info using basic regex
        # Note: This is simplified and would need to be enhanced for production use
        import re
        
        # Extract patient ID/MRN
        patient_id_match = re.search(r"(?:Patient ID|MRN|Chart)[\s#:]*([A-Z0-9-]+)", text, re.IGNORECASE)
        if patient_id_match:
            data['patient_info']['patient_id'] = patient_id_match.group(1).strip()
        
        # Extract patient name
        patient_name_match = re.search(r"(?:Patient Name|Name)[\s:]*([A-Za-z\s,]+)", text, re.IGNORECASE)
        if patient_name_match:
            data['patient_info']['name'] = patient_name_match.group(1).strip()
        
        # Extract dates
        dates = re.findall(r"\d{1,2}[-/]\d{1,2}[-/]\d{2,4}", text)
        if dates:
            data['dates'] = dates
        
        return data

    def health_check(self) -> bool:
        """
        Check if the OCR service is healthy
        
        Returns:
            Boolean indicating if the service is healthy
        """
        try:
            # The original OCR service doesn't have a dedicated health endpoint
            # We'll use a HEAD request to check if the service is available
            response = requests.head(self.base_url, timeout=5)
            return response.status_code < 400
        except requests.RequestException:
            return False


# Singleton instance for use throughout the app
ocr_client = OCRClient()