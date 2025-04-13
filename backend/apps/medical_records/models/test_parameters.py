from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .lab_result import LabResult

class TestType(models.Model):
    """Defines available medical test types"""
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    class Meta:
        verbose_name = "Test Type"
        verbose_name_plural = "Test Types"


class ParameterDefinition(models.Model):
    """Defines parameters that can be measured in tests"""
    DATA_TYPE_CHOICES = [
        ('numeric', 'Numeric'),
        ('text', 'Text'),
        ('boolean', 'Boolean'),
        ('categorical', 'Categorical')
    ]
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    unit = models.CharField(max_length=50, blank=True)
    data_type = models.CharField(max_length=20, choices=DATA_TYPE_CHOICES, default='numeric')
    min_value = models.FloatField(null=True, blank=True)  # For numeric validation
    max_value = models.FloatField(null=True, blank=True)  # For numeric validation
    reference_range_json = models.JSONField(default=dict, blank=True)
    test_types = models.ManyToManyField(TestType, related_name='parameters')
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    class Meta:
        verbose_name = "Parameter Definition"
        verbose_name_plural = "Parameter Definitions"
        # Removing test_types from unique_together since ManyToManyFields are not allowed in unique_together
        # If uniqueness is needed for code alone, you can use:
        # unique_together = [] or remove unique_together entirely


class TestResult(models.Model):
    """Core model for any test result"""
    lab_result = models.ForeignKey(LabResult, on_delete=models.CASCADE, related_name='test_results')
    test_type = models.ForeignKey(TestType, on_delete=models.PROTECT)
    performed_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)  # For test-specific metadata
    
    def __str__(self):
        return f"{self.test_type.name} for {self.lab_result}"
    
    class Meta:
        verbose_name = "Test Result"
        verbose_name_plural = "Test Results"


class ParameterValue(models.Model):
    """Stores individual parameter values for a test"""
    test_result = models.ForeignKey(TestResult, on_delete=models.CASCADE, related_name='parameter_values')
    parameter = models.ForeignKey(ParameterDefinition, on_delete=models.PROTECT)
    numeric_value = models.FloatField(null=True, blank=True)
    text_value = models.TextField(null=True, blank=True)
    boolean_value = models.BooleanField(null=True, blank=True)
    is_abnormal = models.BooleanField(default=False)
    
    def get_value(self):
        """Returns the appropriate value based on parameter type"""
        param_type = self.parameter.data_type
        if param_type == 'numeric':
            return self.numeric_value
        elif param_type in ['text', 'categorical']:
            return self.text_value
        elif param_type == 'boolean':
            return self.boolean_value
        return None
    
    def __str__(self):
        return f"{self.parameter.name}: {self.get_value()}"
    
    class Meta:
        verbose_name = "Parameter Value"
        verbose_name_plural = "Parameter Values"