from django.db import models
from django.conf import settings
from .base import BaseModel
from .health_issue import HealthIssue

class LogbookEntry(BaseModel):
    """
    Model for tracking daily health logs that can be related to health issues.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='logbook_entries'
    )
    health_issue = models.ForeignKey(
        HealthIssue,
        on_delete=models.CASCADE,
        related_name='logbook_entries',
        null=True,
        blank=True
    )
    entry_date = models.DateField()
    entry_time = models.TimeField()
    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-entry_date', '-entry_time']
        verbose_name = 'Logbook Entry'
        verbose_name_plural = 'Logbook Entries'
    
    def __str__(self):
        return f"Log Entry: {self.title} - {self.entry_date}"