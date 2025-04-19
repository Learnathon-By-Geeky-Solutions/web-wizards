from django.db import models
from cloudinary.models import CloudinaryField
from .user import Users

Blood_Group = [
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
]

gender = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
]


class PatientProfile(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    address = models.TextField(null=True, blank=True)  # Made address optional
    country = models.CharField(max_length=255, default='Bangladesh')
    dob = models.DateField(default='2000-01-01')
    image = CloudinaryField('image', null=True, blank=True)
    gender = models.CharField(max_length=10, choices=gender)
    blood_group = models.CharField(max_length=5, choices=Blood_Group, null=True, blank=True)  # Made optional
    blood_pressure = models.CharField(max_length=10, null=True, blank=True)  # Made optional
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    bmi = models.CharField(max_length=10, blank=True, default="")

    def __str__(self):
        return str(self.user)