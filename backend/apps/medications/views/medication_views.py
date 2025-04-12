from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models.medication import Medication
from ..serializers.medication_serializer import MedicationSerializer

class MedicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing medications.
    """
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']
    ordering = ['name']
    
    def get_queryset(self):
        return Medication.objects.all()
        
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search medications by name or description.
        """
        query = request.query_params.get('q', '')
        if query:
            queryset = self.get_queryset().filter(name__icontains=query)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get list of available medication categories"""
        categories = Medication.objects.values_list(
            'category', flat=True
        ).distinct().order_by('category')
        return Response(list(categories))

    @action(detail=False, methods=['get'])
    def dosage_forms(self, request):
        """Get list of available dosage forms"""
        forms = Medication.objects.values_list(
            'dosage_form', flat=True
        ).distinct().order_by('dosage_form')
        return Response(list(forms))