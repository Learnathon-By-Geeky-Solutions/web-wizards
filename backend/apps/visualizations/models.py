from django.db import models
from django.conf import settings
from apps.medical_records.models.test_parameters import ParameterDefinition

class VisualizationPreference(models.Model):
    """User preferences for parameter visualization"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='visualization_preferences')
    parameter = models.ForeignKey(ParameterDefinition, on_delete=models.CASCADE, related_name='visualization_preferences')
    color = models.CharField(max_length=20, blank=True, null=True)
    custom_display_name = models.CharField(max_length=100, blank=True, null=True)
    visible_in_dashboard = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('user', 'parameter')
        ordering = ['display_order']
        
    def __str__(self):
        return f"{self.user.username} - {self.parameter.name}"


class VisualizationGroup(models.Model):
    """Custom groupings of parameters for visualization"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='visualization_groups')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parameters = models.ManyToManyField(ParameterDefinition, related_name='visualization_groups')
    is_default = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['display_order']
        
    def __str__(self):
        return f"{self.name} ({self.user.username})"