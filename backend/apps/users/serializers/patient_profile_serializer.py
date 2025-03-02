from rest_framework import serializers
from ..models.user import Users
from ..models.patient_profile import PatientProfile
from .user_serializer import UserDetailSerializer


class PatientProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    
    class Meta:
        model = PatientProfile
        fields = '__all__'