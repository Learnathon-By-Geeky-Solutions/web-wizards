from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Chart
from ..serializers import ChartSerializer
import logging

logger = logging.getLogger(__name__)

class ChartViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing chart data (vital measurements).
    """
    serializer_class = ChartSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['chart_type', 'health_issue']
    search_fields = ['title', 'notes']
    ordering_fields = ['measurement_date', 'measurement_time', 'value']
    ordering = ['-measurement_date', '-measurement_time']

    def get_queryset(self):
        """
        This view should return a list of all charts
        for the currently authenticated user.
        """
        user = self.request.user
        return Chart.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a chart entry.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Return measurements filtered by chart type.
        """
        chart_type = request.query_params.get('type')
        if chart_type:
            measurements = self.get_queryset().filter(chart_type=chart_type)
            serializer = self.get_serializer(measurements, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return measurements for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id')
        if health_issue_id:
            measurements = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(measurements, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """
        Return the latest measurement for each chart type.
        """
        latest_measurements = {}
        for chart_type, _ in Chart.CHART_TYPE_CHOICES:
            measurement = self.get_queryset().filter(chart_type=chart_type).order_by('-measurement_date', '-measurement_time').first()
            if measurement:
                latest_measurements[chart_type] = self.get_serializer(measurement).data
        return Response(latest_measurements)