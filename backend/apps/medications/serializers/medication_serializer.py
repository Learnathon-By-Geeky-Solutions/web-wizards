from rest_framework import serializers
from ..models.medication import Medication

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'name', 'description', 'category', 'dosage_form', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']