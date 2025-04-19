from django.db import models
from django.utils import timezone
from datetime import timedelta
import secrets
from .user import Users

class PasswordResetToken(models.Model):
    """
    Model to store password reset tokens
    """
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    @classmethod
    def generate_token(cls, user):
        """
        Generate a random token for password reset
        """
        # Delete any existing tokens for this user
        cls.objects.filter(user=user).delete()
        
        # Generate a new token
        token = secrets.token_urlsafe(32)
        
        # Calculate expiration time (24 hours from now)
        expires_at = timezone.now() + timedelta(hours=24)
        
        # Create and return the token
        return cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )

    def is_valid(self):
        """
        Check if the token is valid (not used and not expired)
        """
        return not self.used and self.expires_at > timezone.now()