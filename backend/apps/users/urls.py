from django.urls import path
from .views.register_view import RegisterView
from .views.login_view import LoginView
from .views.user_profile_view import UserProfileView
from .views.logout_view import LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]