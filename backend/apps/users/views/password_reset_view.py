from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from ..models.user import Users
from ..models.password_reset_token import PasswordResetToken
from ..serializers.password_reset_serializer import ForgotPasswordSerializer, ResetPasswordSerializer


class ForgotPasswordView(APIView):
    """
    View for handling forgot password requests
    Initiates the password reset process by sending an email with a reset token
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = Users.objects.get(email=email)
            
            # Generate password reset token
            token_obj = PasswordResetToken.generate_token(user)
            
            # Construct the reset URL (frontend URL with token)
            reset_url = f"{request.data.get('frontend_url', 'http://localhost:5173')}/reset-password?token={token_obj.token}"
            
            # Send email with reset link
            try:
                send_mail(
                    'Password Reset Request',
                    f'Click the link below to reset your password:\n\n{reset_url}\n\nThis link will expire in 24 hours.',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
            except Exception as e:
                # In production, use proper logging instead of print
                print(f"Error sending email: {str(e)}")
                return Response(
                    {"error": "Could not send reset email. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

class ResetPasswordView(APIView):
    """
    View for resetting password using a token
    Validates the token and sets a new password for the user
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            password = serializer.validated_data['password']
            
            # Find the token in the database
            try:
                token_obj = PasswordResetToken.objects.get(token=token)
                
                # Check if token is valid
                if not token_obj.is_valid():
                    return Response(
                        {"error": "This reset link has expired or already been used."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Update the user's password
                user = token_obj.user
                user.password = make_password(password)
                user.save()
                
                # Mark token as used
                token_obj.used = True
                token_obj.save()
                
                return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
            
            except PasswordResetToken.DoesNotExist:
                return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)