from rest_framework import serializers
from .models import Users, AdminProfile, DoctorProfile, PatientProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'email', 'name', 'user_type')


class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = '__all__'


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'


class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)