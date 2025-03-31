from rest_framework import serializers
from ..models import LogbookEntry

class LogbookEntrySerializer(serializers.ModelSerializer):
    """Serializer for the LogbookEntry model"""
    
    class Meta:
        model = LogbookEntry
        fields = [
            'id', 'user', 'health_issue', 'entry_date', 
            'entry_time', 'title', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']