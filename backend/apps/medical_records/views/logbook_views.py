from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import LogbookEntry
from ..serializers import LogbookEntrySerializer
from django.db.models import Q

class LogbookEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing logbook entries.
    """
    serializer_class = LogbookEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue']
    search_fields = ['title', 'notes']
    ordering_fields = ['entry_date', 'entry_time', 'title', 'created_at']
    ordering = ['-entry_date', '-entry_time']

    def get_queryset(self):
        """
        This view should return a list of all logbook entries
        for the currently authenticated user.
        """
        user = self.request.user
        return LogbookEntry.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a logbook entry.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return entries for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id', None)
        if health_issue_id:
            entries = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(entries, many=True)
            return Response(serializer.data)
        return Response([])