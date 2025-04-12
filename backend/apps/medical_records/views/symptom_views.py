from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Symptom
from ..serializers import SymptomSerializer

class SymptomViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing symptoms.
    """
    serializer_class = SymptomSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue', 'severity']
    search_fields = ['name', 'description']
    ordering_fields = ['recorded_date', 'recorded_time', 'name', 'severity']
    ordering = ['-recorded_date', '-recorded_time']

    def get_queryset(self):
        """
        This view should return a list of all symptoms
        for the currently authenticated user.
        """
        user = self.request.user
        return Symptom.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a symptom.
        Also handle the health issue association.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return symptoms for a specific health issue or all symptoms if no health issue specified.
        """
        health_issue_id = request.query_params.get('health_issue_id', None)
        queryset = self.get_queryset()
        
        if health_issue_id and health_issue_id not in ['all', 'null']:
            queryset = queryset.filter(health_issue_id=health_issue_id)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)