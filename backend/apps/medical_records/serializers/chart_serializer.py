from rest_framework import serializers
from ..models import Chart

class ChartSerializer(serializers.ModelSerializer):
    """Serializer for the Chart model"""
    
    class Meta:
        model = Chart
        fields = [
            'id', 'user', 'health_issue', 'chart_type', 
            'title', 'measurement_date', 'measurement_time',
            'value', 'unit', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']