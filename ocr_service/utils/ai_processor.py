import logging
import json
import re
import os
from typing import Dict, Any
import asyncio

# Set up logging
logger = logging.getLogger(__name__)

# Try to import Google's Generative AI library
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    logger.warning("Google Generative AI (Gemini) not available. Install with: pip install google-generativeai")
    GEMINI_AVAILABLE = False

# Import settings
from core.config import settings
from utils.model_reference import JSON_FORMAT

class AIProcessor:
    """Class for processing extracted text with AI models"""
    
    def __init__(self):
        """Initialize AI processor with settings"""
        self.api_key = os.environ.get('GEMINI_API_KEY', settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        
        # Configure Google Generative AI if available
        if GEMINI_AVAILABLE and self.api_key:
            genai.configure(api_key=self.api_key)
    
    def _print_debug_response(self, title, content):
        """Print debug response if debug mode is enabled."""
        if settings.DEBUG:
            print("\n" + "=" * 80)
            print(f"DEBUG - {title}")
            print("=" * 80)
            print(content)
            print("=" * 80 + "\n")

    async def process_text_with_ai_async(self, text: str) -> Dict[str, Any]:
        """
        Process extracted text with Gemini AI model to structure medical data (async version)
        
        Args:
            text: Raw text extracted from document
            
        Returns:
            Dict: Structured JSON data matching Django model format
        """
        if not self.api_key or not GEMINI_AVAILABLE:
            logger.error("Gemini API key not found or library not available. Using fallback text processing.")
            # Fallback to non-AI processing
            return await self.structure_medical_data(text)
        
        try:
            # Debug print - input text
            self._print_debug_response("INPUT TEXT", text[:500] + "..." if len(text) > 500 else text)
            
            # Prepare system prompt for medical data extraction
            # This now includes specific formatting to match the Django models
            system_prompt = """
            You are a medical document analyzer specialized in extracting structured information from lab test results.
            
            Your task is to analyze medical test results and structure the data to match a specific Django model format.
            Review the text carefully and extract test types, parameters, values, units, and reference ranges.
            
            The response should be formatted as JSON that follows this structure:
            
            {
                "test_type": {
                    "name": "The name of the test (CBC, Lipid Panel, etc.)",
                    "code": "A short code for the test (CBC, LIPID)",
                    "description": "Brief description of what the test measures",
                    "category": "The category of the test (Hematology, Chemistry, etc.)"
                },
                "parameters": [
                    {
                        "name": "Parameter name (e.g., Hemoglobin)",
                        "code": "Short parameter code (e.g., HGB)",
                        "unit": "Unit of measurement (e.g., g/dL)",
                        "data_type": "numeric", 
                        "reference_range": {"min": 13.0, "max": 17.0},
                        "value": 14.5,
                        "is_abnormal": false
                    }
                ],
                "metadata": {
                    "lab_name": "Name of the laboratory",
                    "test_date": "YYYY-MM-DD",
                    "patient_info": {}
                }
            }
            
            Notes on fields:
            - data_type should be one of: "numeric", "text", "boolean", or "categorical"
            - For numeric values, provide the actual numeric value
            - For text values, provide the text string
            - For boolean values, use true or false
            - For reference_range, provide min/max for numeric values or applicable text for other types
            - is_abnormal should be true if the value is outside the reference range
            
            If a test has multiple parameters (like CBC has WBC, RBC, etc.), include all parameters in the parameters array.
            If multiple test types are detected, use the most specific one.
            
            Make sure to return only valid JSON without any markdown formatting, explanations, or additional text.
            """
            
            # Initialize Gemini model
            generation_config = {
                "temperature": 0.2,  # Low temperature for more deterministic results
                "top_p": 0.8,
                "top_k": 40,
                "response_mime_type": "application/json",
                "max_output_tokens": 2048,
            }
            
            model = genai.GenerativeModel(
                model_name=self.model_name,
                generation_config=generation_config
            )
            
            # Safety settings to bypass some restrictions for medical content
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE",
                },
            ]
            
            # Call the Gemini API with both system prompt and user content
            response = model.generate_content(
                [system_prompt, f"Extract structured medical data from this text:\n\n{text}"],
                generation_config=generation_config,
                safety_settings=safety_settings,
            )
            
            # Extract response content
            response_content = response.text
            
            # Debug print - raw response from Gemini
            self._print_debug_response("RAW GEMINI RESPONSE", response_content)
            
            # Clean up the response to ensure it's valid JSON
            # Remove code block markers if present
            response_content = re.sub(r'```(?:json)?\s*|\s*```', '', response_content)
            
            # Remove any non-JSON text before or after the JSON object
            response_content = response_content.strip()
            
            # If response doesn't start with {, try to find the JSON object
            if not response_content.startswith('{'):
                match = re.search(r'(\{.*\})', response_content, re.DOTALL)
                if match:
                    response_content = match.group(1)
                else:
                    raise ValueError("Could not find valid JSON in response")
            
            # Parse the JSON response
            structured_data = json.loads(response_content)
            
            # Debug print - parsed JSON
            self._print_debug_response("PARSED JSON RESPONSE", json.dumps(structured_data, indent=2))
            
            # Convert to format for backend if needed
            backend_format = self._convert_to_backend_format(structured_data)
            
            return backend_format
            
        except json.JSONDecodeError as json_err:
            error_msg = f"Error parsing Gemini AI response as JSON: {str(json_err)}"
            logger.error(error_msg)
            logger.error(f"Raw response received: {response_content[:500]}...")
            
            # Debug print - JSON error
            self._print_debug_response("JSON DECODE ERROR", 
                                f"Error: {str(json_err)}\n\nRaw response: {response_content}")
            
            # Fallback to non-AI processing
            return await self.structure_medical_data(text)
            
        except Exception as e:
            error_msg = f"Error processing text with Gemini AI: {str(e)}"
            logger.exception(error_msg)
            
            # Debug print - general error
            self._print_debug_response("PROCESSING ERROR", str(e))
            
            # Fallback to non-AI processing
            return await self.structure_medical_data(text)

    def _convert_to_backend_format(self, ai_output: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert AI output to format expected by backend Django models
        """
        # This base structure is for compatibility with existing code
        result = {
            "test_date": None,
            "lab_name": None,
            "test_type": None,
            "tests": []
        }
        
        try:
            # Get metadata
            if "metadata" in ai_output:
                metadata = ai_output.get("metadata", {})
                result["test_date"] = metadata.get("test_date")
                result["lab_name"] = metadata.get("lab_name")
            
            # Get test type
            if "test_type" in ai_output:
                test_type = ai_output["test_type"]
                result["test_type"] = test_type.get("name")
                
                # Create test entry
                test_entry = {
                    "test_type": test_type.get("name"),
                    "parameters": {},
                    "metadata": {
                        "code": test_type.get("code"),
                        "description": test_type.get("description"),
                        "category": test_type.get("category")
                    }
                }
                
                # Add parameters
                if "parameters" in ai_output:
                    for param in ai_output["parameters"]:
                        param_name = param.get("name")
                        if param_name:
                            test_entry["parameters"][param_name] = {
                                "value": param.get("value"),
                                "unit": param.get("unit", ""),
                                "normal_range": param.get("reference_range", ""),
                                "is_abnormal": param.get("is_abnormal", False),
                                "code": param.get("code", ""),
                                "data_type": param.get("data_type", "numeric")
                            }
                            
                result["tests"].append(test_entry)
            
            return result
        
        except Exception as e:
            logger.exception(f"Error converting AI output to backend format: {str(e)}")
            return ai_output  # Return the original format if conversion fails

    async def structure_medical_data(self, text: str) -> Dict[str, Any]:
        """
        Simple rule-based approach to structure medical data from text
        This is a fallback when AI processing is not available or fails
        
        Args:
            text: Raw text extracted from document
            
        Returns:
            Dict: Structured JSON data matching Django model format
        """
        logger.info("Using rule-based processing for text")
        
        # Basic structure for response - in the format expected by backend
        result = {
            "test_date": None,
            "lab_name": None,
            "test_type": "Unknown Test",
            "tests": []
        }
        
        # Try to identify test type
        for test_name, keywords in settings.TEST_TYPE_KEYWORDS.items():
            for keyword in keywords:
                if keyword.lower() in text.lower():
                    result["test_type"] = test_name
                    
                    # Add as a test with empty parameters for now
                    test_entry = {
                        "test_type": test_name,
                        "parameters": {},
                        "metadata": {
                            "code": test_name[:4].upper(),  # Simple code generation
                            "description": f"Results for {test_name}",
                            "category": "General"
                        }
                    }
                    result["tests"].append(test_entry)
                    break
        
        # If no test type was identified, create a generic one
        if not result["tests"]:
            result["tests"].append({
                "test_type": "General Test",
                "parameters": {},
                "metadata": {
                    "code": "GEN",
                    "description": "General test results",
                    "category": "General"
                }
            })
        
        # Try to find dates in YYYY-MM-DD format
        date_matches = re.findall(r'\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b', text)
        if date_matches:
            result["test_date"] = date_matches[0].replace('/', '-')
        
        # Try to extract lab name - usually at the top of the document
        # This is a very basic heuristic and might need improvement
        lines = text.split('\n')
        for line in lines[:10]:  # Look at first 10 lines
            # If line is short and contains "lab", "laboratory", "clinic", etc.
            if (5 < len(line) < 50 and 
                any(keyword in line.lower() for keyword in ["lab", "laboratory", "clinic", "hospital", "medical", "healthcare"])):
                result["lab_name"] = line.strip()
                break
        
        # Extract parameters based on patterns (very basic approach)
        # Looking for patterns like "Parameter: value unit (range)"
        parameter_pattern = r'([A-Za-z\s]+):\s*([0-9.]+)\s*([A-Za-z/%]+)?\s*(?:\(([^)]+)\))?'
        matches = re.findall(parameter_pattern, text)
        
        for match in matches:
            param_name, value_str, unit, range_value = match
            param_name = param_name.strip()
            
            try:
                numeric_value = float(value_str)
                is_numeric = True
            except ValueError:
                numeric_value = None
                is_numeric = False
            
            # Try to determine if the value is abnormal
            is_abnormal = False
            if range_value and is_numeric:
                # Try to parse range like "0-100" or "< 100" or "> 0"
                range_parts = re.findall(r'([<>]?)\s*(\d+\.?\d*)(?:\s*-\s*(\d+\.?\d*))?', range_value)
                if range_parts:
                    for comparison, min_val, max_val in range_parts:
                        if comparison == "<" and numeric_value >= float(min_val):
                            is_abnormal = True
                        elif comparison == ">" and numeric_value <= float(min_val):
                            is_abnormal = True
                        elif max_val and (numeric_value < float(min_val) or numeric_value > float(max_val)):
                            is_abnormal = True
            
            # Create parameter entry
            param_entry = {
                "value": numeric_value if is_numeric else value_str,
                "unit": unit if unit else "",
                "normal_range": range_value if range_value else "",
                "is_abnormal": is_abnormal,
                "code": ''.join([w[0] for w in param_name.split()]).upper(),  # Simple code - first letter of each word
                "data_type": "numeric" if is_numeric else "text"
            }
            
            # Add to the first test (assuming single test for simplicity)
            result["tests"][0]["parameters"][param_name] = param_entry
        
        logger.info(f"Rule-based processing identified {len(result['tests'][0]['parameters'])} parameters")
        return result
    
    def process_text_with_ai(self, text: str) -> Dict[str, Any]:
        """
        Process extracted text with Gemini AI model to structure medical data
        This function automatically determines if it's in an async context and handles appropriately
        
        Args:
            text: Raw text extracted from document
            
        Returns:
            Dict: Structured JSON data matching Django model format
        """
        try:
            # Try to get the running event loop
            import asyncio
            
            try:
                loop = asyncio.get_running_loop()
                # We're in an async context, so we need to use the async version
                logger.info("Detected async context, using process_text_with_ai_async")
                
                # Since we can't await here directly (this is a sync function),
                # return a minimal structure
                logger.warning("Called sync function in async context - returning minimal structure")
                return {
                    "test_date": None,
                    "lab_name": "Warning: AI processing not available in this context",
                    "test_type": "Unknown",
                    "tests": []
                }
                
            except RuntimeError:
                # No running event loop, we're in a sync context
                # Create a new event loop and run the async function
                logger.info("No running event loop detected, creating new one")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                return loop.run_until_complete(self.process_text_with_ai_async(text))
        
        except Exception as e:
            logger.exception(f"Error in process_text_with_ai: {e}")
            # Emergency fallback
            return {
                "test_date": None,
                "lab_name": f"Error: {str(e)}",
                "test_type": "Error",
                "tests": []
            }

# Create a singleton instance of the AI processor
ai_processor = AIProcessor()

# Export the functions to maintain backward compatibility
async def process_text_with_ai_async(text: str) -> Dict[str, Any]:
    return await ai_processor.process_text_with_ai_async(text)

async def structure_medical_data(text: str) -> Dict[str, Any]:
    return await ai_processor.structure_medical_data(text)

def process_text_with_ai(text: str) -> Dict[str, Any]:
    return ai_processor.process_text_with_ai(text)