from django.db import models
from django.conf import settings
from .base import BaseModel
from .clinician import Clinician
from .diagnostic_center import DiagnosticCenter

class Review(BaseModel):
    """Model for reviews of clinicians and diagnostic centers"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    # The review can be for either a clinician or a diagnostic center
    clinician = models.ForeignKey(
        Clinician,
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True
    )
    
    diagnostic_center = models.ForeignKey(
        DiagnosticCenter,
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True
    )
    
    rating = models.PositiveSmallIntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],
        help_text="Rating from 1 to 5"
    )
    
    comment = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        constraints = [
            # Ensure the review is for either a clinician or a diagnostic center, not both
            models.CheckConstraint(
                check=(
                    models.Q(clinician__isnull=False, diagnostic_center__isnull=True) |
                    models.Q(clinician__isnull=True, diagnostic_center__isnull=False)
                ),
                name='review_either_clinician_or_center'
            )
        ]
    
    def __str__(self):
        if self.clinician:
            return f"Review for {self.clinician.name} by {self.user.name}"
        return f"Review for {self.diagnostic_center.name} by {self.user.name}"
    
    def save(self, *args, **kwargs):
        # Update average rating for the clinician or diagnostic center
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if self.clinician:
            self._update_rating(self.clinician, is_new)
        elif self.diagnostic_center:
            self._update_rating(self.diagnostic_center, is_new)
    
    def _update_rating(self, entity, is_new):
        """Update the average rating for an entity (clinician or diagnostic center)."""
        reviews = entity.reviews.all()
        total_ratings = sum(review.rating for review in reviews)
        count = reviews.count()
        
        entity.average_rating = total_ratings / count if count > 0 else 0
        entity.rating_count = count
        entity.save(update_fields=['average_rating', 'rating_count'])