from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models.clinician import Clinician
from ..serializers import ClinicianSerializer

class ClinicianViewSet(viewsets.ModelViewSet):
    """ViewSet for the Clinician model"""
    queryset = Clinician.objects.all()
    serializer_class = ClinicianSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'is_accepting_patients', 'available_online', 'specializations']
    search_fields = ['name', 'description', 'qualifications', 'city']
    ordering_fields = ['name', 'average_rating', 'experience_years']
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top-rated clinicians"""
        top_clinicians = Clinician.objects.filter(rating_count__gt=0).order_by('-average_rating')[:5]
        serializer = self.get_serializer(top_clinicians, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def by_specialization(self, request):
        """Get clinicians by specialization"""
        specialization_id = request.query_params.get('specialization_id')
        if not specialization_id:
            return Response({"error": "Specialization ID is required"}, status=400)
            
        clinicians = Clinician.objects.filter(specializations__id=specialization_id)
        serializer = self.get_serializer(clinicians, many=True)
        return Response(serializer.data)