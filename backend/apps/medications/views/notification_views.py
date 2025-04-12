from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from datetime import datetime, timedelta
from ..models.notification import MedicationNotification
from ..serializers.notification_serializer import MedicationNotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing medication notifications.
    """
    serializer_class = MedicationNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'is_enabled']
    ordering_fields = ['scheduled_time', 'created_at']
    ordering = ['-scheduled_time']

    def get_queryset(self):
        """
        This view should return a list of all notifications
        for the currently authenticated user.
        """
        return MedicationNotification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a notification.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """
        Get pending notifications for the current user.
        """
        now = datetime.now()
        ten_minutes_ago = now - timedelta(minutes=10)
        
        # Get notifications that are:
        # 1. Enabled
        # 2. Scheduled within the last 10 minutes or upcoming
        # 3. Not marked as taken or skipped
        notifications = self.get_queryset().filter(
            is_enabled=True,
            scheduled_time__gte=ten_minutes_ago,
            status='pending'
        ).order_by('scheduled_time')
        
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_taken(self, request, pk=None):
        """
        Mark a notification as taken.
        """
        notification = self.get_object()
        notification.status = 'taken'
        notification.save()
        return Response({'status': 'notification marked as taken'})

    @action(detail=True, methods=['post'])
    def mark_skipped(self, request, pk=None):
        """
        Mark a notification as skipped.
        """
        notification = self.get_object()
        notification.status = 'skipped'
        notification.save()
        return Response({'status': 'notification marked as skipped'})