import re
from typing import Dict, Any, Optional, Tuple
import json
import logging
from ..models import CBCTestResult, URETestResult

logger = logging.getLogger(__name__)

class TestResultExtractor:
    """
    Service for extracting structured test result data from OCR text
    """
    
    @staticmethod
    def determine_test_type(text: str) -> Optional[str]:
        """
        Determine the type of medical test from OCR text
        """
        text = text.lower()
        
        # CBC indicators
        cbc_indicators = [
            'complete blood count',
            'cbc',
            'hemoglobin',
            'white blood cell',
            'platelet count',
            'hematocrit',
            'neutrophils',
            'lymphocytes'
        ]
        
        # URE indicators
        ure_indicators = [
            'urea and electrolytes',
            'u&e',
            'ure',
            'sodium',
            'potassium',
            'creatinine',
            'egfr',
            'urea'
        ]
        
        # Count occurrences of each type of indicator
        cbc_count = sum(1 for indicator in cbc_indicators if indicator in text)
        ure_count = sum(1 for indicator in ure_indicators if indicator in text)
        
        # Determine test type based on indicator counts
        if cbc_count > ure_count and cbc_count >= 3:
            return 'CBC'
        elif ure_count > cbc_count and ure_count >= 3:
            return 'URE'
        
        return None

    @staticmethod
    def extract_value(text: str, parameter: str) -> Optional[float]:
        """
        Extract a numerical value for a given parameter from text
        """
        # Common patterns for value extraction
        patterns = [
            rf"{parameter}\s*[:=]\s*([\d.]+)",  # Pattern: "parameter: 12.3" or "parameter = 12.3"
            rf"{parameter}\s+([\d.]+)",         # Pattern: "parameter 12.3"
            rf"([\d.]+)\s*{parameter}",         # Pattern: "12.3 parameter"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except ValueError:
                    continue
        
        return None

    @staticmethod
    def extract_reference_range(text: str, parameter: str) -> Dict[str, float]:
        """
        Extract reference range for a parameter
        """
        # Common patterns for reference range extraction
        patterns = [
            rf"{parameter}.*?\(([\d.]+)\s*-\s*([\d.]+)\)",  # Pattern: "parameter (1.2-3.4)"
            rf"{parameter}.*?range:\s*([\d.]+)\s*-\s*([\d.]+)",  # Pattern: "parameter range: 1.2-3.4"
            rf"{parameter}.*?ref:\s*([\d.]+)\s*-\s*([\d.]+)",   # Pattern: "parameter ref: 1.2-3.4"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return {
                        'min': float(match.group(1)),
                        'max': float(match.group(2))
                    }
                except ValueError:
                    continue
        
        return {}

    def extract_cbc_data(self, text: str) -> Dict[str, Any]:
        """
        Extract CBC test result data from OCR text
        """
        data = {
            'test_type': 'CBC',
            'values': {},
            'reference_ranges': {}
        }
        
        # CBC parameters to extract
        parameters = {
            'hemoglobin': ['hb', 'hemoglobin'],
            'hematocrit': ['hct', 'hematocrit'],
            'red_blood_cells': ['rbc', 'red blood cells'],
            'mcv': ['mcv', 'mean corpuscular volume'],
            'mch': ['mch', 'mean corpuscular hemoglobin'],
            'mchc': ['mchc', 'mean corpuscular hemoglobin concentration'],
            'rdw': ['rdw', 'red cell distribution width'],
            'white_blood_cells': ['wbc', 'white blood cells', 'leukocytes'],
            'neutrophils_percent': ['neutrophils %', 'neut%'],
            'lymphocytes_percent': ['lymphocytes %', 'lymph%'],
            'monocytes_percent': ['monocytes %', 'mono%'],
            'eosinophils_percent': ['eosinophils %', 'eos%'],
            'basophils_percent': ['basophils %', 'baso%'],
            'platelets': ['plt', 'platelets'],
            'mpv': ['mpv', 'mean platelet volume']
        }
        
        # Extract values and reference ranges for each parameter
        for param, aliases in parameters.items():
            for alias in aliases:
                value = self.extract_value(text, alias)
                if value is not None:
                    data['values'][param] = value
                    ref_range = self.extract_reference_range(text, alias)
                    if ref_range:
                        data['reference_ranges'][param] = ref_range
                    break
        
        return data

    def extract_ure_data(self, text: str) -> Dict[str, Any]:
        """
        Extract URE test result data from OCR text
        """
        data = {
            'test_type': 'URE',
            'values': {},
            'reference_ranges': {}
        }
        
        # URE parameters to extract
        parameters = {
            'sodium': ['na', 'sodium'],
            'potassium': ['k', 'potassium'],
            'chloride': ['cl', 'chloride'],
            'bicarbonate': ['hco3', 'bicarbonate'],
            'urea': ['urea'],
            'creatinine': ['creat', 'creatinine'],
            'egfr': ['egfr', 'estimated gfr'],
            'calcium': ['ca', 'calcium'],
            'phosphate': ['phos', 'phosphate'],
            'magnesium': ['mg', 'magnesium'],
            'uric_acid': ['uric acid'],
            'glucose': ['glu', 'glucose']
        }
        
        # Extract values and reference ranges for each parameter
        for param, aliases in parameters.items():
            for alias in aliases:
                value = self.extract_value(text, alias)
                if value is not None:
                    data['values'][param] = value
                    ref_range = self.extract_reference_range(text, alias)
                    if ref_range:
                        data['reference_ranges'][param] = ref_range
                    break
        
        return data

    def process_ocr_text(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Process OCR text and extract structured test result data
        """
        try:
            # Determine test type
            test_type = self.determine_test_type(text)
            
            if test_type == 'CBC':
                return self.extract_cbc_data(text)
            elif test_type == 'URE':
                return self.extract_ure_data(text)
            
            return None
            
        except Exception as e:
            logger.error(f"Error processing OCR text: {str(e)}")
            return None