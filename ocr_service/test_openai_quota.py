import google.generativeai as genai
import json
import os
from core.config import settings

# Configure the API key for Google Generative AI
api_key = os.environ.get('GEMINI_API_KEY', settings.GEMINI_API_KEY)
genai.configure(api_key=api_key)

print(f"Using model: {settings.GEMINI_MODEL}")
print(f"API key configured: {'Yes' if api_key else 'No'}")

# Create some dummy OCR extracted data to simulate a medical test result
dummy_ocr_text = """
MEDICAL LABORATORY REPORT
Test Date: 2025-03-15
Lab Name: HealthFirst Medical Laboratory

COMPLETE BLOOD COUNT (CBC)
Parameter       Value    Units    Reference Range
Hemoglobin      14.5     g/dL     13.0-17.0
White Blood Cells 7.2    10^3/μL  4.5-11.0
Platelets       250      10^3/μL  150-450
Hematocrit      43       %        40-52
Red Blood Cells 4.9      10^6/μL  4.5-5.9

LIVER FUNCTION TEST (LFT)
Parameter       Value    Units    Reference Range
ALT             30       U/L      7-56
AST             28       U/L      5-40
Bilirubin       0.8      mg/dL    0.1-1.2
Albumin         4.0      g/dL     3.5-5.0

Patient Notes: Patient appears healthy. No significant abnormalities detected.
"""

# Create the system prompt for medical data extraction
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

Return ONLY the JSON object, with no additional text, markdown formatting, or code blocks.
"""

print("\nProcessing dummy OCR text with Google Gemini...")

try:
    # Create a model instance
    model = genai.GenerativeModel(model_name=settings.GEMINI_MODEL)
    
    # Generate content combining the system prompt and dummy text
    response = model.generate_content([
        system_prompt,
        f"Extract structured medical data from this text:\n\n{dummy_ocr_text}"
    ])
    
    # Print raw response for debugging
    print("\n--- Raw Response Text ---")
    print(response.text)
    print("------------------------")
    
    # Try to parse the response as JSON
    try:
        # Clean up response - remove any markdown code block markers
        cleaned_response = response.text.strip()
        if cleaned_response.startswith("```") and cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[3:-3].strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:].strip()
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3].strip()
        
        # Extract JSON part if there's additional text
        if cleaned_response.startswith('{'):
            json_start = 0
        else:
            json_start = cleaned_response.find('{')
            
        if json_start != -1:
            # Find matching closing brace
            json_text = cleaned_response[json_start:]
            result = json.loads(json_text)
            
            print("\n--- Structured Result from Gemini ---")
            print(json.dumps(result, indent=2))
            
    except json.JSONDecodeError as e:
        print(f"\nError parsing JSON: {str(e)}")
        print("Could not parse response as valid JSON.")
        
except Exception as e:
    print(f"\nError processing with Gemini: {str(e)}")