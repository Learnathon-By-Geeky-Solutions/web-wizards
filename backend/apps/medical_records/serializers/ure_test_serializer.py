from rest_framework import serializers
from ..models import URETestResult, LabResult

class URETestResultSerializer(serializers.ModelSerializer):
    """
    Serializer for URE (Urea and Electrolytes) test results
    """
    class Meta:
        model = URETestResult
        fields = [
            'id',
            'sodium',
            'potassium',
            'chloride',
            'bicarbonate',
            'urea',
            'creatinine',
            'egfr',
            'calcium',
            'phosphate',
            'magnesium',
            'uric_acid',
            'glucose',
            'reference_ranges'
        ]
    
    def to_representation(self, instance):
        """
        Add reference ranges and status indicators to the output
        """
        data = super().to_representation(instance)
        
        # Add status indicators for each parameter
        for field, value in data.items():
            if field != 'reference_ranges' and value is not None:
                ref_range = instance.reference_ranges.get(field, {})
                if ref_range:
                    min_val = ref_range.get('min')
                    max_val = ref_range.get('max')
                    if min_val is not None and max_val is not None:
                        status = 'normal'
                        if value < min_val:
                            status = 'low'
                        elif value > max_val:
                            status = 'high'
                        data[f"{field}_status"] = status
        
        return data