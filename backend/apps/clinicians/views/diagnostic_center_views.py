from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models.diagnostic_center import DiagnosticCenter
from ..serializers import DiagnosticCenterSerializer

class DiagnosticCenterViewSet(viewsets.ModelViewSet):
    """ViewSet for the DiagnosticCenter model"""
    queryset = DiagnosticCenter.objects.all()
    serializer_class = DiagnosticCenterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'is_24_hours', 'has_home_collection', 'accepts_insurance']
    search_fields = ['name', 'description', 'services', 'city']
    ordering_fields = ['name', 'average_rating']
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top-rated diagnostic centers"""
        top_centers = DiagnosticCenter.objects.filter(rating_count__gt=0).order_by('-average_rating')[:5]
        serializer = self.get_serializer(top_centers, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def by_service(self, request):
        """Get diagnostic centers that offer a specific service"""
        service = request.query_params.get('service')
        if not service:
            return Response({"error": "Service parameter is required"}, status=400)
            
        # Search for the service in the services field
        centers = DiagnosticCenter.objects.filter(services__icontains=service)
        serializer = self.get_serializer(centers, many=True)
        return Response(serializer.data)