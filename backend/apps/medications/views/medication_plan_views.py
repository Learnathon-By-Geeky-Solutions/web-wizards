from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from ..models.medication_plan import MedicationPlan
from ..models.medication_time import MedicationTime
from ..serializers.medication_plan_serializer import MedicationPlanSerializer
from datetime import date, datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class MedicationPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing medication plans.
    """
    serializer_class = MedicationPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'schedule_type', 'health_issue']
    search_fields = ['custom_medication_name', 'medication__name', 'description']
    ordering_fields = ['effective_date', 'end_date', 'status']
    ordering = ['-effective_date']

    def get_queryset(self):
        """
        This view should return a list of all medication plans
        for the currently authenticated user.
        """
        user = self.request.user
        return MedicationPlan.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a medication plan.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def active_plans(self, request):
        """
        Return active medication plans.
        """
        active_plans = self.get_queryset().filter(status='Active')
        serializer = self.get_serializer(active_plans, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_notifications(self, request, pk=None):
        """
        Toggle notifications for a medication plan.
        """
        plan = self.get_object()
        enabled = request.data.get('enabled', True)
        plan.notifications_enabled = enabled
        plan.save()
        return Response({'status': 'notifications updated'})

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return medication plans for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id')
        if health_issue_id:
            plans = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(plans, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def today_schedule(self, request):
        """
        Get today's medication schedule.
        """
        today = timezone.localtime().date()
        day_of_week = today.weekday()
        current_time = timezone.localtime().strftime('%H:%M')
        
        # Get active plans that are effective today
        active_plans = self.get_queryset().filter(
            status='Active',
            effective_date__lte=today
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=today)
        )
        
        today_schedule = []
        
        for plan in active_plans:
            times = plan.medication_times.filter(
                Q(is_daily=True) | Q(day_of_week=day_of_week)
            ).order_by('time')
            
            if times:
                schedule_data = self.get_serializer(plan).data
                schedule_data['times'] = [
                    {
                        'time': time.time,
                        'is_daily': time.is_daily,
                        'dose_override': time.dose_override,
                        'is_past': time.time <= current_time
                    }
                    for time in times
                ]
                today_schedule.append(schedule_data)
        
        return Response(today_schedule)

    @action(detail=False, methods=['get'])
    def upcoming_doses(self, request):
        """
        Get upcoming medication doses.
        """
        now = datetime.now()
        today = now.date()
        current_time = now.strftime('%H:%M')
        day_of_week = today.weekday()
        
        # Get active plans
        active_plans = self.get_queryset().filter(status='Active')
        upcoming_doses = []
        
        for plan in active_plans:
            # Get today's remaining doses
            today_times = plan.medication_times.filter(
                Q(is_daily=True) | Q(day_of_week=day_of_week),
                time__gt=current_time
            ).order_by('time')
            
            # Get tomorrow's doses
            tomorrow_day = (day_of_week + 1) % 7
            tomorrow_times = plan.medication_times.filter(
                Q(is_daily=True) | Q(day_of_week=tomorrow_day)
            ).order_by('time')
            
            if today_times.exists() or tomorrow_times.exists():
                plan_data = self.get_serializer(plan).data
                plan_data['upcoming_doses'] = []
                
                # Add today's doses
                for time in today_times:
                    plan_data['upcoming_doses'].append({
                        'time': time.time,
                        'is_daily': time.is_daily,
                        'day': 'today',
                        'dose_override': time.dose_override
                    })
                
                # Add tomorrow's doses
                for time in tomorrow_times:
                    plan_data['upcoming_doses'].append({
                        'time': time.time,
                        'is_daily': time.is_daily,
                        'day': 'tomorrow',
                        'dose_override': time.dose_override
                    })
                
                upcoming_doses.append(plan_data)
        
        return Response(upcoming_doses)