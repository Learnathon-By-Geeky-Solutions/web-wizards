from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from ..serializers.user_serializer import UserSerializer
from ..serializers.admin_profile_serializer import AdminProfileSerializer
from ..serializers.doctor_profile_serializer import DoctorProfileSerializer
from ..serializers.patient_profile_serializer import PatientProfileSerializer


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
                print("Patient profile serializer")
                profile_serializer = PatientProfileSerializer(data=profile_data)

            if profile_serializer.is_valid():
                print("profile_serializer is valid")
                profile_serializer.save()
                print(profile_serializer.data)
                refresh = RefreshToken.for_user(user)
                print(refresh)
                return Response({
                    "user": user_serializer.data,
                    "profile": profile_serializer.data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }, status=status.HTTP_201_CREATED)
            else:
                print("profile_serializer is not valid")
                print(profile_serializer.errors)  # Print the errors
                user.delete()
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("user_serializer is not valid")
            print(user_serializer.errors)  # Print the errors
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)