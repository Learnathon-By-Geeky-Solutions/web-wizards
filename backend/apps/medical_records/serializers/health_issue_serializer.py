from rest_framework import serializers
from ..models import HealthIssue

class HealthIssueSerializer(serializers.ModelSerializer):
    """Serializer for the HealthIssue model"""
    
    class Meta:
        model = HealthIssue
        fields = [
            'id', 'user', 'name', 'description', 
            'start_date', 'start_time', 'end_date', 'end_time', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']

    def validate_name(self, value):
        """Validate the name field"""
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty or whitespace")
        return value.strip()

    def validate(self, data):
        """
        Validate the complete health issue data
        """
        # Ensure required fields are present
        if not data.get('start_date'):
            raise serializers.ValidationError({"start_date": "Start date is required"})
            
        if not data.get('start_time'):
            raise serializers.ValidationError({"start_time": "Start time is required"})

        # Validate end date/time if provided
        if data.get('end_date'):
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError({"end_date": "End date must be after start date"})
            
            # If dates are the same, check time
            if data['end_date'] == data['start_date'] and data.get('end_time') and data.get('start_time'):
                if data['end_time'] <= data['start_time']:
                    raise serializers.ValidationError({"end_time": "End time must be after start time on the same day"})

        # Validate status
        if data.get('status') and data['status'] not in ['active', 'resolved', 'monitoring']:
            raise serializers.ValidationError({"status": "Invalid status value"})
        
        return data