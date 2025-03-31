from django.db import models
from django.conf import settings
from .base import BaseModel
from .health_issue import HealthIssue
import cloudinary.models

class Document(BaseModel):
    """
    Model for storing medical documents that can be associated with health issues.
    """
    DOCUMENT_TYPE_CHOICES = (
        ('prescription', 'Prescription'),
        ('medical_report', 'Medical Report'),
        ('imaging', 'Imaging'),
        ('discharge_summary', 'Discharge Summary'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    health_issue = models.ForeignKey(
        HealthIssue,
        on_delete=models.CASCADE,
        related_name='documents',
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    document_date = models.DateField()
    description = models.TextField(blank=True)
    file = cloudinary.models.CloudinaryField('document', blank=True, null=True)
    
    class Meta:
        ordering = ['-document_date']
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
    
    def __str__(self):
        return f"{self.title} ({self.document_type}) - {self.document_date}"