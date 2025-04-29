# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('docs/', views.schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', views.schema_view.with_ui('redoc', cache_timeout=0)),
    
    # App specific URLs
    path('users/', include('apps.users.urls')),
    path('medical-records/', include('apps.medical_records.urls')),
    path('clinicians/', include('apps.clinicians.urls')),
    path('appointments/', include('apps.appointments.urls')),
    path('medications/', include('apps.medications.urls')),
    path('news/', include('apps.news.urls')),
    path('visualizations/', include('apps.visualizations.urls')),  # Add visualizations API
]
