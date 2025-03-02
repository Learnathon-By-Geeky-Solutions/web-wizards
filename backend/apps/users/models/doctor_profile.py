from django.db import models
from cloudinary.models import CloudinaryField
from .user import Users

gender = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
]

class DoctorProfile(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=255)
    hospital = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    country = models.CharField(max_length=255, default='Bangladesh')
    dob = models.DateField()
    image = CloudinaryField('image', null=True, blank=True)
    gender = models.CharField(max_length=10, choices=gender)
    
    def __str__(self):
        return str(self.user)