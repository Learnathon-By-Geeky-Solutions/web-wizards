from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField


class NewsCategory(models.Model):
    """Model representing news categories"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    
    class Meta:
        verbose_name_plural = "News Categories"
    
    def __str__(self):
        return self.name


class News(models.Model):
    """Model representing news articles"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    # Using CloudinaryField instead of ImageField to avoid Pillow dependency
    featured_image = CloudinaryField('featured_image', null=True, blank=True)
    category = models.ForeignKey(NewsCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='news')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "News"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

    @property
    def summary(self):
        """Return a short summary of the news content"""
        if len(self.content) > 150:
            return self.content[:150] + "..."
        return self.content
