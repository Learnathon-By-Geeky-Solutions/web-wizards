import json
import logging
import os
from typing import Dict, Any, Optional
import openai
from openai import OpenAI
from core.config import settings

logger = logging.getLogger(__name__)

def process_text_with_ai(text: str) -> Dict[str, Any]:
    """
    Process extracted text with an AI model to structure medical data
    
    Args:
        text: Raw text extracted from document
        
    Returns:
        Dict: Structured JSON data
    """
    # Get API key from environment/settings
    api_key = os.environ.get('OPENAI_API_KEY', settings.OPENAI_API_KEY)
    
    if not api_key:
        logger.error("OpenAI API key not found. Using fallback text processing.")
        # Fallback to non-AI processing
        from services.extraction.ocr import structure_medical_data
        return structure_medical_data(text)
    
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)
        
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
                        },
                        ...more parameters
                    }
                },
                ...more test types
            ]
        }
        
        If you can't determine some values, leave those fields null. Only include parameters that are clearly mentioned in the text.
        """
        
        # Call the OpenAI API
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Can be configured in settings
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.1,  # Low temperature for more deterministic results
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # Extract JSON response
        response_content = completion.choices[0].message.content
        
        # Parse JSON response
        structured_data = json.loads(response_content)
        
        # Validate structure (basic checks)
        if not isinstance(structured_data, dict):
            raise ValueError("AI response is not a valid JSON object")
        
        return structured_data
        
    except Exception as e:
        logger.exception(f"Error processing text with AI: {str(e)}")
        # Fallback to non-AI processing
        from services.extraction.ocr import structure_medical_data
        return structure_medical_data(text)