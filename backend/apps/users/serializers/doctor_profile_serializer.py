from rest_framework import serializers
from ..models.doctor_profile import DoctorProfile
from .user_serializer import UserDetailSerializer

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'