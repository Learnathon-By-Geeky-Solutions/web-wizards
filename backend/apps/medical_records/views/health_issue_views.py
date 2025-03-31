from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import HealthIssue
from ..serializers import HealthIssueSerializer
from django.db.models import Q

class HealthIssueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing health issues.
    """
    serializer_class = HealthIssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'start_time', 'title', 'created_at']
    ordering = ['-start_date', '-start_time']

    def get_queryset(self):
        """
        This view should return a list of all health issues
        for the currently authenticated user.
        """
        user = self.request.user
        return HealthIssue.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a health issue.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Return active health issues.
        """
        active_issues = self.get_queryset().filter(status='active')
        serializer = self.get_serializer(active_issues, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def resolved(self, request):
        """
        Return resolved health issues.
        """
        resolved_issues = self.get_queryset().filter(status='resolved')
        serializer = self.get_serializer(resolved_issues, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Advanced search for health issues.
        """
        query = request.query_params.get('q', '')
        if query:
            queryset = self.get_queryset().filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query)
            )
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response([])