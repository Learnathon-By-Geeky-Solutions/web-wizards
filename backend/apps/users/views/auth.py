from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from datetime import datetime, timedelta

class SetRefreshCookieView(APIView):
    """
    Sets an HttpOnly cookie with the refresh token.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate expiry date (match SIMPLE_JWT settings)
        expiry_date = datetime.now() + settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', timedelta(days=7))
        
        # Create response
        response = Response({"detail": "Refresh token cookie set"})
        
        # Set cookie with secure settings
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,  # JavaScript can't access
            secure=not settings.DEBUG,  # HTTPS only in production
            samesite='Strict',  # Prevent CSRF
            expires=expiry_date,
            path='/',  # Changed from '/api/token/' to '/' to be available for all API endpoints
        )
        
        return response


class ClearRefreshCookieView(APIView):
    """
    Clears the HttpOnly refresh token cookie.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Refresh token cookie cleared"})
        response.delete_cookie('refresh_token', path='/')
        return response