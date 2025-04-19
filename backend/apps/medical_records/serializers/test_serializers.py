from rest_framework import serializers
from ..models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue
from ..models.lab_result import LabResult


class TestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestType
        fields = ['id', 'name', 'code', 'description', 'category']


class ParameterDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParameterDefinition
        fields = ['id', 'name', 'code', 'unit', 'data_type', 'reference_range_json']


class ParameterValueSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='parameter.name', read_only=True)
    code = serializers.CharField(source='parameter.code', read_only=True)
    unit = serializers.CharField(source='parameter.unit', read_only=True)
    value = serializers.SerializerMethodField()
    
    class Meta:
        model = ParameterValue
        fields = ['name', 'code', 'value', 'unit', 'is_abnormal']
    
    def get_value(self, obj):
        return obj.get_value()


class TestResultSerializer(serializers.ModelSerializer):
    test_type_name = serializers.CharField(source='test_type.name', read_only=True)
    test_type_code = serializers.CharField(source='test_type.code', read_only=True)
    parameters = serializers.SerializerMethodField()
    
    class Meta:
        model = TestResult
        fields = ['id', 'lab_result', 'test_type', 'test_type_name', 'test_type_code', 'performed_at', 'parameters']
        
    def get_parameters(self, obj):
        parameter_values = obj.parameter_values.all().select_related('parameter')
        return {
            param_value.parameter.code: ParameterValueSerializer(param_value).data
            for param_value in parameter_values
        }


class CreateTestResultSerializer(serializers.Serializer):
    lab_result_id = serializers.IntegerField()
    test_type_code = serializers.CharField()
    parameters = serializers.DictField(child=serializers.FloatField(allow_null=True))
    
    def validate_lab_result_id(self, value):
        try:
            LabResult.objects.get(id=value)
        except LabResult.DoesNotExist:
            raise serializers.ValidationError("Lab result does not exist")
        return value
        
    def validate_test_type_code(self, value):
        try:
            TestType.objects.get(code=value)
        except TestType.DoesNotExist:
            raise serializers.ValidationError(f"Test type with code '{value}' does not exist")
        return value
        
    def create(self, validated_data):
        from ..services.test_service import TestService
        
        lab_result = LabResult.objects.get(id=validated_data['lab_result_id'])
        test_type_code = validated_data['test_type_code']
        parameters = validated_data['parameters']
        
        return TestService.create_test_result(lab_result, test_type_code, parameters)