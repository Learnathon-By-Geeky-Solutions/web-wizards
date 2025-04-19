from rest_framework import serializers
from ..models.user import Users
from ..models.patient_profile import PatientProfile
from .user_serializer import UserDetailSerializer


class PatientProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    
    class Meta:
        model = PatientProfile
        fields = '__all__'
        extra_kwargs = {
            'address': {'required': False},
            'blood_group': {'required': False},
            'blood_pressure': {'required': False}
        }
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure the image field is serialized as a valid URL
        if representation.get('image'):
            # Extract the secure URL if the image field contains a Cloudinary resource
            representation['image'] = instance.image.url if instance.image else ''
        return representation