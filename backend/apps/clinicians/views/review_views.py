from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models.review import Review
from ..serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for the Review model"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['clinician', 'diagnostic_center', 'rating', 'is_verified']
    ordering_fields = ['created_at', 'rating']
    
    def get_queryset(self):
        """Filter reviews based on clinician or diagnostic center if provided."""
        queryset = Review.objects.all()
        
        # Filter by clinician ID
        clinician_id = self.request.query_params.get('clinician_id')
        if clinician_id:
            queryset = queryset.filter(clinician_id=clinician_id)
            
        # Filter by diagnostic center ID
        center_id = self.request.query_params.get('diagnostic_center_id')
        if center_id:
            queryset = queryset.filter(diagnostic_center_id=center_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """Set the user when creating a review."""
        serializer.save(user=self.request.user)