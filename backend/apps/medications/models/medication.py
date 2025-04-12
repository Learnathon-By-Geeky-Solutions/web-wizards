from django.db import models
from cloudinary.models import CloudinaryField
from .base import BaseModel

class Medication(BaseModel):
    """Model for storing medication catalog information"""
    name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255, null=True, blank=True)
    brand_name = models.CharField(max_length=255, null=True, blank=True)
    manufacturer = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    dosage_form = models.CharField(
        max_length=50,
        choices=[
            ('tablet', 'Tablet'),
            ('capsule', 'Capsule'),
            ('liquid', 'Liquid'),
            ('injection', 'Injection'),
            ('cream', 'Cream'),
            ('ointment', 'Ointment'),
            ('inhaler', 'Inhaler'),
            ('drops', 'Drops'),
            ('powder', 'Powder'),
            ('other', 'Other')
        ]
    )
    strength = models.CharField(max_length=100, help_text="e.g., 500mg, 50ml, etc.")
    unit = models.CharField(
        max_length=20,
        choices=[
            ('mg', 'Milligram'),
            ('g', 'Gram'),
            ('ml', 'Milliliter'),
            ('mcg', 'Microgram'),
            ('IU', 'International Unit'),
            ('other', 'Other')
        ]
    )
    category = models.CharField(
        max_length=100,
        choices=[
            ('analgesic', 'Analgesic'),
            ('antibiotic', 'Antibiotic'),
            ('antiviral', 'Antiviral'),
            ('antihistamine', 'Antihistamine'),
            ('antihypertensive', 'Antihypertensive'),
            ('antidiabetic', 'Antidiabetic'),
            ('antiinflammatory', 'Anti-inflammatory'),
            ('vitamin', 'Vitamin'),
            ('supplement', 'Supplement'),
            ('other', 'Other')
        ]
    )
    contraindications = models.TextField(null=True, blank=True)
    side_effects = models.TextField(null=True, blank=True)
    storage_instructions = models.CharField(max_length=255, null=True, blank=True)
    is_prescription_required = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    image = CloudinaryField('image', null=True, blank=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['generic_name']),
            models.Index(fields=['brand_name']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} - {self.strength} {self.unit}"

    @property
    def full_name(self):
        """Return a full descriptive name of the medication"""
        parts = [self.name]
        if self.strength and self.unit:
            parts.append(f"{self.strength}{self.unit}")
        if self.dosage_form:
            parts.append(f"({self.dosage_form})")
        return " ".join(parts)