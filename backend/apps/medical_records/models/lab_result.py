from django.db import models
from django.conf import settings
from .base import BaseModel
from .health_issue import HealthIssue
import cloudinary.models

class LabResult(BaseModel):
    """
    Model for storing laboratory test results that can be associated with health issues.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lab_results'
    )
    health_issue = models.ForeignKey(
        HealthIssue,
        on_delete=models.CASCADE,
        related_name='lab_results',
        null=True,
        blank=True
    )
    test_name = models.CharField(max_length=255)
    test_date = models.DateField()
    result = models.TextField()
    reference_range = models.CharField(max_length=255, blank=True)
    lab_name = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    image = cloudinary.models.CloudinaryField('image', blank=True, null=True)
    
    class Meta:
        ordering = ['-test_date']
        verbose_name = 'Lab Result'
        verbose_name_plural = 'Lab Results'
    
    def __str__(self):
        return f"{self.test_name} - {self.test_date}"