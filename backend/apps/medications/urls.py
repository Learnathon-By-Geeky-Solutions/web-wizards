from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.medication_views import MedicationViewSet
from .views.medication_plan_views import MedicationPlanViewSet
from .views.notification_views import NotificationViewSet
from .views.medication_time_views import MedicationTimeViewSet

router = DefaultRouter()
router.register(r'medications', MedicationViewSet, basename='medication')
router.register(r'medication-plans', MedicationPlanViewSet, basename='medication-plan')
router.register(r'notifications', NotificationViewSet, basename='medication-notification')
router.register(r'times', MedicationTimeViewSet, basename='medication-time')

app_name = 'medications'

urlpatterns = [
    path('', include(router.urls)),
]