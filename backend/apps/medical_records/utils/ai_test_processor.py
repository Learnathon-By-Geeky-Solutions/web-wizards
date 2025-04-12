import os
import json
from typing import Dict, Any, Optional
import openai
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AITestProcessor:
    """
    Process medical test reports using OpenAI's GPT API to extract structured data
    """
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        openai.api_key = self.api_key

    def _create_test_prompt(self, test_type: str, ocr_text: str) -> str:
        """
        Create a prompt for the AI model based on test type
        """
        if test_type == "CBC":
            return f"""Extract Complete Blood Count (CBC) test results from the following text and return as JSON.
Include all available values for: hemoglobin, hematocrit, red_blood_cells, mcv, mch, mchc, rdw,
white_blood_cells, neutrophils_percent, lymphocytes_percent, monocytes_percent, eosinophils_percent,
basophils_percent, neutrophils_absolute, lymphocytes_absolute, monocytes_absolute, eosinophils_absolute,
basophils_absolute, platelets, mpv.
Also extract any reference ranges provided.
Format as JSON with 'values' and 'reference_ranges' keys.

Text:
{ocr_text}"""
        
        elif test_type == "URE":
            return f"""Extract Urea and Electrolytes (URE) test results from the following text and return as JSON.
Include all available values for: sodium, potassium, chloride, bicarbonate, urea, creatinine,
egfr, calcium, phosphate, magnesium, uric_acid, glucose.
Also extract any reference ranges provided.
Format as JSON with 'values' and 'reference_ranges' keys.

Text:
{ocr_text}"""
        
        else:
            return f"""Analyze this medical test report and return the following as JSON:
1. Determine the type of test
2. Extract all test parameters and their values
3. Extract any reference ranges provided
Format as JSON with 'test_type', 'values', and 'reference_ranges' keys.

Text:
{ocr_text}"""

    def _detect_test_type(self, text: str) -> Optional[str]:
        """
        Use AI to detect the type of medical test from the OCR text
        """
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",  # Using GPT-4 for better accuracy
                messages=[
                    {
                        "role": "system",
                        "content": "You are a medical test analyzer. Determine if this is a Complete Blood Count (CBC) or Urea and Electrolytes (URE) test. Respond with just 'CBC', 'URE', or 'UNKNOWN'."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.1  # Low temperature for more consistent results
            )
            
            test_type = response.choices[0].message.content.strip().upper()
            return test_type if test_type in ['CBC', 'URE'] else None
            
        except Exception as e:
            logger.error(f"Error detecting test type: {str(e)}")
            return None

    def process_test_report(self, ocr_text: str, test_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a medical test report using AI and return structured data
        
        Args:
            ocr_text: The OCR-extracted text from the medical report
            test_type: Optional test type (CBC or URE). If not provided, will be auto-detected.
            
        Returns:
            Dict containing structured test data
        """
        try:
            # Detect test type if not provided
            if not test_type:
                test_type = self._detect_test_type(ocr_text)
            
            # Create appropriate prompt
            prompt = self._create_test_prompt(test_type, ocr_text)
            
            # Get AI response
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a medical test result parser. Extract test values and reference ranges accurately. Return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1
            )
            
            # Parse the response
            result = json.loads(response.choices[0].message.content)
            
            # Add test type if not included
            if test_type and 'test_type' not in result:
                result['test_type'] = test_type
            
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing AI response as JSON: {str(e)}")
            raise ValueError("Failed to get valid JSON response from AI model")
            
        except Exception as e:
            logger.error(f"Error processing test report with AI: {str(e)}")
            raise

    def validate_and_clean_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and clean the AI-extracted data to ensure it matches our model requirements
        """
        test_type = data.get('test_type', '').upper()
        values = data.get('values', {})
        reference_ranges = data.get('reference_ranges', {})
        
        # Convert string values to float where possible
        cleaned_values = {}
        for key, value in values.items():
            try:
                if isinstance(value, str):
                    # Remove any non-numeric characters except decimal point
                    numeric_str = ''.join(c for c in value if c.isdigit() or c == '.')
                    cleaned_values[key] = float(numeric_str)
                else:
                    cleaned_values[key] = float(value)
            except (ValueError, TypeError):
                # Skip values that can't be converted to float
                continue
        
        # Clean reference ranges
        cleaned_ranges = {}
        for key, range_data in reference_ranges.items():
            if isinstance(range_data, dict) and 'min' in range_data and 'max' in range_data:
                try:
                    cleaned_ranges[key] = {
                        'min': float(range_data['min']),
                        'max': float(range_data['max'])
                    }
                except (ValueError, TypeError):
                    continue
        
        return {
            'test_type': test_type,
            'values': cleaned_values,
            'reference_ranges': cleaned_ranges
        }