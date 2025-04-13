from ..models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue
from ..models.lab_result import LabResult
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class TestService:
    """
    Service class for working with test results using the flexible parameter approach
    """
    
    @staticmethod
    def create_test_result(lab_result, test_type_code, parameters):
        """
        Create a test result with parameters
        
        Args:
            lab_result: LabResult instance
            test_type_code: String code for the test type (e.g., "CBC", "URE")
            parameters: Dict of parameter values with parameter code as key
                        Example: {"HGB": 14.2, "HCT": 42.5}
        
        Returns:
            TestResult instance
        """
        try:
            test_type = TestType.objects.get(code=test_type_code)
        except TestType.DoesNotExist:
            raise ValueError(f"Test type with code {test_type_code} does not exist")
        
        with transaction.atomic():
            # Create test result
            test_result = TestResult.objects.create(
                lab_result=lab_result,
                test_type=test_type
            )
            
            # Create parameter values
            for param_code, value in parameters.items():
                try:
                    param_def = ParameterDefinition.objects.get(
                        code=param_code, 
                        test_types=test_type
                    )
                    
                    # Determine which field to use based on data type
                    value_fields = {
                        'numeric': {'numeric_value': value},
                        'text': {'text_value': value},
                        'boolean': {'boolean_value': value},
                        'categorical': {'text_value': value}
                    }
                    
                    # Get appropriate field for this parameter type
                    value_field = value_fields.get(param_def.data_type, {'text_value': str(value)})
                    
                    # Check if value is outside reference range
                    is_abnormal = TestService.check_if_abnormal(param_def, value)
                    
                    # Create parameter value
                    ParameterValue.objects.create(
                        test_result=test_result,
                        parameter=param_def,
                        is_abnormal=is_abnormal,
                        **value_field
                    )
                    
                except ParameterDefinition.DoesNotExist:
                    logger.warning(f"Parameter with code {param_code} does not exist for test type {test_type_code}")
            
            return test_result
    
    @staticmethod
    def check_if_abnormal(param_def, value):
        """Check if a value is outside the reference range"""
        if param_def.data_type != 'numeric' or not param_def.reference_range_json:
            return False
        
        # Simple range check
        if 'min' in param_def.reference_range_json and value < param_def.reference_range_json['min']:
            return True
        if 'max' in param_def.reference_range_json and value > param_def.reference_range_json['max']:
            return True
            
        # Gender-specific ranges (if provided)
        if isinstance(param_def.reference_range_json, dict):
            for gender in ['male', 'female']:
                if gender in param_def.reference_range_json:
                    gender_range = param_def.reference_range_json[gender]
                    if 'min' in gender_range and value < gender_range['min']:
                        return True
                    if 'max' in gender_range and value > gender_range['max']:
                        return True
        
        return False
    
    @staticmethod
    def get_test_result_as_dict(test_result):
        """
        Convert a TestResult with its parameter values to a dictionary
        
        Args:
            test_result: TestResult instance
        
        Returns:
            Dict with parameter values
        """
        result = {
            'test_id': test_result.id,
            'test_type': test_result.test_type.name,
            'test_code': test_result.test_type.code,
            'performed_at': test_result.performed_at,
            'parameters': {}
        }
        
        # Add parameters
        for param_value in test_result.parameter_values.select_related('parameter').all():
            param = param_value.parameter
            value = param_value.get_value()
            
            result['parameters'][param.code] = {
                'name': param.name,
                'value': value,
                'unit': param.unit,
                'is_abnormal': param_value.is_abnormal,
                'reference_range': param.reference_range_json
            }
        
        return result
        
    @staticmethod
    def get_latest_test_results_by_type(user, test_type_code=None):
        """
        Get the most recent test results for a user, optionally filtered by test type
        
        Args:
            user: User instance
            test_type_code: String code for the test type (e.g., "CBC", "URE"), or None for all
            
        Returns:
            List of TestResult instances
        """
        query = TestResult.objects.filter(lab_result__user=user)
        
        if test_type_code:
            query = query.filter(test_type__code=test_type_code)
            
        # Get the most recent tests (one per test type)
        latest_tests = {}
        for test in query.order_by('-performed_at'):
            test_code = test.test_type.code
            if test_code not in latest_tests:
                latest_tests[test_code] = test
                
        return list(latest_tests.values())
        
    @staticmethod
    def get_parameter_history(user, parameter_code, start_date=None, end_date=None):
        """
        Get historical values for a specific parameter for a user
        
        Args:
            user: User instance
            parameter_code: Parameter code (e.g., "HGB")
            start_date: Optional start date filter
            end_date: Optional end date filter
            
        Returns:
            List of dicts with date and value
        """
        query = ParameterValue.objects.filter(
            test_result__lab_result__user=user,
            parameter__code=parameter_code
        ).select_related('test_result', 'parameter')
        
        if start_date:
            query = query.filter(test_result__performed_at__gte=start_date)
        
        if end_date:
            query = query.filter(test_result__performed_at__lte=end_date)
            
        history = []
        for param_value in query.order_by('test_result__performed_at'):
            history.append({
                'date': param_value.test_result.performed_at,
                'value': param_value.get_value(),
                'is_abnormal': param_value.is_abnormal,
                'unit': param_value.parameter.unit
            })
            
        return history