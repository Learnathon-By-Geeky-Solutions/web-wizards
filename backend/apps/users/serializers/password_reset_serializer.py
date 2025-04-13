from rest_framework import serializers
from ..models.user import Users
import secrets
import string


class ForgotPasswordSerializer(serializers.Serializer):
    """
    Serializer for handling forgot password requests
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Check if the email exists in the database
        """
        if not Users.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is registered with this email address.")
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer for validating password reset tokens and setting new password
    """
    token = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        """
        Check that the passwords match
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"error": "Password fields didn't match."})
        return data