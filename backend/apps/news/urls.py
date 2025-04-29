from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsViewSet, NewsCategoryViewSet

router = DefaultRouter()
router.register(r'news', NewsViewSet)
router.register(r'categories', NewsCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]