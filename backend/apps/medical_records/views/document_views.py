from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Document
from ..serializers import DocumentSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing medical documents.
    """
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue', 'document_type']
    search_fields = ['title', 'description']
    ordering_fields = ['document_date', 'title', 'document_type']
    ordering = ['-document_date']

    def get_queryset(self):
        """
        This view should return a list of all documents
        for the currently authenticated user.
        """
        user = self.request.user
        return Document.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a document.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return documents for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id', None)
        if health_issue_id:
            documents = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(documents, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Return documents of a specific type.
        """
        document_type = request.query_params.get('type', None)
        if document_type:
            documents = self.get_queryset().filter(document_type=document_type)
            serializer = self.get_serializer(documents, many=True)
            return Response(serializer.data)
        return Response([])