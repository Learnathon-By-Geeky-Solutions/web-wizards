from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
import logging
from ..serializers.user_serializer import UserSerializer
from ..serializers.admin_profile_serializer import AdminProfileSerializer
from ..serializers.doctor_profile_serializer import DoctorProfileSerializer
from ..serializers.patient_profile_serializer import PatientProfileSerializer
from ..models.email_verification_token import EmailVerificationToken

# Set up logger
logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    """ User Registration View (Handles User and Profile) """
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """ Handles user and profile creation """
        data = request.data
        if data.get("password") != data.get("confirmPassword"):
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        # Default to 'Patient' if user_type not provided
        user_type = data.get("user_type", "Patient")
        
        user_data = {
            "name": data.get("fullName"),
            "email": data.get("email"),
            "password": make_password(data.get("password")),
            "user_type": user_type,
            "is_email_verified": False  # Set to False until verified
        }

        profile_data = {
            "phone": data.get("phone"),
            "dob": data.get("dateOfBirth"),
            "gender": data.get("gender") or data.get("Gender"),
            # Address is now optional - only add if provided
        }
        
        # Only add optional fields to profile_data if they're provided
        if data.get("address"):
            profile_data["address"] = data.get("address")

        if user_type == "Patient":
            # Only add blood_group and blood_pressure if they're provided
            if data.get("blood_group"):
                profile_data["blood_group"] = data.get("blood_group")
            if data.get("blood_pressure"):
                profile_data["blood_pressure"] = data.get("blood_pressure")
            # Add other patient fields that may be provided
            if data.get("height"):
                profile_data["height"] = data.get("height")
            if data.get("weight"):
                profile_data["weight"] = data.get("weight")

        if user_type == "Doctor":
            profile_data.update({
                "specialization": data.get("specialization"),
                "hospital": data.get("hospital"),
            })

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            profile_data["user"] = user.id

            if user_type == "Admin":
                profile_serializer = AdminProfileSerializer(data=profile_data)
            elif user_type == "Doctor":
                profile_serializer = DoctorProfileSerializer(data=profile_data)
            elif user_type == "Patient":
                profile_serializer = PatientProfileSerializer(data=profile_data)

            if profile_serializer.is_valid():
                profile_serializer.save()
                
                # Generate verification token
                token_obj = EmailVerificationToken.generate_token(user)
                
                # Use FRONTEND_URL from settings instead of from request data
                verification_url = f"{settings.FRONTEND_URL}/verify-email/{token_obj.token}"
                
                # Send verification email - always try to send a real email
                send_mail(
                    'Verify Your Email Address',
                    f'Welcome to Ibn Sina! Please click the link below to verify your email address:\n\n{verification_url}\n\nThis link will expire in 24 hours.',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                
                # Return success response
                return Response({
                    "message": "Registration successful! Please check your email to verify your account.",
                    "user": user_serializer.data,
                    "profile": profile_serializer.data,
                }, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)