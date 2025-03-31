from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import LabResult
from ..serializers import LabResultSerializer

class LabResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing lab results.
    """
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue', 'lab_name']
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