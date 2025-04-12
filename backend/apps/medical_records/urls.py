from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.health_issue_views import HealthIssueViewSet
from .views.logbook_views import LogbookEntryViewSet
from .views.symptom_views import SymptomViewSet
from .views.chart_views import ChartViewSet
from .views.lab_result_views import LabResultViewSet
from .views.document_views import DocumentViewSet

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