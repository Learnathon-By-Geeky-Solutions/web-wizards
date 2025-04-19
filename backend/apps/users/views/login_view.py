from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from ..models.user import Users
from ..serializers.user_serializer import UserSerializer
from ..serializers.login_serializer import LoginSerializer

class LoginView(generics.GenericAPIView):
    """ User Login View """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = Users.objects.filter(email=email).first()

        if user and check_password(password, user.password):
            # Check if email is verified
            if not user.is_email_verified:
                return Response({
                    "detail": "Please verify your email before logging in.",
                    "email_verified": False,
                    "email": user.email
                }, status=status.HTTP_401_UNAUTHORIZED)
                
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)