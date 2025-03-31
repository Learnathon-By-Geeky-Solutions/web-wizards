from rest_framework import serializers
from ..models import HealthIssue

class HealthIssueSerializer(serializers.ModelSerializer):
    """Serializer for the HealthIssue model"""
    
    class Meta:
        model = HealthIssue
        fields = [
            'id', 'user', 'title', 'description', 
            'start_date', 'start_time', 'end_date', 'end_time', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """
        Validate that end date/time is after start date/time if provided
        """
        if 'end_date' in data and data['end_date'] is not None:
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError("End date must be after start date")
            
            # If dates are the same, check time
            if data['end_date'] == data['start_date'] and 'end_time' in data and 'start_time' in data:
                if data['end_time'] <= data['start_time']:
                    raise serializers.ValidationError("End time must be after start time on the same day")
        
        return data