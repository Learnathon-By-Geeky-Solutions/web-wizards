import json
import logging
import os
import re
from typing import Dict, Any, Optional

# Updated imports for Gemini AI
try:
    import google.generativeai as genai
    logging.info("The project is using Google Generative AI library")
except ImportError:
    # Fallback if Google Generative AI cannot be imported
    genai = None
    logging.error("Failed to import Google Generative AI library")

from core.config import settings

logger = logging.getLogger(__name__)

# Helper function to pretty print JSON responses during development
def _print_debug_response(response_type: str, data: Any) -> None:
    """Print formatted JSON data for debugging purposes"""
    if settings.DEBUG:
        debug_border = "=" * 40
        print(f"\n{debug_border}")
        print(f"AI PROCESSOR DEBUG: {response_type}")
        print(f"{debug_border}")
        if isinstance(data, str):
            print(data[:2000] + "..." if len(data) > 2000 else data)
        else:
            try:
                print(json.dumps(data, indent=2))
            except:
                print(f"Non-JSON data: {str(data)[:500]}")
        print(f"{debug_border}\n")

async def process_text_with_ai_async(text: str) -> Dict[str, Any]:
    """
    Process extracted text with Gemini AI model to structure medical data (async version)
    
    Args:
        text: Raw text extracted from document
        
    Returns:
        Dict: Structured JSON data
    """
    # Get API key from environment/settings
    api_key = os.environ.get('GEMINI_API_KEY', settings.GEMINI_API_KEY)
    
    if not api_key or not genai:
        logger.error("Gemini API key not found or library not available. Using fallback text processing.")
        # Fallback to non-AI processing
        from services.extraction.ocr import structure_medical_data
        return await structure_medical_data(text)
    
    try:
        # Configure Google Generative AI with API key
        genai.configure(api_key=api_key)
        
        # Debug print - input text
        _print_debug_response("INPUT TEXT", text[:500] + "..." if len(text) > 500 else text)
        
        # Prepare system prompt for medical data extraction
        system_prompt = """
        You are a medical document analyzer specialized in extracting structured information from lab test results.
        Analyze the text and extract the following information in JSON format:
        
        1. Test date
        2. Lab name
        3. Test type (CBC, URE, LFT, etc.)
        4. Test parameters with their values, units, and normal ranges
        
        Response format:
        {
            "test_date": "YYYY-MM-DD",
            "lab_name": "Name of the Laboratory", 
            "test_type": "Type of test or 'Multiple Tests'",
            "tests": [
                {
                    "test_type": "CBC",
                    "parameters": {
                        "parameter_name": {
                            "value": "numeric or text value",
                            "unit": "unit of measurement",
                            "normal_range": "reference range"
                        }
                    }
                }
            ]
        }
        
        Make sure to return only valid JSON without any markdown formatting, explanations, or additional text.
        Don't include backticks, the word 'json', or any other formatting in your response.
        Return ONLY the JSON object, nothing else.
        """
        
        # Create a Gemini model instance
        model = genai.GenerativeModel(model_name=settings.GEMINI_MODEL)
        
        # Generate structured response with safety settings to ensure JSON
        generation_config = {
            "temperature": 0.1,  # Lower temperature for more deterministic output
            "top_p": 0.8,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
        
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
        _print_debug_response("RAW GEMINI RESPONSE", response_content)
        
        # Clean up the response to ensure it's valid JSON
        # Remove code block markers if present
        response_content = re.sub(r'```(?:json)?\s*|\s*```', '', response_content)
        
        # Remove any non-JSON text before or after the JSON object
        response_content = response_content.strip()
        
        # If response doesn't start with {, try to find the JSON object
        if not response_content.startswith('{'):
            json_start = response_content.find('{')
            if json_start != -1:
                response_content = response_content[json_start:]
        
        # If response doesn't end with }, try to find the end of the JSON object
        if not response_content.endswith('}'):
            json_end = response_content.rfind('}')
            if json_end != -1:
                response_content = response_content[:json_end+1]
        
        logger.info(f"Cleaned response content: {response_content[:100]}...")
        
        # Debug print - cleaned response
        _print_debug_response("CLEANED RESPONSE", response_content)
        
        # Parse JSON response
        structured_data = json.loads(response_content)
        
        # Validate structure (basic checks)
        if not isinstance(structured_data, dict):
            raise ValueError("AI response is not a valid JSON object")
        
        # Debug print - final structured JSON
        _print_debug_response("FINAL STRUCTURED JSON", structured_data)
        
        return structured_data
        
    except json.JSONDecodeError as json_err:
        error_msg = f"Error parsing Gemini AI response as JSON: {str(json_err)}"
        logger.error(error_msg)
        logger.error(f"Raw response received: {response_content[:500]}...")
        
        # Debug print - JSON error
        _print_debug_response("JSON DECODE ERROR", 
                            f"Error: {str(json_err)}\n\nRaw response: {response_content}")
        
        # Fallback to non-AI processing
        from services.extraction.ocr import structure_medical_data
        return await structure_medical_data(text)
        
    except Exception as e:
        error_msg = f"Error processing text with Gemini AI: {str(e)}"
        logger.exception(error_msg)
        
        # Debug print - general error
        _print_debug_response("PROCESSING ERROR", str(e))
        
        # Fallback to non-AI processing
        from services.extraction.ocr import structure_medical_data
        return await structure_medical_data(text)

# This function should ONLY be called from the sync context
# DO NOT use this in async functions/endpoints
def process_text_with_ai_sync(text: str) -> Dict[str, Any]:
    """
    Process text with Gemini AI in a synchronous context.
    WARNING: This function should ONLY be used in synchronous code.
    
    Args:
        text: Raw text extracted from document
        
    Returns:
        Dict: Structured JSON data
    """
    import asyncio
    
    try:
        # Create a brand new event loop for this synchronous function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Run the async function in this new event loop
        result = loop.run_until_complete(process_text_with_ai_async(text))
        
        # Clean up
        loop.close()
        return result
    except Exception as e:
        logger.exception(f"Error in synchronous AI processing: {str(e)}")
        
        # Create a minimal response structure as fallback
        return {
            "test_date": None,
            "lab_name": "Unknown Lab",
            "test_type": "Unknown Test",
            "tests": []
        }

# For backward compatibility - but this should be used carefully
# In FastAPI async endpoints, use process_text_with_ai_async instead
def process_text_with_ai(text: str) -> Dict[str, Any]:
    """
    Process extracted text with Gemini AI model to structure medical data
    This function automatically determines if it's in an async context and handles appropriately
    
    Args:
        text: Raw text extracted from document
        
    Returns:
        Dict: Structured JSON data
    """
    try:
        # Try to get the running event loop
        import asyncio
        
        try:
            loop = asyncio.get_running_loop()
            # We're in an async context, so we need to use the async version
            logger.info("Detected async context, using process_text_with_ai_async")
            
            # Since we can't await here directly (this is a sync function),
            # we'll create a future in the current loop
            from services.extraction.ocr import structure_medical_data
            
            # Return a minimal structure instead of trying to run async code
            logger.warning("Called sync function in async context - returning minimal structure")
            return {
                "test_date": None,
                "lab_name": "Warning: AI processing not available in this context",
                "test_type": "Unknown Test",
                "tests": []
            }
            
        except RuntimeError:
            # No running event loop, safe to use sync version
            logger.info("No running event loop detected, using process_text_with_ai_sync")
            return process_text_with_ai_sync(text)
            
    except Exception as e:
        logger.exception(f"Critical error in process_text_with_ai: {str(e)}")
        # Return minimal structure as fallback
        return {
            "test_date": None,
            "lab_name": "Error in processing",
            "test_type": "Unknown Test",
            "tests": []
        }