from django.db import models
from .base import BaseModel
from .medication_plan import MedicationPlan

class MedicationTime(BaseModel):
    """Model for storing specific times for medication intake"""
    
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday')
    ]
    
    medication_plan = models.ForeignKey(
        MedicationPlan,
        on_delete=models.CASCADE,
        related_name='medication_times'
    )
    
    # Time fields
    time = models.TimeField(help_text="The time to take this medication")
    
    # For specific days schedule
    day_of_week = models.IntegerField(
        choices=DAYS_OF_WEEK,
        null=True,
        blank=True,
        help_text="Day of week for specific day schedules"
    )
    
    # For daily schedule
    is_daily = models.BooleanField(
        default=False,
        help_text="Whether this time applies to every day"
    )
    
    # For cycle schedule
    is_active_cycle_day = models.BooleanField(
        default=True,
        help_text="Whether this time is for active cycle days or rest days"
    )
    
    # For "every X days" schedule
    day_in_cycle = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="The day in the cycle (1-based) for 'every X days' schedule"
    )
    
    # Dose specific for this time
    dose_override = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Override dose for this specific time if different from plan"
    )
    
    # Notes for this specific time
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['time']
    
    def __str__(self):
        day_str = ""
        if self.day_of_week is not None:
            day_str = f" on {self.get_day_of_week_display()}"
        return f"{self.medication_plan.medication_name} at {self.time}{day_str}"