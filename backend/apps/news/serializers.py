from rest_framework import serializers
from .models import News, NewsCategory

class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ['id', 'name', 'slug']

class NewsListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    featured_image = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = ['id', 'title', 'slug', 'summary', 'featured_image', 
                 'category', 'category_name', 'created_at']
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
        
    def get_featured_image(self, obj):
        if obj.featured_image:
            return obj.featured_image.url
        return None

class NewsDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    featured_image = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = ['id', 'title', 'slug', 'content', 'featured_image', 
                 'category', 'category_name', 'created_at', 'updated_at']
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
        
    def get_featured_image(self, obj):
        if obj.featured_image:
            return obj.featured_image.url
        return None