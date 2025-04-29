from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import News, NewsCategory
from .serializers import NewsListSerializer, NewsDetailSerializer, NewsCategorySerializer

class NewsCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for news categories
    """
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer
    lookup_field = 'slug'

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for news articles
    """
    queryset = News.objects.filter(is_published=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NewsDetailSerializer
        return NewsListSerializer
