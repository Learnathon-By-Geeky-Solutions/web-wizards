from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
import random
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Users, AdminProfile, DoctorProfile, PatientProfile
from .serializers import (
    UserSerializer, AdminProfileSerializer, DoctorProfileSerializer, 
    PatientProfileSerializer, LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
)

class RegisterView(generics.CreateAPIView):
    """ User Registration View (Handles User and Profile) """
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """ Handles user and profile creation """
        data = request.data
        if data.get("password") != data.get("confirmPassword"):
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user_data = {
            "name": data.get("fullName"),
            "email": data.get("email"),
            "password": make_password(data.get("password")),
            "user_type": data.get("user_type")
        }

        profile_data = {
            "phone": data.get("phone"),
            "dob": data.get("dateOfBirth"),
            "gender": data.get("Gender"),
            "address": data.get("address"),
        }

        if data.get("user_type") == "Patient":
            profile_data.update({
                "blood_group": data.get("blood_group"),
                "blood_pressure": data.get("blood_pressure"),
                "height": data.get("height"),
                "weight": data.get("weight")
            })

        if data.get("user_type") == "Doctor":
            profile_data.update({
                "specialization": data.get("specialization"),
                "hospital": data.get("hospital"),
            })

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            profile_data["user"] = user.id

            if data.get("user_type") == "Admin":
                profile_serializer = AdminProfileSerializer(data=profile_data)
            elif data.get("user_type") == "Doctor":
                profile_serializer = DoctorProfileSerializer(data=profile_data)
            elif data.get("user_type") == "Patient":
                profile_serializer = PatientProfileSerializer(data=profile_data)

            if profile_serializer.is_valid():
                profile_serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "user": user_serializer.data,
                    "profile": profile_serializer.data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    """ User Login View """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = Users.objects.filter(email=email).first()

        if user and check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """ Retrieve & Update User Profile """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        if user.user_type == 'Admin':
            return AdminProfileSerializer
        elif user.user_type == 'Doctor':
            return DoctorProfileSerializer
        elif user.user_type == 'Patient':
            return PatientProfileSerializer

    def get_object(self):
        user = self.request.user
        if user.user_type == 'Admin':
            return AdminProfile.objects.get(user=user)
        elif user.user_type == 'Doctor':
            return DoctorProfile.objects.get(user=user)
        elif user.user_type == 'Patient':
            return PatientProfile.objects.get(user=user)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]  # Get email
            reset_link = serializer.context.get("reset_link")  # Get reset link

            # Send email with reset link        
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password:\n{reset_link}",
                from_email="wizardsweb7@gmail.com",
                recipient_list=[email],  # Use extracted email
                fail_silently=False,
            )

            return Response({"message": "Password reset link sent successfully!", "reset": reset_link}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            uidb64 = serializer.validated_data['uidb64']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']

            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = Users.objects.get(pk=uid)

                if default_token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    return Response({"message": "Password reset successful!"}, status=status.HTTP_200_OK)
                else:
                    print("Invalid token")
                    return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
                

            except Exception as e:
                print(str(e),"2")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

