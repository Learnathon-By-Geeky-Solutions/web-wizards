from django.db import models
from django.conf import settings
from .base import BaseModel
from .medication import Medication

class MedicationPlan(BaseModel):
    """Model for storing individual patient medication plans"""
    
    class ScheduleType(models.TextChoices):
        WHEN_NEEDED = "when_needed", "When Needed"
        DAILY = "daily", "Daily"
        EVERY_X_DAYS = "every_x_days", "Every X Days"
        SPECIFIC_DAYS = "specific_days", "Specific Days of Week"
        CYCLE = "cycle", "Take X days and Rest Y days"

    class FrequencyType(models.TextChoices):
        TIMES_PER_DAY = "times_per_day", "X Times a Day"
        EVERY_X_HOURS = "every_x_hours", "Every X Hours"

    class DurationType(models.TextChoices):
        ONGOING = "ongoing", "Ongoing"
        FOR_X_DAYS = "for_x_days", "For X Days"
        UNTIL_DATE = "until_date", "Until Date"
    
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
    schedule_type = models.CharField(max_length=50, choices=ScheduleType.choices)
    every_x_days = models.PositiveIntegerField(null=True, blank=True, help_text="For 'Every X Days' schedule")
    specific_days_of_week = models.JSONField(null=True, blank=True, help_text="['mon','wed','fri']")
    cycle_active_days = models.PositiveIntegerField(default=0, help_text="Days to take medication in cycle")
    cycle_rest_days = models.PositiveIntegerField(default=0, help_text="Days to rest in cycle")
    
    # Frequency
    frequency_type = models.CharField(
        max_length=50, 
        choices=FrequencyType.choices, 
        default=FrequencyType.TIMES_PER_DAY
    )
    times_per_day = models.PositiveIntegerField(default=1)
    every_x_hours = models.PositiveIntegerField(null=True, blank=True)
    
    # Time of day
    exact_times = models.JSONField(null=True, blank=True, help_text='["08:00", "14:00"]')
    
    # Dose information
    dose_amount = models.CharField(max_length=100, help_text="e.g., '10mg', '1 tablet'")
    
    # Duration
    duration_type = models.CharField(
        max_length=50, 
        choices=DurationType.choices,
        default=DurationType.ONGOING
    )
    number_of_days = models.PositiveIntegerField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
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