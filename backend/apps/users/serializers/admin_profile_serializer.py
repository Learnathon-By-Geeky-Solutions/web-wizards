from rest_framework import serializers
from ..models.admin_profile import AdminProfile
from .user_serializer import UserDetailSerializer

class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = '__all__'