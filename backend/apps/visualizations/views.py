from django.db.models import Prefetch
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from apps.medical_records.models.test_parameters import (
    TestType, ParameterDefinition, TestResult, ParameterValue
)
from apps.medical_records.models.lab_result import LabResult
from .models import VisualizationPreference, VisualizationGroup
from .serializers import (
    ParameterDefinitionSerializer, TestResultSerializer, TestTypeSerializer,
    VisualizationPreferenceSerializer, VisualizationGroupSerializer,
    TestParameterTimeSeriesSerializer
)
from django.db.models import F, Value, CharField
from django.db.models.functions import Coalesce
from itertools import groupby
from operator import attrgetter

class TestVisualizationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for test visualizations"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Default queryset for test types"""
        return TestType.objects.all().prefetch_related('parameters')
    
    def list(self, request):
        """List available test types for the patient"""
        queryset = self.get_queryset()
        serializer = TestTypeSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def parameter_history(self, request):
        """Get historical values of a specific parameter for visualization"""
        parameter_id = request.query_params.get('parameter_id')
        time_range = request.query_params.get('time_range', '365')  # Default to 365 days
        
        if not parameter_id:
            return Response({"error": "parameter_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            parameter = ParameterDefinition.objects.get(pk=parameter_id)
        except ParameterDefinition.DoesNotExist:
            return Response({"error": "Parameter not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get parameter values for this user within the time range
        parameter_values = ParameterValue.objects.filter(
            parameter_id=parameter_id,
            test_result__lab_result__patient__user=request.user
        ).select_related(
            'test_result', 'parameter'
        ).order_by('test_result__performed_at')
        
        # Prepare time series data
        data_points = []
        for value in parameter_values:
            data_points.append({
                'date': value.test_result.performed_at.isoformat(),
                'value': value.get_value(),
                'is_abnormal': value.is_abnormal
            })
        
        # Get reference range from parameter definition
        reference_range = parameter.reference_range_json
        
        result = {
            'parameter': parameter.id,
            'parameter_name': parameter.name,
            'parameter_code': parameter.code,
            'parameter_unit': parameter.unit,
            'reference_range': reference_range,
            'data_points': data_points
        }
        
        serializer = TestParameterTimeSeriesSerializer(data=result)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
    
    @action(detail=False, methods=['get'])
    def test_type_results(self, request):
        """Get most recent results for a specific test type"""
        test_type_id = request.query_params.get('test_type_id')
        limit = int(request.query_params.get('limit', 1))  # Default to most recent
        
        if not test_type_id:
            return Response({"error": "test_type_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        test_results = TestResult.objects.filter(
            test_type_id=test_type_id,
            lab_result__patient__user=request.user
        ).prefetch_related(
            'parameter_values__parameter'
        ).order_by('-performed_at')[:limit]
        
        serializer = TestResultSerializer(test_results, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def dashboard_parameters(self, request):
        """Get parameters and their latest values for dashboard display"""
        # Get user visualization preferences or use defaults
        user_prefs = VisualizationPreference.objects.filter(
            user=request.user,
            visible_in_dashboard=True
        ).select_related('parameter')
        
        parameters = []
        if user_prefs.exists():
            # Use user's preferred parameters
            for pref in user_prefs:
                parameters.append(pref.parameter)
        else:
            # Use default/common parameters if no preferences
            common_parameters = [
                'hemoglobin', 'white_blood_cells', 'platelets',  # CBC
                'glucose', 'sodium', 'potassium',  # Basic metabolic
                'cholesterol', 'triglycerides',  # Lipid
            ]
            parameters = ParameterDefinition.objects.filter(code__in=common_parameters)
        
        # Collect data for each parameter
        result = []
        for param in parameters:
            # Get most recent value
            latest_value = ParameterValue.objects.filter(
                parameter=param,
                test_result__lab_result__patient__user=request.user
            ).select_related('test_result').order_by('-test_result__performed_at').first()
            
            if not latest_value:
                continue
                
            # Get historical values for this parameter (last 5)
            historical_values = ParameterValue.objects.filter(
                parameter=param,
                test_result__lab_result__patient__user=request.user
            ).select_related('test_result').order_by('-test_result__performed_at')[:5]
            
            history = []
            for val in historical_values:
                history.append({
                    'date': val.test_result.performed_at.isoformat(),
                    'value': val.get_value(),
                    'is_abnormal': val.is_abnormal
                })
            
            # Set chart color based on user preference or default
            try:
                pref = user_prefs.get(parameter=param)
                chart_color = pref.color or '#0ea5e9'
                display_name = pref.custom_display_name or param.name
            except VisualizationPreference.DoesNotExist:
                chart_color = '#0ea5e9'  # Default color
                display_name = param.name
            
            result.append({
                'id': param.id,
                'name': display_name,
                'code': param.code,
                'unit': param.unit,
                'latest_value': latest_value.get_value(),
                'latest_date': latest_value.test_result.performed_at.isoformat(),
                'is_abnormal': latest_value.is_abnormal,
                'reference_range': param.reference_range_json,
                'chart_color': chart_color,
                'history': history
            })
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def text_parameter(self, request):
        """Get data for a text-type parameter (like ultrasonography)"""
        parameter_id = request.query_params.get('parameter_id')
        test_result_id = request.query_params.get('test_result_id')
        
        if not parameter_id:
            return Response({"error": "parameter_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            parameter = ParameterDefinition.objects.get(pk=parameter_id)
        except ParameterDefinition.DoesNotExist:
            return Response({"error": "Parameter not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Check if this is really a text-type parameter
        if parameter.data_type not in ['text', 'categorical']:
            return Response({"error": "Not a text-type parameter"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the main parameter value if test_result_id is provided
        main_value = None
        if test_result_id:
            try:
                main_value = ParameterValue.objects.get(
                    parameter_id=parameter_id,
                    test_result_id=test_result_id,
                    test_result__lab_result__patient__user=request.user
                )
            except ParameterValue.DoesNotExist:
                return Response({"error": "Parameter value not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get historical values
        parameter_values = ParameterValue.objects.filter(
            parameter_id=parameter_id,
            test_result__lab_result__patient__user=request.user
        ).select_related(
            'test_result', 'parameter'
        ).order_by('-test_result__performed_at')[:10]  # Limit to 10 most recent
        
        history = []
        for value in parameter_values:
            if not test_result_id or value.test_result_id != int(test_result_id):
                history.append({
                    'date': value.test_result.performed_at.isoformat(),
                    'value': value.get_value(),
                    'is_abnormal': value.is_abnormal
                })
        
        result = {
            'parameter': parameter.id,
            'parameter_name': parameter.name,
            'parameter_code': parameter.code,
            'parameter_unit': parameter.unit
        }
        
        if main_value:
            result.update({
                'main_value': main_value.get_value(),
                'is_abnormal': main_value.is_abnormal,
                'date': main_value.test_result.performed_at.isoformat()
            })
        
        result['history'] = history
        
        # Additional processing for specific text parameter types
        # Example: Extract key findings from ultrasonography reports
        if parameter.code == 'ultrasonography' and main_value and main_value.text_value:
            # This is where you could add AI processing or extraction of key findings
            # For now, we'll just provide basic formatting
            result['keyFindings'] = extract_key_findings(main_value.text_value)
        
        return Response(result)


class VisualizationPreferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user visualization preferences"""
    serializer_class = VisualizationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only return current user's preferences"""
        return VisualizationPreference.objects.filter(
            user=self.request.user
        ).select_related('parameter')
    
    def perform_create(self, serializer):
        """Set the user to the current authenticated user when creating"""
        serializer.save(user=self.request.user)


class VisualizationGroupViewSet(viewsets.ModelViewSet):
    """ViewSet for managing parameter visualization groups"""
    serializer_class = VisualizationGroupSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only return current user's visualization groups"""
        return VisualizationGroup.objects.filter(
            user=self.request.user
        ).prefetch_related('parameters')
    
    def perform_create(self, serializer):
        """Set the user to the current authenticated user when creating"""
        serializer.save(user=self.request.user)


# Helper function to extract key findings from text reports
def extract_key_findings(text):
    """Extract key findings from text reports like ultrasonography"""
    # This is a simple implementation that could be enhanced with NLP/AI
    findings = []
    
    # Look for common sections and keywords in medical reports
    if "IMPRESSION:" in text:
        impression = text.split("IMPRESSION:")[1].split("\n\n")[0].strip()
        findings.append(impression)
    
    if "FINDINGS:" in text:
        findings_text = text.split("FINDINGS:")[1].split("IMPRESSION:")[0].strip()
        for line in findings_text.split("\n"):
            if line.strip() and ":" in line:
                findings.append(line.strip())
    
    # If no structured findings, return a few lines
    if not findings and len(text) > 0:
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        findings = lines[:3]  # First 3 non-empty lines
    
    return findings