from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Chart
from ..serializers import ChartSerializer

class ChartViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing chart data.
    """
    serializer_class = ChartSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue', 'chart_type']
    search_fields = ['title', 'notes']
    ordering_fields = ['measurement_date', 'measurement_time', 'chart_type', 'value']
    ordering = ['-measurement_date', '-measurement_time']

    def get_queryset(self):
        """
        This view should return a list of all chart data
        for the currently authenticated user.
        """
        user = self.request.user
        return Chart.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating chart data.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return chart data for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id', None)
        if health_issue_id:
            charts = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(charts, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Return chart data for a specific chart type.
        """
        chart_type = request.query_params.get('type', None)
        if chart_type:
            charts = self.get_queryset().filter(chart_type=chart_type)
            serializer = self.get_serializer(charts, many=True)
            return Response(serializer.data)
        return Response([])