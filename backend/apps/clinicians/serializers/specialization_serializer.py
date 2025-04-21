from rest_framework import serializers
from ..models.clinician import Specialization

class SpecializationSerializer(serializers.ModelSerializer):
    """Serializer for the Specialization model"""
    
    class Meta:
        model = Specialization
        fields = '__all__'