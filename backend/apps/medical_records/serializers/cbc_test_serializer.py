from rest_framework import serializers
from ..models import CBCTestResult, LabResult

class CBCTestResultSerializer(serializers.ModelSerializer):
    """
    Serializer for CBC (Complete Blood Count) test results
    """
    class Meta:
        model = CBCTestResult
        fields = [
            'id',
            'hemoglobin',
            'hematocrit',
            'red_blood_cells',
            'mcv',
            'mch',
            'mchc',
            'rdw',
            'white_blood_cells',
            'neutrophils_percent',
            'lymphocytes_percent',
            'monocytes_percent',
            'eosinophils_percent',
            'basophils_percent',
            'neutrophils_absolute',
            'lymphocytes_absolute',
            'monocytes_absolute',
            'eosinophils_absolute',
            'basophils_absolute',
            'platelets',
            'mpv',
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