from rest_framework import serializers
from ..models import LogbookEntry

class LogbookEntrySerializer(serializers.ModelSerializer):
    """Serializer for the LogbookEntry model"""
    
    vital_signs = serializers.JSONField(required=False)

    class Meta:
        model = LogbookEntry
        fields = [
            'id', 'user', 'health_issue', 'entry_date', 
            'entry_time', 'title', 'notes', 'vital_signs',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']