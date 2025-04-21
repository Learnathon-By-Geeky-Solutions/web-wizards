from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SpecializationViewSet,
    ClinicianViewSet,
    DiagnosticCenterViewSet,
    ReviewViewSet
)

router = DefaultRouter()
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'clinicians', ClinicianViewSet, basename='clinician')
router.register(r'diagnostic-centers', DiagnosticCenterViewSet, basename='diagnostic-center')
router.register(r'reviews', ReviewViewSet, basename='review')

app_name = 'clinicians'

urlpatterns = [
    path('', include(router.urls)),
]