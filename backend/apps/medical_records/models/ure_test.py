from django.db import models
from django.core.validators import MinValueValidator
from .lab_result import LabResult

class URETestResult(models.Model):
    """
    Model for Urea and Electrolytes (URE) test results with specific parameters
    """
    lab_result = models.OneToOneField(
        LabResult, 
        on_delete=models.CASCADE, 
        related_name='ure_details'
    )
    
    # Urea and electrolytes parameters
    sodium = models.FloatField(
        verbose_name="Sodium (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    potassium = models.FloatField(
        verbose_name="Potassium (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    chloride = models.FloatField(
        verbose_name="Chloride (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    bicarbonate = models.FloatField(
        verbose_name="Bicarbonate (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    urea = models.FloatField(
        verbose_name="Urea (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    creatinine = models.FloatField(
        verbose_name="Creatinine (μmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    egfr = models.FloatField(
        verbose_name="eGFR (mL/min/1.73m²)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Additional parameters often included in URE panels
    calcium = models.FloatField(
        verbose_name="Calcium (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    phosphate = models.FloatField(
        verbose_name="Phosphate (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    magnesium = models.FloatField(
        verbose_name="Magnesium (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    uric_acid = models.FloatField(
        verbose_name="Uric Acid (μmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    glucose = models.FloatField(
        verbose_name="Glucose (mmol/L)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Reference ranges stored as JSON for flexibility
    reference_ranges = models.JSONField(
        default=dict,
        blank=True,
        help_text="Reference ranges for URE parameters"
    )
    
    def __str__(self):
        return f"URE Result for {self.lab_result}"
    
    class Meta:
        verbose_name = "URE Test Result"
        verbose_name_plural = "URE Test Results"