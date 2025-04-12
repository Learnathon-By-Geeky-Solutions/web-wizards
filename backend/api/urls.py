# api/urls.py
from django.urls import path
from .views import DemoAPIView
from apps.users import urls as users_urls
from apps.medical_records import urls as medical_records_urls
from apps.medications import urls as medications_urls
from apps.clinicians import urls as clinicians_urls
from django.urls import include

urlpatterns = [
    path('demo/', DemoAPIView.as_view(), name='demo-api'),
    path('users/', include(users_urls)),
    path('medical-records/', include(medical_records_urls)),
    path('medications/', include(medications_urls)),
    path('clinicians/', include(clinicians_urls)),
]
