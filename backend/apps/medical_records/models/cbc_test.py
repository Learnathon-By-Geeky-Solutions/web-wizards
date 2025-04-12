from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .lab_result import LabResult

class CBCTestResult(models.Model):
    """
    Model for Complete Blood Count (CBC) test results with specific parameters
    """
    lab_result = models.OneToOneField(
        LabResult, 
        on_delete=models.CASCADE, 
        related_name='cbc_details'
    )
    
    # Red blood cell parameters
    hemoglobin = models.FloatField(
        verbose_name="Hemoglobin (g/dL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    hematocrit = models.FloatField(
        verbose_name="Hematocrit (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    red_blood_cells = models.FloatField(
        verbose_name="Red Blood Cells (10^6/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    mcv = models.FloatField(
        verbose_name="Mean Corpuscular Volume (fL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    mch = models.FloatField(
        verbose_name="Mean Corpuscular Hemoglobin (pg)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    mchc = models.FloatField(
        verbose_name="Mean Corpuscular Hemoglobin Concentration (g/dL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    rdw = models.FloatField(
        verbose_name="Red Cell Distribution Width (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # White blood cell parameters
    white_blood_cells = models.FloatField(
        verbose_name="White Blood Cells (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    neutrophils_percent = models.FloatField(
        verbose_name="Neutrophils (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    lymphocytes_percent = models.FloatField(
        verbose_name="Lymphocytes (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    monocytes_percent = models.FloatField(
        verbose_name="Monocytes (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    eosinophils_percent = models.FloatField(
        verbose_name="Eosinophils (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    basophils_percent = models.FloatField(
        verbose_name="Basophils (%)",
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Absolute counts
    neutrophils_absolute = models.FloatField(
        verbose_name="Neutrophils (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    lymphocytes_absolute = models.FloatField(
        verbose_name="Lymphocytes (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    monocytes_absolute = models.FloatField(
        verbose_name="Monocytes (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    eosinophils_absolute = models.FloatField(
        verbose_name="Eosinophils (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    basophils_absolute = models.FloatField(
        verbose_name="Basophils (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Platelet parameters
    platelets = models.FloatField(
        verbose_name="Platelets (10^3/μL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    mpv = models.FloatField(
        verbose_name="Mean Platelet Volume (fL)",
        null=True, blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Reference ranges stored as JSON for flexibility
    reference_ranges = models.JSONField(
        default=dict,
        blank=True,
        help_text="Reference ranges for CBC parameters"
    )
    
    def __str__(self):
        return f"CBC Result for {self.lab_result}"
    
    class Meta:
        verbose_name = "CBC Test Result"
        verbose_name_plural = "CBC Test Results"