from django.db import models
from django.conf import settings
from .base import BaseModel
from .medication import Medication

class MedicationPlan(BaseModel):
    """Model for storing individual patient medication plans"""
    SCHEDULE_CHOICES = [
        ('when_needed', 'When Needed'),
        ('every_x_days', 'Every X Days'),
        ('daily', 'Daily'),
        ('specific_days', 'Specific Days'),
        ('cycle', 'Take X Days, Rest Y Days'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]
    
    NOTIFICATION_CHOICES = [
        (0, 'No notification'),
        (5, '5 minutes before'),
        (10, '10 minutes before'),
        (15, '15 minutes before'),
        (30, '30 minutes before'),
        (60, '1 hour before'),
        (120, '2 hours before'),
        (1440, '1 day before'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medication_plans'
    )
    medication = models.ForeignKey(
        Medication,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='plans'
    )
    custom_medication_name = models.CharField(max_length=255, blank=True, null=True, 
                                              help_text="Used when medication is not in database")
    
    # Basic information
    description = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True, help_text="Instructions for taking the medication")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    effective_date = models.DateField()
    effective_time = models.TimeField()
    
    # Schedule information
    schedule_type = models.CharField(max_length=20, choices=SCHEDULE_CHOICES)
    frequency_days = models.PositiveIntegerField(default=1, help_text="For 'Every X Days' schedule")
    specific_days = models.CharField(max_length=100, blank=True, null=True, 
                                     help_text="Comma-separated days of week (e.g., 'Mon,Wed,Fri')")
    cycle_active_days = models.PositiveIntegerField(default=0, help_text="Days to take medication in cycle")
    cycle_rest_days = models.PositiveIntegerField(default=0, help_text="Days to rest in cycle")
    
    # Dose information
    dose_amount = models.CharField(max_length=100, help_text="e.g., '10mg', '1 tablet'")
    times_per_day = models.PositiveIntegerField(default=1)
    
    # Duration
    end_date = models.DateField(null=True, blank=True, help_text="Leave blank if ongoing")
    
    # Health issue connection
    health_issue = models.ForeignKey(
        'medical_records.HealthIssue',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medication_plans'
    )
    
    # Notification settings
    notification_time = models.PositiveIntegerField(
        choices=NOTIFICATION_CHOICES,
        default=30,
        help_text="When to send notification before medication time"
    )
    
    notifications_enabled = models.BooleanField(
        default=True,
        help_text="Whether notifications are enabled for this medication plan"
    )
    
    # Additional notes
    notes = models.TextField(blank=True, null=True)
    
    @property
    def medication_name(self):
        """Returns medication name from related medication or custom name"""
        if self.medication:
            return self.medication.name
        return self.custom_medication_name
    
    def __str__(self):
        return f"{self.medication_name or 'Unnamed'} - {self.effective_date}"