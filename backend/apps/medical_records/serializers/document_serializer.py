from rest_framework import serializers
from ..models import Document

class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for the Document model"""
    
    class Meta:
        model = Document
        fields = [
            'id', 'user', 'health_issue', 'title',
            'document_type', 'document_date', 'description',
            'file', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']