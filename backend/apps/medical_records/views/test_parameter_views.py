from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from ..models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue
from ..serializers.test_serializers import (
    TestTypeSerializer, 
    ParameterDefinitionSerializer, 
    TestResultSerializer,
    ParameterValueSerializer
)
from django.shortcuts import get_object_or_404


class TestTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing test types.
    """
    queryset = TestType.objects.all()
    serializer_class = TestTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class ParameterDefinitionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing parameter definitions.
    """
    queryset = ParameterDefinition.objects.all()
    serializer_class = ParameterDefinitionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        test_type = self.request.query_params.get('test_type', None)
        
        if test_type:
            queryset = queryset.filter(test_types__code=test_type)
            
        return queryset


class TestResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing test results.
    """
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return a list of all test results
        for the currently authenticated user.
        """
        user = self.request.user
        queryset = TestResult.objects.filter(lab_result__user=user)
        
        # Filter by test type if provided
        test_type = self.request.query_params.get('test_type', None)
        if test_type:
            queryset = queryset.filter(test_type__code=test_type)
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(performed_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(performed_at__lte=end_date)
            
        # Filter by document ID if provided
        document_id = self.request.query_params.get('document_id', None)
        if document_id:
            queryset = queryset.filter(lab_result__document_id=document_id)
            
        # Filter by health issue if provided
        health_issue_id = self.request.query_params.get('health_issue_id', None)
        if health_issue_id:
            queryset = queryset.filter(lab_result__health_issue_id=health_issue_id)
            
        return queryset.order_by('-performed_at')
    
    def perform_create(self, serializer):
        """
        Set the user as the currently authenticated user when creating a test result.
        """
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Get historical values for a specific parameter.
        """
        parameter_code = request.query_params.get('parameter', None)
        if not parameter_code:
            return Response({"error": "Parameter code is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the parameter definition
        parameter_def = get_object_or_404(ParameterDefinition, code=parameter_code)
        
        # Get test results for this user that include this parameter
        user = request.user
        
        # Apply date filters if provided
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        
        # Get parameters with this code
        parameters = ParameterValue.objects.filter(
            test_result__lab_result__user=user,
            parameter=parameter_def
        ).select_related('test_result', 'parameter')
        
        # Apply date filters
        if start_date:
            parameters = parameters.filter(test_result__performed_at__gte=start_date)
        if end_date:
            parameters = parameters.filter(test_result__performed_at__lte=end_date)
        
        # Order by date
        parameters = parameters.order_by('test_result__performed_at')
        
        # Format the response
        history_data = []
        for param in parameters:
            history_data.append({
                'date': param.test_result.performed_at,
                'value': param.get_value(),
                'unit': param.parameter.unit,
                'is_abnormal': param.is_abnormal
            })
        
        return Response(history_data)
        
        
class ParameterValueViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing test parameters.
    """
    serializer_class = ParameterValueSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return a list of all test parameters
        for the currently authenticated user.
        """
        user = self.request.user
        queryset = ParameterValue.objects.filter(test_result__lab_result__user=user)
        
        # Filter by parameter definition if provided
        parameter_code = self.request.query_params.get('parameter', None)
        if parameter_code:
            queryset = queryset.filter(parameter__code=parameter_code)
        
        return queryset.order_by('-test_result__performed_at')