from django.db import models

class BaseModel(models.Model):
    """Base model for all clinician models with common fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        app_label = 'clinicians'