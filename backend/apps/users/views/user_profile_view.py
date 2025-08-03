from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models.user import Users
from ..models.admin_profile import AdminProfile
from ..models.doctor_profile import DoctorProfile
from ..models.patient_profile import PatientProfile
from ..serializers.admin_profile_serializer import AdminProfileSerializer
from ..serializers.doctor_profile_serializer import DoctorProfileSerializer
from ..serializers.patient_profile_serializer import PatientProfileSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """ Retrieve & Update User Profile """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        print(f"User: {user}")  # Debugging line to check user type
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

    def retrieve(self, request, *args, **kwargs):
        try:
            # Get the associated profile for the user type
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            # Get basic user data
            user = self.request.user
            
            # Create the response with profile data and the user's name
            response_data = {
                **serializer.data,  # Include all profile data
                'name': user.name   # Add the user's name from the base user model
            }
            
            return Response(response_data)
        except Exception as e:
            print(f"Error retrieving user profile: {str(e)}")
            # If profile doesn't exist yet, still return the user's name
            user = self.request.user
            return Response({
                'name': user.name,
                'error': f"Profile not found: {str(e)}"
            })