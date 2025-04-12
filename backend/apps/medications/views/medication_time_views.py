from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from ..models.medication_time import MedicationTime
from ..models.medication_plan import MedicationPlan
from ..serializers.medication_plan_serializer import MedicationTimeSerializer

class MedicationTimeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing medication times.
    """
    serializer_class = MedicationTimeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_daily', 'day_of_week', 'is_active_cycle_day']
    ordering_fields = ['time']
    ordering = ['time']

    def get_queryset(self):
        """
        This view should return a list of all medication times
        for plans owned by the currently authenticated user.
        """
        return MedicationTime.objects.filter(
            medication_plan__user=self.request.user
        )

    def perform_create(self, serializer):
        """
        Set the user's medication plan when creating a medication time.
        """
        medication_plan_id = self.request.data.get('medication_plan')
        if medication_plan_id:
            # Verify the medication plan belongs to the user
            medication_plan = MedicationPlan.objects.filter(
                id=medication_plan_id,
                user=self.request.user
            ).first()
            if medication_plan:
                serializer.save(medication_plan=medication_plan)
            else:
                raise PermissionError("Medication plan not found or access denied")

    @action(detail=False, methods=['get'])
    def by_plan(self, request):
        """
        Get medication times for a specific plan.
        """
        plan_id = request.query_params.get('plan_id')
        if plan_id:
            times = self.get_queryset().filter(medication_plan_id=plan_id)
            serializer = self.get_serializer(times, many=True)
            return Response(serializer.data)
        return Response([])