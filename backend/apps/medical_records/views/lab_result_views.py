from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from ..models import LabResult
from ..models.test_parameters import TestResult, ParameterValue
from ..serializers import LabResultSerializer
from ..serializers.test_serializers import TestResultSerializer, ParameterValueSerializer
import datetime

class LabResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing lab results.
    """
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue', 'lab_name', 'test_name']
    search_fields = ['test_name', 'result', 'notes', 'lab_name']
    ordering_fields = ['test_date', 'test_name']
    ordering = ['-test_date']

    def get_queryset(self):
        """
        This view should return a list of all lab results
        for the currently authenticated user.
        """
        user = self.request.user
        return LabResult.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a lab result.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return lab results for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id', None)
        if health_issue_id:
            results = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(results, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def test_types(self, request):
        """
        Get available test types and their counts for the current user
        """
        user = request.user
        test_counts = (
            LabResult.objects.filter(user=user)
            .values('test_name')
            .annotate(count=Count('id'))
            .order_by('test_name')
        )
        return Response(test_counts)

    @action(detail=False, methods=['get'])
    def parameter_history(self, request):
        """
        Get historical data for a specific test parameter
        """
        test_type = request.query_params.get('test_type')
        parameter = request.query_params.get('parameter')
        months = request.query_params.get('months', 12)  # Default to last 12 months

        if not test_type or not parameter:
            return Response(
                {'error': 'test_type and parameter are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate date range
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=int(months) * 30)

        # Use the new test parameter system for retrieving data
        parameters = ParameterValue.objects.filter(
            test_result__lab_result__user=request.user,
            parameter__code=parameter,
            test_result__test_type__code=test_type,
            test_result__performed_at__range=[start_date, end_date]
        ).select_related('test_result', 'parameter').order_by('test_result__performed_at')

        # Format the response
        data = []
        for param in parameters:
            # Check if parameter value is outside reference range
            is_abnormal = param.is_abnormal
            
            data.append({
                'date': param.test_result.performed_at,
                'value': param.get_value(),
                'lab': param.test_result.lab_result.lab_name,
                'reference_range': {
                    'min': param.parameter.min_value,
                    'max': param.parameter.reference_range_json,
                    'text': param.parameter.reference_range_json
                },
                'is_abnormal': is_abnormal
            })

        return Response(data)

    @action(detail=False, methods=['get'])
    def latest_results(self, request):
        """
        Get the latest test results of each type for the current user
        """
        # Get distinct test types for this user
        test_results = TestResult.objects.filter(
            lab_result__user=request.user
        ).order_by('test_type__code', '-performed_at')
        
        # Get latest result for each test type
        latest_results = {}
        seen_test_types = set()
        
        for result in test_results:
            test_type_code = result.test_type.code
            if test_type_code not in seen_test_types:
                seen_test_types.add(test_type_code)
                
                # Get parameters for this result
                parameters = ParameterValue.objects.filter(test_result=result).select_related('parameter')
                params_data = []
                
                for param in parameters:
                    param_data = {
                        'name': param.parameter.name,
                        'code': param.parameter.code,
                        'value': param.get_value(),
                        'unit': param.parameter.unit,
                        'reference_min': param.parameter.min_value,
                        'reference_max': param.parameter.max_value,
                        'reference_text': param.parameter.reference_range_json,
                        'is_abnormal': param.is_abnormal
                    }
                    params_data.append(param_data)
                
                latest_results[test_type_code] = {
                    'date': result.performed_at,
                    'lab_name': result.lab_result.lab_name,
                    'data': params_data
                }
        
        return Response(latest_results)