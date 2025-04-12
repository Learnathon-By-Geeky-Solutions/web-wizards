from django.contrib import admin
from .models.medication import Medication
from .models.medication_plan import MedicationPlan
from .models.notification import MedicationNotification
from .models.medication_time import MedicationTime

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

@admin.register(MedicationPlan)
class MedicationPlanAdmin(admin.ModelAdmin):
    list_display = ('medication_name', 'user', 'status', 'effective_date', 'schedule_type')
    list_filter = ('status', 'schedule_type')
    search_fields = ('custom_medication_name', 'medication__name', 'user__email')
    raw_id_fields = ('user', 'medication', 'health_issue')
    
    def medication_name(self, obj):
        if obj.medication:
            return obj.medication.name
        return obj.custom_medication_name
    
    medication_name.short_description = 'Medication'

@admin.register(MedicationNotification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'medication_plan', 'scheduled_time', 'status', 'is_enabled')
    list_filter = ('status', 'is_enabled')
    search_fields = ('user__email', 'message')
    raw_id_fields = ('user', 'medication_plan')

@admin.register(MedicationTime)
class MedicationTimeAdmin(admin.ModelAdmin):
    list_display = ('medication_plan', 'time', 'day_of_week', 'is_daily', 'dose_override')
    list_filter = ('is_daily', 'day_of_week', 'is_active_cycle_day')
    search_fields = ('medication_plan__custom_medication_name', 'medication_plan__medication__name', 'notes')
    raw_id_fields = ('medication_plan',)
