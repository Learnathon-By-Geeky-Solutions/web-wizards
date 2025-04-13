import requests
import json
import logging
from django.conf import settings
from ..models.lab_result import LabResult
from ..models.test_parameters import TestType
from .test_service import TestService

logger = logging.getLogger(__name__)

class OCRServiceClient:
    """
    Client for communicating with the OCR service
    """
    
    @staticmethod
    def process_document(document):
        """
        Send a document to the OCR service for processing
        
        Args:
            document: Document instance with file
            
        Returns:
            Dictionary with extracted data or None if failed
        """
        if not document.file:
            logger.error("Document has no file attached")
            return None
            
        # Get OCR service URL from settings (default to localhost if not specified)
        ocr_service_url = getattr(settings, 'OCR_SERVICE_URL', 'http://ocr_service:8000')
        process_url = f"{ocr_service_url}/process"
        
        try:
            # Open the file and send to OCR service
            with document.file.open('rb') as file:
                files = {'file': (document.file.name, file)}
                response = requests.post(process_url, files=files)
                
            if response.status_code != 200:
                logger.error(f"OCR service returned {response.status_code}: {response.text}")
                return None
                
            return response.json()
                
        except Exception as e:
            logger.exception(f"Error processing document with OCR service: {str(e)}")
            return None
    
    @staticmethod
    def create_test_result_from_ocr(document, ocr_response, user, health_issue=None):
        """
        Create a lab result and test results from OCR service response
        
        Args:
            document: Document instance that was processed
            ocr_response: Response from OCR service
            user: User who owns the document
            health_issue: Optional related health issue
            
        Returns:
            LabResult instance or None if failed
        """
        try:
            # Extract basic lab info
            test_date = ocr_response.get('test_date')
            lab_name = ocr_response.get('lab_name', 'Unknown Lab')
            
            # Create the LabResult
            lab_result = LabResult.objects.create(
                user=user,
                health_issue=health_issue,
                test_name=f"Lab Report - {ocr_response.get('test_type', 'Multiple Tests')}",
                test_date=test_date,
                lab_name=lab_name,
                result="See detailed results",
                document=document
            )
            
            # Handle each test found in the OCR response
            tests_created = []
            
            if 'tests' in ocr_response and isinstance(ocr_response['tests'], list):
                for test_data in ocr_response['tests']:
                    test_type_code = test_data.get('test_type')
                    parameters = test_data.get('parameters', {})
                    
                    # Skip if test type is not recognized
                    if not test_type_code or not TestType.objects.filter(code=test_type_code).exists():
                        continue
                    
                    # Create the test result
                    test_result = TestService.create_test_result(
                        lab_result=lab_result,
                        test_type_code=test_type_code,
                        parameters=parameters
                    )
                    tests_created.append(test_result)
            
            # If we have specific CBC or URE data directly in the response (older OCR format)
            elif 'cbc' in ocr_response:
                parameters = ocr_response['cbc']
                test_result = TestService.create_test_result(
                    lab_result=lab_result,
                    test_type_code='CBC',
                    parameters=parameters
                )
                tests_created.append(test_result)
            
            elif 'ure' in ocr_response:
                parameters = ocr_response['ure']
                test_result = TestService.create_test_result(
                    lab_result=lab_result,
                    test_type_code='URE',
                    parameters=parameters
                )
                tests_created.append(test_result)
            
            if tests_created:
                return lab_result
            else:
                # Clean up if no tests were created
                lab_result.delete()
                logger.error("No valid test results found in OCR response")
                return None
                
        except Exception as e:
            logger.exception(f"Error creating test results from OCR response: {str(e)}")
            return None