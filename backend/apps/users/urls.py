from django.urls import path
from .views import auth, oauth, profile, login_view, logout_view, password_reset_view, register_view, user_profile_view, email_verification_view

urlpatterns = [
    # Authentication endpoints
    path('register/', register_view.RegisterView.as_view(), name='register'),
    path('login/', login_view.LoginView.as_view(), name='login'),
    path('logout/', logout_view.LogoutView.as_view(), name='logout'),
    path('forgot-password/', password_reset_view.ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', password_reset_view.ResetPasswordView.as_view(), name='reset_password'),
    # Keep the old URL pattern temporarily for backward compatibility 
    path('reset-password/<str:token>/', password_reset_view.ResetPasswordView.as_view(), name='reset_password_with_token'),
    path('verify-email/<str:token>/', email_verification_view.VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', email_verification_view.ResendVerificationEmailView.as_view(), name='resend_verification'),
    path('check-email/', email_verification_view.CheckEmailExistsView.as_view(), name='check_email'),
    
    # New secure cookie management endpoints
    path('auth/set-refresh-cookie/', auth.SetRefreshCookieView.as_view(), name='set_refresh_cookie'),
    path('auth/clear-refresh-cookie/', auth.ClearRefreshCookieView.as_view(), name='clear_refresh_cookie'),
    
    # OAuth endpoints
    path('google/login/', oauth.GoogleLoginView.as_view(), name='google_login'),
    path('google/callback/', oauth.GoogleCallbackView.as_view(), name='google_callback'),
    
    # User profile endpoints
    path('profile/', user_profile_view.UserProfileView.as_view(), name='user_profile'),
    path('profile/upload-image/', profile.UploadProfileImageView.as_view(), name='upload_profile_image'),
    path('profile/update/', profile.UpdateProfileView.as_view(), name='update_profile'),
    #path('profile/avatar/', profile.UserAvatarView.as_view(), name='user_avatar'),
    
    # User management endpoints are temporarily commented out since the management module is missing
    # path('admin/users/', management.UserListView.as_view(), name='admin_users'),
    # path('admin/users/<int:pk>/', management.UserDetailView.as_view(), name='admin_user_detail'),
]