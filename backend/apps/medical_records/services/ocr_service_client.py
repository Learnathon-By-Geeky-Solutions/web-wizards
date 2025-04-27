import requests
import json
import logging
from django.conf import settings
from django.utils import timezone
import datetime
from ..models.lab_result import LabResult
from ..models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue
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
                process_url = f"{ocr_service_url}/api/process_document"
                
                # Send request with the URL
                # Extract file extension from URL
                parsed_url = document.file.split('.')
                file_extension = parsed_url[-1].lower() if len(parsed_url) > 1 else ""
                
                # Prepare document URL, converting PDF to JPG if needed
                document_url = document.file
                if file_extension == 'pdf':
                    print("document is a pdf")
                    # For Cloudinary URLs, replace PDF extension with JPG
                    if 'cloudinary.com' in document_url:
                        # Split URL at the file extension
                        base_url = document_url.rsplit('.pdf', 1)[0]
                        document_url = f"{base_url}.jpg"
                        logger.info("Converting document URL from PDF to JPG format: %s", 
                                   document_url)
                else:
                    # Keep other formats as they are
                    logger.info("Using document with extension '%s' without conversion", 
                               file_extension)
                payload = {"document_url": document_url}
                print(f"Payload: {json.dumps(payload)}")
                print(f"sending document url to OCR service: {document.file}")
                logger.info(f"Sending document URL to OCR service: {document.file}")
                response = requests.post(process_url, json=payload)
            else:
                print("no valid cloudinary url has been passed to the ocr_service")
                
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
            # Log the OCR response for debugging
            logger.info(f"Processing OCR response: {json.dumps(ocr_response)}")
            
            # Handle the case when the response includes tests array (transitional format)
            if 'tests' in ocr_response and isinstance(ocr_response['tests'], list) and len(ocr_response['tests']) > 0:
                # Extract the first test as our main test data
                test_data = ocr_response['tests'][0]
                
                # Create a normalized structure similar to new format
                if 'metadata' in test_data:
                    metadata = test_data.get('metadata', {})
                else:
                    metadata = {
                        'lab_name': ocr_response.get('lab_name', 'Unknown Lab'),
                        'test_date': ocr_response.get('test_date'),
                        'raw_text': ocr_response.get('raw_text', '')
                    }
                
                # Get test type information
                test_type_info = {
                    'name': test_data.get('test_type', 'Unknown Test'),
                    'code': test_data.get('metadata', {}).get('code', 'UNKNOWN'),
                    'description': test_data.get('metadata', {}).get('description', ''),
                    'category': test_data.get('metadata', {}).get('category', '')
                }
                
                # Transform parameters from dict to list format
                parameters_list = []
                if 'parameters' in test_data and isinstance(test_data['parameters'], dict):
                    for param_name, param_info in test_data['parameters'].items():
                        if isinstance(param_info, dict):
                            param_item = {
                                'name': param_name,
                                'code': param_info.get('code', param_name.upper().replace(' ', '_')),
                                'unit': param_info.get('unit'),
                                'data_type': param_info.get('data_type', 'numeric'),
                                'value': param_info.get('value'),
                                'is_abnormal': param_info.get('is_abnormal', False),
                                'reference_range': param_info.get('normal_range', {})
                            }
                            parameters_list.append(param_item)
                
                # Create our normalized response
                normalized_response = {
                    'test_type': test_type_info,
                    'parameters': parameters_list,
                    'metadata': metadata
                }
                
                # Use the normalized response for further processing
                ocr_response = normalized_response
                
            # Extract metadata
            metadata = ocr_response.get('metadata', {})
            
            # Handle test_date - use current date if not available
            test_date = metadata.get('test_date')
            if not test_date:
                test_date = timezone.now().date()
                logger.info(f"Test date not found in OCR response, using current date: {test_date}")
                # Update metadata with the current date
                metadata['test_date'] = str(test_date)
            
            lab_name = metadata.get('lab_name', 'Unknown Lab')
            
            # Create the LabResult
            lab_result = LabResult.objects.create(
                user=user,
                health_issue=health_issue,
                test_name=f"Lab Report - {ocr_response.get('test_type', {}).get('name', 'Unknown Test')}",
                test_date=test_date,
                lab_name=lab_name,
                result="See detailed results"
            )
            
            # Get or create the test type
            test_type_data = ocr_response.get('test_type', {})
            test_type_code = test_type_data.get('code')
            
            if not test_type_code:
                logger.error("Test type code is missing in OCR response")
                lab_result.delete()
                return None
                
            test_type, created = TestType.objects.get_or_create(
                code=test_type_code,
                defaults={
                    'name': test_type_data.get('name', 'Unknown Test'),
                    'description': test_type_data.get('description', ''),
                    'category': test_type_data.get('category', '')
                }
            )
            
            # Create the test result
            test_result = TestResult.objects.create(
                lab_result=lab_result,
                test_type=test_type,
                metadata=metadata
            )
            
            # Process each parameter
            parameters = ocr_response.get('parameters', [])
            if not parameters:
                logger.error("No parameters found in OCR response")
                test_result.delete()
                lab_result.delete()
                return None
                
            for param_data in parameters:
                # Get or create parameter definition
                param_code = param_data.get('code')
                param_name = param_data.get('name')
                
                if not param_code or not param_name:
                    logger.warning(f"Missing parameter code or name: {param_data}")
                    continue
                
                try:
                    # Ensure unit is never None - use empty string if missing or None
                    unit = param_data.get('unit', '')
                    if unit is None:
                        unit = ''
                        
                    param_def = ParameterDefinition.objects.filter(code=param_code).first()
                    if param_def is None:
                        param_def = ParameterDefinition.objects.create(
                            name=param_name,
                            code=param_code,
                            unit=unit,
                            data_type=param_data.get('data_type', 'numeric'),
                            reference_range_json=param_data.get('reference_range', {})
                        )
                        param_def.test_types.add(test_type)
                    elif test_type not in param_def.test_types.all():
                        param_def.test_types.add(test_type)
                    
                    # Create parameter value
                    value = param_data.get('value')
                    is_abnormal = param_data.get('is_abnormal', False)
                    
                    param_value = ParameterValue(
                        test_result=test_result,
                        parameter=param_def,
                        is_abnormal=is_abnormal
                    )
                    
                    # Set the appropriate value based on data type
                    data_type = param_def.data_type
                    if data_type == 'numeric' and value is not None:
                        try:
                            param_value.numeric_value = float(value)
                        except (ValueError, TypeError):
                            logger.warning(f"Could not convert {value} to float for {param_name}")
                            param_value.text_value = str(value)
                    elif data_type == 'boolean' and value is not None:
                        if isinstance(value, bool):
                            param_value.boolean_value = value
                        else:
                            param_value.boolean_value = str(value).lower() in ('true', 'yes', '1', 'positive')
                    else:
                        param_value.text_value = str(value) if value is not None else None
                    
                    param_value.save()
                    logger.info(f"Saved parameter value: {param_name} = {value}")
                    
                except Exception as e:
                    logger.warning(f"Error processing parameter {param_name}: {str(e)}")
                    continue
            
            # Check if we actually saved any parameters
            if ParameterValue.objects.filter(test_result=test_result).count() > 0:
                logger.info(f"Successfully created test result with {ParameterValue.objects.filter(test_result=test_result).count()} parameters")
                return lab_result
            else:
                # Clean up if no parameters were created
                test_result.delete()
                lab_result.delete()
                logger.error("No valid parameter values created from OCR response")
                return None
                
        except Exception as e:
            logger.exception(f"Error creating test results from OCR response: {str(e)}")
            return None