from django.db import models
from cloudinary.models import CloudinaryField
from .base import BaseModel

class DiagnosticCenter(BaseModel):
    """Model for diagnostic centers and medical facilities"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    services = models.TextField(blank=True, null=True, 
                             help_text="List of services offered by the diagnostic center")
    
    # Contact and location info
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Online presence
    website = models.URLField(blank=True, null=True)
    
    # Profile image and gallery
    logo = CloudinaryField('logo', null=True, blank=True)
    
    # Opening hours
    opening_hours = models.TextField(blank=True, null=True, 
                                  help_text="Description of opening hours")
    
    # Additional details
    is_24_hours = models.BooleanField(default=False)
    has_home_collection = models.BooleanField(default=False)
    accepts_insurance = models.BooleanField(default=False)
    insurance_details = models.TextField(blank=True, null=True)
    
    # Rating
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name