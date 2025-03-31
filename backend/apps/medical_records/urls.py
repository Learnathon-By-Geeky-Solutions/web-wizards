from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthIssueViewSet,
    LogbookEntryViewSet,
    SymptomViewSet,
    ChartViewSet,
    LabResultViewSet,
    DocumentViewSet,
)

router = DefaultRouter()
router.register(r'health-issues', HealthIssueViewSet, basename='health-issue')
router.register(r'logbook-entries', LogbookEntryViewSet, basename='logbook-entry')
router.register(r'symptoms', SymptomViewSet, basename='symptom')
router.register(r'charts', ChartViewSet, basename='chart')
router.register(r'lab-results', LabResultViewSet, basename='lab-result')
router.register(r'documents', DocumentViewSet, basename='document')

app_name = 'medical_records'

urlpatterns = [
    path('', include(router.urls)),
]