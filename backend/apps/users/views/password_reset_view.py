from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils import timezone
import logging
from ..models.user import Users
from ..models.password_reset_token import PasswordResetToken
from ..serializers.password_reset_serializer import ForgotPasswordSerializer, ResetPasswordSerializer

# Set up logger
logger = logging.getLogger(__name__)

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
            
            try:
                # Check if user exists but don't reveal this in the response
                user_exists = Users.objects.filter(email=email).exists()
                
                if user_exists:
                    user = Users.objects.get(email=email)
                    
                    # Generate password reset token
                    token_obj = PasswordResetToken.generate_token(user)
                    
                    # Use FRONTEND_URL from settings
                    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token_obj.token}"
                    
                    # Send email with reset link - copied approach from registration_view.py
                    try:
                        logger.info(f"Attempting to send password reset email to {email}")
                        logger.info(f"Using FROM email: {settings.DEFAULT_FROM_EMAIL}")
                        
                        # Use the same email sending approach that works in the registration view
                        send_mail(
                            'Password Reset Request',
                            f'Click the link below to reset your password:\n\n{reset_url}\n\nThis link will expire in 24 hours.',
                            from_email=settings.DEFAULT_FROM_EMAIL,  # Explicitly set from_email parameter
                            recipient_list=[email],
                            fail_silently=True,  # Try setting fail_silently to True to match registration flow
                        )
                        logger.info(f"Password reset email successfully sent to {email}")
                    except Exception as e:
                        # Log the specific error for debugging
                        logger.error(f"Error sending password reset email to {email}: {str(e)}")
                        
                        # Continue with the flow even if email fails - consistent with registration
                        logger.info("Continuing despite email error")
                else:
                    # Log this for monitoring but don't reveal to user
                    logger.info(f"Password reset requested for non-existent email: {email}")
                
                # Always return success message regardless of whether email exists or whether sending succeeded
                # This prevents email enumeration attacks
                return Response(
                    {"message": "If an account with this email exists, a password reset link has been sent."},
                    status=status.HTTP_200_OK
                )
                
            except Exception as e:
                logger.error(f"Unexpected error in password reset: {str(e)}")
                return Response(
                    {"error": "An error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

class ResetPasswordView(APIView):
    """
    View for resetting password using a token
    Validates the token and sets a new password for the user
    """
    permission_classes = [AllowAny]
    
    def post(self, request, token=None):
        # Accept token either from URL path or request body
        request_data = request.data.copy()
        if token:
            # If token was provided in URL, use it
            request_data['token'] = token
            
        serializer = ResetPasswordSerializer(data=request_data)
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