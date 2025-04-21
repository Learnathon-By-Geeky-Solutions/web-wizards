from django.db import models
from cloudinary.models import CloudinaryField
from .base import BaseModel

class Specialization(BaseModel):
    """Model for medical specializations"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Clinician(BaseModel):
    """Model for clinicians (doctors, specialists, etc.)"""
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    qualifications = models.TextField(blank=True, null=True)
    specializations = models.ManyToManyField(Specialization, related_name='clinicians')
    experience_years = models.PositiveIntegerField(default=0)
    is_accepting_patients = models.BooleanField(default=True)
    
    # Contact and location info
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    
    # Online presence
    website = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    
    # Profile image
    image = CloudinaryField('image', null=True, blank=True)
    
    # Additional details
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    available_online = models.BooleanField(default=False)
    languages = models.CharField(max_length=255, blank=True, null=True, 
                               help_text="Comma-separated languages")
    
    # Rating
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name