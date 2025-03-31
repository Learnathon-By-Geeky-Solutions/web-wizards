from django.db import models
from django.conf import settings
from .base import BaseModel

class HealthIssue(BaseModel):
    """
    Model for tracking health issues reported by patients.
    """
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('monitoring', 'Monitoring'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='health_issues'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    start_time = models.TimeField()
    end_date = models.DateField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    class Meta:
        ordering = ['-start_date', '-start_time']
        verbose_name = 'Health Issue'
        verbose_name_plural = 'Health Issues'

    def __str__(self):
        return f"{self.title} - {self.user.name}"