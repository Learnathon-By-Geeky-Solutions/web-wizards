from django.urls import path
from .views.register_view import RegisterView
from .views.login_view import LoginView
from .views.logout_view import LogoutView
from .views.user_profile_view import UserProfileView
#from .views.change_password_view import ChangePasswordView
#from .views.delete_account_view import DeleteAccountView
#from .views.verify_token_view import VerifyTokenView
from .views.oauth import GoogleLoginView, GoogleCallbackView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    #path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    #path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    #path('verify-token/', VerifyTokenView.as_view(), name='verify-token'),
    
    # OAuth endpoints
    path('google/login/', GoogleLoginView.as_view(), name='google_login'),
    path('google/callback/', GoogleCallbackView.as_view(), name='google_callback'),
]