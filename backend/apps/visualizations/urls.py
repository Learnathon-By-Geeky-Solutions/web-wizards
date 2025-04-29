from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'test-visualizations', views.TestVisualizationViewSet, basename='test-visualization')
router.register(r'preferences', views.VisualizationPreferenceViewSet, basename='visualization-preference')
router.register(r'groups', views.VisualizationGroupViewSet, basename='visualization-group')

app_name = 'visualizations'

urlpatterns = [
    path('', include(router.urls)),
]