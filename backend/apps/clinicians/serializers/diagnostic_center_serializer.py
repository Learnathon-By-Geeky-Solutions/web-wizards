from rest_framework import serializers
from ..models.diagnostic_center import DiagnosticCenter

class DiagnosticCenterSerializer(serializers.ModelSerializer):
    """Serializer for the DiagnosticCenter model"""
    
    class Meta:
        model = DiagnosticCenter
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'logo' in representation and representation['logo']:
            representation['logo_url'] = representation['logo']
        return representation