from rest_framework import serializers
from ..models import Symptom

class SymptomSerializer(serializers.ModelSerializer):
    """Serializer for the Symptom model"""
    
    class Meta:
        model = Symptom
        fields = [
            'id', 'user', 'health_issue', 'name', 
            'description', 'severity', 'recorded_date', 
            'recorded_time', 'duration', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']