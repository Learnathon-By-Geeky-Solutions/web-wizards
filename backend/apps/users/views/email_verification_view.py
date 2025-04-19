from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from ..models.user import Users
from ..models.email_verification_token import EmailVerificationToken


class VerifyEmailView(APIView):
    """
    Verify a user's email using the token sent during registration
    """
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        """Handle GET requests for email verification via token link"""
        try:
            # Look up the token
            token_obj = EmailVerificationToken.objects.get(token=token)
            
            # Check if token is valid (not expired, not used)
            if token_obj.is_valid():
                # Get user and mark as verified
                user = token_obj.user
                user.is_email_verified = True
                user.save()
                
                # Mark token as used
                token_obj.is_used = True
                token_obj.save()
                
                return Response({
                    "message": "Email verification successful. Your account is now active."
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "This verification link has expired or already been used."
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except EmailVerificationToken.DoesNotExist:
            return Response({
                "error": "Invalid verification token."
            }, status=status.HTTP_400_BAD_REQUEST)


class CheckEmailExistsView(APIView):
    """
    Check if an email already exists in the system
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle POST requests to check if email exists"""
        email = request.data.get('email')
        
        if not email:
            return Response({
                "error": "Email is required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        exists = Users.objects.filter(email=email).exists()
        return Response({
            "exists": exists,
            "message": "Email is already registered." if exists else "Email is available."
        }, status=status.HTTP_200_OK)


class ResendVerificationEmailView(APIView):
    """
    Resend verification email for users who haven't verified yet
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle POST requests to resend verification email"""
        email = request.data.get('email')
        
        if not email:
            return Response({
                "error": "Email is required."
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Find the user by email
            user = Users.objects.get(email=email)
            
            # Check if the user is already verified
            if user.is_email_verified:
                return Response({
                    "message": "Email is already verified. Please login."
                }, status=status.HTTP_200_OK)
                
            # Generate a new token
            token_obj = EmailVerificationToken.generate_token(user)
            
            # Use FRONTEND_URL from settings instead of from request data
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{token_obj.token}"
            
            # Send verification email - always try to send a real email
            send_mail(
                'Verify Your Email Address',
                f'Please click the link below to verify your email address:\n\n{verification_url}\n\nThis link will expire in 24 hours.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response({
                "message": "Verification email has been sent."
            }, status=status.HTTP_200_OK)
            
        except Users.DoesNotExist:
            # For security reasons, don't reveal if the email exists or not
            return Response({
                "message": "If your email exists in our system, a verification link will be sent."
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # If there's an error sending the email, return a 500 status
            return Response({
                "error": f"Could not send verification email: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)