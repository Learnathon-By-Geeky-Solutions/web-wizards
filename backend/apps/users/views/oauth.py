# apps/users/views/oauth.py
import os
import requests
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import Users


class GoogleLoginView(APIView):
    """
    Initiates the OAuth2 authentication flow with Google
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get the redirect URI from request or use default
        redirect_uri = request.GET.get('redirect_uri', 'http://localhost:5173/google-callback')
        
        # Google OAuth2 authorization URL
        client_id = os.environ.get('GOOGLE_CLIENT_ID')
        scope = 'email profile openid'
        
        # Build the Google authorization URL
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&scope={scope}&redirect_uri={redirect_uri}&prompt=select_account"
        
        # Redirect the user to Google's authorization page
        return Response({"auth_url": auth_url}, status=status.HTTP_200_OK)


class GoogleCallbackView(APIView):
    """
    Handles the callback from Google OAuth2 and creates/authenticates the user
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code is missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Exchange the authorization code for tokens
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
            redirect_uri = os.environ.get('GOOGLE_CALLBACK_URL', 'http://localhost:5173/google-callback')
            
            # Exchange code for access token
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }
            
            token_response = requests.post(token_url, data=token_data)
            if token_response.status_code != 200:
                return Response({'error': 'Failed to get access token'}, status=status.HTTP_400_BAD_REQUEST)
            
            token_json = token_response.json()
            access_token = token_json.get('access_token')
            
            # Get user info using the access token
            user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
            user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
            
            if user_info_response.status_code != 200:
                return Response({'error': 'Failed to get user info'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_info = user_info_response.json()
            
            # Extract user data
            email = user_info.get('email')
            name = user_info.get('name')
            given_name = user_info.get('given_name', '')
            family_name = user_info.get('family_name', '')
            picture = user_info.get('picture', '')
            
            # Check if user exists, create if not
            try:
                user = Users.objects.get(email=email)
            except Users.DoesNotExist:
                # Create a new user with the email as username
                user = Users.objects.create(
                    email=email,
                    name=name or given_name,
                    user_type="Patient"  # Default user type
                )
                # Set an unusable password for security
                user.set_password(None)
                user.save()
            
            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                'access': access_token,
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'user_type': user.user_type
                }
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def get_tokens_for_user(user):
    """
    Generate JWT tokens for a user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }