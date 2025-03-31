from rest_framework import serializers
from ..models import LabResult

class LabResultSerializer(serializers.ModelSerializer):
    """Serializer for the LabResult model"""
    
    class Meta:
        model = LabResult
        fields = [
            'id', 'user', 'health_issue', 'test_name',
            'test_date', 'result', 'reference_range', 'lab_name',
            'notes', 'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']