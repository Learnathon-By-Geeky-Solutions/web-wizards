from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    document_views,
    health_issue_views,
    lab_result_views,
    test_parameter_views
)

router = DefaultRouter()
router.register(r'health-issues', health_issue_views.HealthIssueViewSet, basename='healthissue')
router.register(r'documents', document_views.DocumentViewSet, basename='document')
router.register(r'lab-results', lab_result_views.LabResultViewSet, basename='labresult')

# Register test parameter related views
router.register(r'test-types', test_parameter_views.TestTypeViewSet)
router.register(r'parameters', test_parameter_views.ParameterDefinitionViewSet)
router.register(r'test-results', test_parameter_views.TestResultViewSet, basename='testresult')
router.register(r'test-parameters', test_parameter_views.ParameterValueViewSet, basename='testparameter')

urlpatterns = [
    path('', include(router.urls)),
]