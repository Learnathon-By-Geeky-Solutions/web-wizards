from rest_framework import serializers
from ..models.user import Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'email', 'name', 'user_type')

