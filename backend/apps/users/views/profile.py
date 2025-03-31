from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models.patient_profile import PatientProfile
from ..models.user import Users
from ..serializers.patient_profile_serializer import PatientProfileSerializer
from ..serializers.user_serializer import UserDetailSerializer
import cloudinary
import cloudinary.uploader


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            # Get or create patient profile
            patient_profile, created = PatientProfile.objects.get_or_create(user=user)
            
            # Serialize the profile data
            profile_data = PatientProfileSerializer(patient_profile).data
            user_data = UserDetailSerializer(user).data
            
            # Combine the data
            combined_data = {
                **profile_data,
                'user': user_data
            }
            
            return Response(combined_data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        try:
            # Get or create patient profile
            patient_profile, created = PatientProfile.objects.get_or_create(user=user)
            
            # Check if image file is in the request
            if 'image' not in request.FILES:
                return Response({'error': 'No image file provided'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            image_file = request.FILES['image']
            
            # If there's an existing image, it will be replaced in Cloudinary automatically
            # Upload to Cloudinary with user-specific public_id to ensure replacement
            public_id = f"patient_profile_{user.id}"
            upload_result = cloudinary.uploader.upload(
                image_file,
                folder="patient_profiles",
                public_id=public_id,
                overwrite=True,
                resource_type="image"
            )
            
            # Update the profile with the new image URL
            patient_profile.image = upload_result['secure_url']
            patient_profile.save()
            
            return Response({
                'message': 'Profile image uploaded successfully',
                'image': upload_result['secure_url']
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        try:
            # Get or create patient profile
            patient_profile, created = PatientProfile.objects.get_or_create(user=user)
            
            # Update only the fields provided in the request
            serializer = PatientProfileSerializer(
                patient_profile, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                
                # Recalculate BMI if height and weight are provided
                if 'height' in request.data and 'weight' in request.data:
                    height = float(request.data['height'])
                    weight = float(request.data['weight'])
                    if height > 0:
                        bmi = weight / ((height/100) ** 2)
                        patient_profile.bmi = f"{bmi:.2f}"
                        patient_profile.save()
                
                return Response({
                    'message': 'Profile updated successfully',
                    'profile': PatientProfileSerializer(patient_profile).data
                })
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
