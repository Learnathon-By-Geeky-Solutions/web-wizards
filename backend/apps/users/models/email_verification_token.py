import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from .user import Users


class EmailVerificationToken(models.Model):
    """Email verification token model for user account activation"""
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    @classmethod
    def generate_token(cls, user):
        """Generate a new verification token for a user"""
        token = str(uuid.uuid4())
        token_obj = cls.objects.create(
            user=user,
            token=token
        )
        return token_obj
    
    def is_valid(self):
        """Check if token is valid (not used and not expired)"""
        # Token expires after 24 hours
        expiration_time = self.created_at + timedelta(hours=24)
        return not self.is_used and timezone.now() < expiration_time
    
    def __str__(self):
        return f"Verification token for {self.user.email}"