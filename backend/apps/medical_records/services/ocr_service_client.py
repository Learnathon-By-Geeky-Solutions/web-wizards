import requests
import json
import logging
from django.conf import settings
from ..models.lab_result import LabResult
from ..models.test_parameters import TestType, ParameterDefinition
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
        
        try:
            # Check if document.file is a URL string (from Cloudinary) or a file object
            if isinstance(document.file, str) and (document.file.startswith('http://') or document.file.startswith('https://')):
                # If it's a URL, use the Cloudinary URL endpoint
                process_url = f"{ocr_service_url}/api/v1/process_cloudinary"
                
                # Send request with the URL
                payload = {"document_url": document.file}
                logger.info(f"Sending document URL to OCR service: {document.file}")
                response = requests.post(process_url, json=payload)
            else:
                # Original behavior for file objects
                process_url = f"{ocr_service_url}/api/v1/process"
                with document.file.open('rb') as file:
                    files = {'file': (document.file.name, file)}
                    logger.info(f"Sending document file to OCR service: {document.file.name}")
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
                    parameters_data = test_data.get('parameters', {})
                    
                    # Skip if test type is not recognized
                    if not test_type_code or not TestType.objects.filter(code=test_type_code).exists():
                        continue
                    
                    # Transform AI model format to TestService format
                    # The AI model returns parameters in format:
                    # {"parameter_name": {"value": "14.2", "unit": "g/dL", "normal_range": "12-16"}}
                    # TestService expects: {"parameter_code": value}
                    
                    transformed_parameters = {}
                    
                    for param_name, param_data in parameters_data.items():
                        # Try to find parameter definition by name or code
                        param_def = None
                        try:
                            # First try to find by exact code match
                            param_def = ParameterDefinition.objects.get(
                                code__iexact=param_name,
                                test_types__code=test_type_code
                            )
                        except ParameterDefinition.DoesNotExist:
                            try:
                                # Try by name match (case insensitive)
                                param_def = ParameterDefinition.objects.filter(
                                    name__icontains=param_name,
                                    test_types__code=test_type_code
                                ).first()
                            except Exception:
                                pass
                        
                        # Extract the value from param_data
                        if isinstance(param_data, dict) and 'value' in param_data:
                            param_value = param_data['value']
                            
                            # Try to convert to float for numeric parameters
                            if param_def and param_def.data_type == 'numeric':
                                try:
                                    param_value = float(param_value)
                                except (ValueError, TypeError):
                                    logger.warning(f"Could not convert {param_value} to float for {param_name}")
                            
                            # Add to transformed parameters using parameter code
                            param_code = param_def.code if param_def else param_name
                            transformed_parameters[param_code] = param_value
                            
                            # If parameter definition doesn't exist yet, create it
                            if not param_def:
                                try:
                                    # Try to determine if numeric
                                    try:
                                        float(param_value)
                                        data_type = 'numeric'
                                    except (ValueError, TypeError):
                                        data_type = 'text'
                                    
                                    # Get test type
                                    test_type = TestType.objects.get(code=test_type_code)
                                    
                                    # Create new parameter definition
                                    param_def = ParameterDefinition(
                                        name=param_name,
                                        code=param_name.upper().replace(' ', '_'),
                                        unit=param_data.get('unit', ''),
                                        data_type=data_type
                                    )
                                    param_def.save()
                                    param_def.test_types.add(test_type)
                                    
                                    # Update code in transformed parameters
                                    transformed_parameters[param_def.code] = param_value
                                    del transformed_parameters[param_name]
                                    
                                    # If normal range provided, add to reference_range_json
                                    if 'normal_range' in param_data:
                                        # Try to parse range like "12-16" to min/max
                                        try:
                                            range_str = param_data['normal_range']
                                            if '-' in range_str:
                                                min_val, max_val = range_str.split('-', 1)
                                                param_def.reference_range_json = {
                                                    'min': float(min_val.strip()),
                                                    'max': float(max_val.strip())
                                                }
                                                param_def.save()
                                        except Exception as e:
                                            logger.warning(f"Could not parse normal range: {e}")
                                    
                                except Exception as e:
                                    logger.warning(f"Could not create parameter definition: {e}")
                        else:
                            # Handle simple value (not dict)
                            transformed_parameters[param_name] = param_data
                    
                    # Create the test result with transformed parameters
                    test_result = TestService.create_test_result(
                        lab_result=lab_result,
                        test_type_code=test_type_code,
                        parameters=transformed_parameters
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