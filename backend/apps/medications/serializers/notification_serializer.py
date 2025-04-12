from rest_framework import serializers
from ..models.notification import MedicationNotification
from .medication_plan_serializer import MedicationPlanSerializer

class MedicationNotificationSerializer(serializers.ModelSerializer):
    medication_plan_data = MedicationPlanSerializer(source='medication_plan', read_only=True)
    
    class Meta:
        model = MedicationNotification
        fields = [
            'id', 'user', 'medication_plan', 'medication_plan_data',
            'scheduled_time', 'message', 'status', 'is_enabled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']