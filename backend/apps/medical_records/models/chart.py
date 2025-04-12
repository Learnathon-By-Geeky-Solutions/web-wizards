from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from .base import BaseModel
from .health_issue import HealthIssue

class Chart(BaseModel):
    """
    Model for storing health measurement data that can be visualized in charts.
    Can be associated with health issues.
    """
    CHART_TYPE_CHOICES = (
        ('blood_pressure', 'Blood Pressure'),
        ('blood_sugar', 'Blood Sugar'),
        ('weight', 'Weight'),
        ('temperature', 'Temperature'),
        ('heart_rate', 'Heart Rate'),
        ('oxygen_saturation', 'Oxygen Saturation'),
        ('respiratory_rate', 'Respiratory Rate'),
        ('height', 'Height'),
        ('other', 'Other'),
    )

    def get_validators_for_type(chart_type):
        """Returns min and max validators based on chart type"""
        validators = {
            'temperature': (35, 43),  # Normal human temp range in Celsius
            'blood_sugar': (20, 600),  # mg/dL
            'weight': (0, 500),  # kg
            'height': (0, 300),  # cm
            'oxygen_saturation': (0, 100),  # percentage
            'respiratory_rate': (0, 60),  # breaths per minute
            'heart_rate': (0, 250),  # beats per minute
        }
        if chart_type in validators:
            min_val, max_val = validators[chart_type]
            return [MinValueValidator(min_val), MaxValueValidator(max_val)]
        return []
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='charts'
    )
    health_issue = models.ForeignKey(
        HealthIssue,
        on_delete=models.CASCADE,
        related_name='charts',
        null=True,
        blank=True
    )
    chart_type = models.CharField(max_length=20, choices=CHART_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    measurement_date = models.DateField()
    measurement_time = models.TimeField()
    value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[]  # Will be set dynamically
    )
    unit = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-measurement_date', '-measurement_time']
        verbose_name = 'Chart Data'
        verbose_name_plural = 'Chart Data'
    
    def __str__(self):
        return f"{self.chart_type}: {self.value}{self.unit} - {self.measurement_date}"

    def clean(self):
        """Add dynamic validators based on chart_type"""
        super().clean()
        self.value.validators = self.get_validators_for_type(self.chart_type)