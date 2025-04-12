from django.db import models
from django.conf import settings
from .base import BaseModel
from .medication_plan import MedicationPlan

class MedicationNotification(BaseModel):
    """Model for scheduling medication notifications/reminders"""
    
    REMINDER_TIME_CHOICES = [
        (5, '5 minutes before'),
        (10, '10 minutes before'),
        (15, '15 minutes before'),
        (30, '30 minutes before'),
        (60, '1 hour before'),
        (120, '2 hours before'),
        (1440, '1 day before'),
    ]
    
    NOTIFICATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('read', 'Read'),
        ('dismissed', 'Dismissed'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medication_notifications'
    )
    
    medication_plan = models.ForeignKey(
        MedicationPlan,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    remind_before_minutes = models.PositiveIntegerField(
        choices=REMINDER_TIME_CHOICES,
        default=30,
        help_text="How many minutes before medication time to send notification"
    )
    
    scheduled_time = models.DateTimeField(
        help_text="When the notification is scheduled to be sent"
    )
    
    notification_time = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When the notification was actually sent"
    )
    
    status = models.CharField(
        max_length=20,
        choices=NOTIFICATION_STATUS_CHOICES,
        default='pending'
    )
    
    message = models.TextField(
        help_text="The notification message"
    )
    
    is_enabled = models.BooleanField(
        default=True,
        help_text="Whether this notification is enabled"
    )
    
    def __str__(self):
        return f"Notification for {self.medication_plan.medication_name} - {self.scheduled_time}"