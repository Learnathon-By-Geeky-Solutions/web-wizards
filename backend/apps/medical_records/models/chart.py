from django.db import models
from django.conf import settings
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
        ('other', 'Other'),
    )
    
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
    value = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-measurement_date', '-measurement_time']
        verbose_name = 'Chart Data'
        verbose_name_plural = 'Chart Data'
    
    def __str__(self):
        return f"{self.chart_type}: {self.value}{self.unit} - {self.measurement_date}"