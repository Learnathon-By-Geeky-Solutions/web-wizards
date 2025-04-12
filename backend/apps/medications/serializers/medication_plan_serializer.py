from rest_framework import serializers
from ..models.medication_plan import MedicationPlan
from ..models.medication_time import MedicationTime
from apps.medical_records.serializers import HealthIssueSerializer

class MedicationTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationTime
        fields = ['id', 'time', 'day_of_week', 'is_daily', 'dose_override', 'is_active_cycle_day', 'notes']

class MedicationPlanSerializer(serializers.ModelSerializer):
    medication_times = MedicationTimeSerializer(many=True, read_only=True)
    health_issue_data = HealthIssueSerializer(source='health_issue', read_only=True)
    times = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)
    
    class Meta:
        model = MedicationPlan
        fields = [
            'id', 'user', 'medication', 'custom_medication_name',
            'dose_amount', 'schedule_type', 'instructions', 'description',
            'effective_date', 'effective_time', 'end_date', 'status', 'health_issue',
            'health_issue_data', 'medication_times', 'notifications_enabled',
            'times'
        ]
        read_only_fields = ['id', 'user']
        
    def create(self, validated_data):
        times_data = validated_data.pop('times', [])
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
            
        instance = super().create(validated_data)
        
        # Create medication times
        self._create_medication_times(instance, times_data)
        return instance
    
    def update(self, instance, validated_data):
        times_data = validated_data.pop('times', None)
        instance = super().update(instance, validated_data)
        
        if times_data is not None:
            # Delete existing times and create new ones
            instance.medication_times.all().delete()
            self._create_medication_times(instance, times_data)
        
        return instance
    
    def _create_medication_times(self, plan, times_data):
        for time_data in times_data:
            time_data['medication_plan'] = plan
            MedicationTime.objects.create(**time_data)