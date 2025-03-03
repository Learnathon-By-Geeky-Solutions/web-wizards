from rest_framework import serializers
from .models import Users, AdminProfile, DoctorProfile, PatientProfile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from apps.users.models import Users, PatientProfile

User = get_user_model()


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



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate_email(self, value):
        """
        Check if the email exists in the database and generate a reset link.
        """
        try:
            user = Users.objects.get(email=value)  # Use correct model
        except Users.DoesNotExist:
            raise serializers.ValidationError("No user found with this email.")

        # Generate reset token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Generate reset link
        reset_link = f"http://127.0.0.1:5173/reset-password/{uid}/{token}"

        # Store reset_link in the serializer's context
        self.context["reset_link"] = reset_link

        return value

# ✅ Serializer for Resetting Password (After Clicking Reset Link)
class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validate the reset token and user.
        """
        uid = data.get('uidb64')
        token = data.get('token')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError):
            raise serializers.ValidationError({"uid": "Invalid user ID."})

        # Verify token
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": "Invalid or expired token."})

        return data
