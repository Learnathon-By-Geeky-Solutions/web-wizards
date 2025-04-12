from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from ..models import LabResult, CBCTestResult, URETestResult
from ..serializers import (
    LabResultSerializer, 
    CBCTestResultSerializer, 
    URETestResultSerializer
)
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
    def cbc_results(self, request):
        """
        Get CBC test results with optional date range filtering
        """
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        health_issue_id = request.query_params.get('health_issue_id')

        # Get base queryset for CBC results
        queryset = LabResult.objects.filter(
            user=request.user,
            test_name='CBC'
        ).select_related('cbc_details')

        # Apply filters
        if start_date:
            queryset = queryset.filter(test_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(test_date__lte=end_date)
        if health_issue_id:
            queryset = queryset.filter(health_issue_id=health_issue_id)

        # Order by test date
        queryset = queryset.order_by('test_date')

        # Serialize the results
        data = []
        for result in queryset:
            if hasattr(result, 'cbc_details'):
                serializer = CBCTestResultSerializer(result.cbc_details)
                data.append({
                    'date': result.test_date,
                    'lab_name': result.lab_name,
                    'data': serializer.data
                })

        return Response(data)

    @action(detail=False, methods=['get'])
    def ure_results(self, request):
        """
        Get URE test results with optional date range filtering
        """
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        health_issue_id = request.query_params.get('health_issue_id')

        # Get base queryset for URE results
        queryset = LabResult.objects.filter(
            user=request.user,
            test_name='URE'
        ).select_related('ure_details')

        # Apply filters
        if start_date:
            queryset = queryset.filter(test_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(test_date__lte=end_date)
        if health_issue_id:
            queryset = queryset.filter(health_issue_id=health_issue_id)

        # Order by test date
        queryset = queryset.order_by('test_date')

        # Serialize the results
        data = []
        for result in queryset:
            if hasattr(result, 'ure_details'):
                serializer = URETestResultSerializer(result.ure_details)
                data.append({
                    'date': result.test_date,
                    'lab_name': result.lab_name,
                    'data': serializer.data
                })

        return Response(data)

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

        # Get base queryset
        queryset = LabResult.objects.filter(
            user=request.user,
            test_name=test_type,
            test_date__range=[start_date, end_date]
        ).order_by('test_date')

        # Extract parameter values
        data = []
        for result in queryset:
            if test_type == 'CBC' and hasattr(result, 'cbc_details'):
                value = getattr(result.cbc_details, parameter, None)
                if value is not None:
                    data.append({
                        'date': result.test_date,
                        'value': value,
                        'lab': result.lab_name,
                        'reference_range': result.cbc_details.reference_ranges.get(parameter, {})
                    })
            elif test_type == 'URE' and hasattr(result, 'ure_details'):
                value = getattr(result.ure_details, parameter, None)
                if value is not None:
                    data.append({
                        'date': result.test_date,
                        'value': value,
                        'lab': result.lab_name,
                        'reference_range': result.ure_details.reference_ranges.get(parameter, {})
                    })

        return Response(data)

    @action(detail=False, methods=['get'])
    def latest_results(self, request):
        """
        Get the latest test results of each type for the current user
        """
        latest_results = {}
        
        # Get latest CBC result
        latest_cbc = (
            LabResult.objects.filter(user=request.user, test_name='CBC')
            .select_related('cbc_details')
            .order_by('-test_date')
            .first()
        )
        if latest_cbc and hasattr(latest_cbc, 'cbc_details'):
            latest_results['CBC'] = {
                'date': latest_cbc.test_date,
                'lab_name': latest_cbc.lab_name,
                'data': CBCTestResultSerializer(latest_cbc.cbc_details).data
            }

        # Get latest URE result
        latest_ure = (
            LabResult.objects.filter(user=request.user, test_name='URE')
            .select_related('ure_details')
            .order_by('-test_date')
            .first()
        )
        if latest_ure and hasattr(latest_ure, 'ure_details'):
            latest_results['URE'] = {
                'date': latest_ure.test_date,
                'lab_name': latest_ure.lab_name,
                'data': URETestResultSerializer(latest_ure.ure_details).data
            }

        return Response(latest_results)