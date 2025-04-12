from rest_framework import serializers
from ..models.clinician import Clinician, Specialization
from .specialization_serializer import SpecializationSerializer

class ClinicianSerializer(serializers.ModelSerializer):
    """Serializer for the Clinician model"""
    specializations = SpecializationSerializer(many=True, read_only=True)
    specialization_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        write_only=True, 
        source='specializations',
        queryset=Specialization.objects.all(),
        required=False
    )
    
    class Meta:
        model = Clinician
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'image' in representation and representation['image']:
            representation['image_url'] = representation['image']
        return representation