from rest_framework import serializers
from ..models.medication_time import MedicationTime

class MedicationTimeSerializer(serializers.ModelSerializer):
    """Serializer for MedicationTime model"""
    day_of_week_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = MedicationTime
        fields = [
            'id', 'medication_plan', 'time', 'day_of_week', 'day_of_week_name',
            'is_daily', 'is_active_cycle_day', 'day_in_cycle', 
            'dose_override', 'notes', 'created_at', 'updated_at'
        ]