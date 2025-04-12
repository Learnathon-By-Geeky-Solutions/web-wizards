from rest_framework import serializers
from ..models import Chart, HealthIssue

class ChartSerializer(serializers.ModelSerializer):
    health_issue_title = serializers.CharField(source='health_issue.title', read_only=True)
    
    class Meta:
        model = Chart
        fields = [
            'id', 'user', 'health_issue', 'health_issue_title',
            'chart_type', 'title', 'measurement_date', 
            'measurement_time', 'value', 'unit', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Custom validation for the measurement value based on chart_type
        """
        chart_type = data.get('chart_type')
        value = data.get('value')
        
        if chart_type and value:
            validators = Chart.get_validators_for_type(chart_type)
            for validator in validators:
                validator(value)
        
        # Validate health issue belongs to user if provided
        health_issue = data.get('health_issue')
        if health_issue:
            user = self.context['request'].user
            if health_issue.user != user:
                raise serializers.ValidationError({
                    'health_issue': 'This health issue does not belong to you.'
                })
        
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)