from django.db import models
from django.conf import settings
from .base import BaseModel
from .health_issue import HealthIssue

class Symptom(BaseModel):
    """
    Model for tracking symptoms that can be associated with health issues.
    """
    SEVERITY_CHOICES = (
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='symptoms'
    )
    health_issue = models.ForeignKey(
        HealthIssue,
        on_delete=models.CASCADE,
        related_name='symptoms',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='mild')
    recorded_date = models.DateField()
    recorded_time = models.TimeField()
    duration = models.CharField(max_length=100, blank=True, help_text="e.g., '2 hours', '3 days'")
    
    class Meta:
        ordering = ['-recorded_date', '-recorded_time']
        verbose_name = 'Symptom'
        verbose_name_plural = 'Symptoms'
    
    def __str__(self):
        return f"{self.name} ({self.severity}) - {self.recorded_date}"