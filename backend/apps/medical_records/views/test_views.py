from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch

from ..models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue
from ..serializers.test_serializers import (
    TestTypeSerializer, 
    ParameterDefinitionSerializer,
    TestResultSerializer,
    CreateTestResultSerializer
)
from ..services.test_service import TestService


class TestTypeViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    """
    API endpoint for test types
    """
    queryset = TestType.objects.all().order_by('name')
    serializer_class = TestTypeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'code'


class ParameterDefinitionViewSet(mixins.ListModelMixin,
                               mixins.RetrieveModelMixin,
                               viewsets.GenericViewSet):
    """
    API endpoint for parameter definitions
    """
    queryset = ParameterDefinition.objects.all()
    serializer_class = ParameterDefinitionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        test_type = self.request.query_params.get('test_type')
        
        if test_type:
            queryset = queryset.filter(test_types__code=test_type)
            
        return queryset


class TestResultViewSet(viewsets.ModelViewSet):
    """
    API endpoint for test results
    """
    queryset = TestResult.objects.all().select_related('test_type', 'lab_result')
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset().filter(
            lab_result__user=self.request.user
        ).prefetch_related(
            Prefetch(
                'parameter_values',
                queryset=ParameterValue.objects.select_related('parameter')
            )
        )
        
        # Apply filters
        test_type = self.request.query_params.get('test_type')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if test_type:
            queryset = queryset.filter(test_type__code=test_type)
            
        if start_date:
            queryset = queryset.filter(performed_at__gte=start_date)
            
        if end_date:
            queryset = queryset.filter(performed_at__lte=end_date)
            
        return queryset.order_by('-performed_at')
    
    def create(self, request, *args, **kwargs):
        serializer = CreateTestResultSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        test_result = serializer.save()
        
        # Return the created test result
        output_serializer = self.get_serializer(test_result)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Get parameter history over time for the current user
        
        Query params:
        - parameter: Parameter code
        - start_date: Filter by start date
        - end_date: Filter by end date
        """
        parameter_code = request.query_params.get('parameter')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not parameter_code:
            return Response(
                {"detail": "Parameter code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        history = TestService.get_parameter_history(
            request.user,
            parameter_code,
            start_date,
            end_date
        )
        
        return Response(history)