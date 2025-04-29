from rest_framework import serializers
from apps.medical_records.models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue
from .models import VisualizationPreference, VisualizationGroup

class ParameterDefinitionSerializer(serializers.ModelSerializer):
    """Serializer for parameter definitions"""
    class Meta:
        model = ParameterDefinition
        fields = ['id', 'name', 'code', 'unit', 'data_type', 'reference_range_json']


class TestTypeSerializer(serializers.ModelSerializer):
    """Serializer for test types with their parameters"""
    parameters = ParameterDefinitionSerializer(many=True, read_only=True)
    
    class Meta:
        model = TestType
        fields = ['id', 'name', 'code', 'description', 'category', 'parameters']


class ParameterValueSerializer(serializers.ModelSerializer):
    """Serializer for parameter values"""
    parameter = ParameterDefinitionSerializer(read_only=True)
    value = serializers.SerializerMethodField()
    
    class Meta:
        model = ParameterValue
        fields = ['id', 'parameter', 'value', 'is_abnormal']
    
    def get_value(self, obj):
        """Return the appropriate value based on parameter type"""
        return obj.get_value()


class TestResultSerializer(serializers.ModelSerializer):
    """Serializer for test results with parameter values"""
    parameter_values = ParameterValueSerializer(many=True, read_only=True)
    test_type_name = serializers.CharField(source='test_type.name', read_only=True)
    
    class Meta:
        model = TestResult
        fields = ['id', 'test_type', 'test_type_name', 'performed_at', 'parameter_values']


class TestParameterTimeSeriesSerializer(serializers.Serializer):
    """Serializer for time series data of a parameter"""
    parameter = serializers.IntegerField()
    parameter_name = serializers.CharField()
    parameter_code = serializers.CharField()
    parameter_unit = serializers.CharField(allow_blank=True)
    reference_range = serializers.JSONField(required=False)
    data_points = serializers.ListField(child=serializers.JSONField())


class VisualizationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for user visualization preferences"""
    parameter_name = serializers.CharField(source='parameter.name', read_only=True)
    parameter_code = serializers.CharField(source='parameter.code', read_only=True)
    
    class Meta:
        model = VisualizationPreference
        fields = ['id', 'parameter', 'parameter_name', 'parameter_code', 'color', 
                 'custom_display_name', 'visible_in_dashboard', 'display_order']
        read_only_fields = ['id']


class VisualizationGroupSerializer(serializers.ModelSerializer):
    """Serializer for parameter visualization groups"""
    parameter_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VisualizationGroup
        fields = ['id', 'name', 'description', 'parameters', 'parameter_count',
                 'is_default', 'display_order']
        read_only_fields = ['id']
    
    def get_parameter_count(self, obj):
        return obj.parameters.count()