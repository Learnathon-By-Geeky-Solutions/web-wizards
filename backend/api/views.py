from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Create schema view for Swagger documentation
schema_view = get_schema_view(
   openapi.Info(
      title="Health App API",
      default_version='v1',
      description="API Documentation for Health App",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@healthapp.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

class DemoAPIView(APIView):
    def get(self, request):
        # Sample data to send as JSON
        data = {
            "message": "Hello, React!",
            "status": "success",
            "items": [
                {"id": 1, "name": "Item 1"},
                {"id": 2, "name": "Item 2"},
                {"id": 3, "name": "Item 3"},
            ]
        }
        return Response(data)
