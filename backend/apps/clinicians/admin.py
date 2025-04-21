from django.contrib import admin
from .models import Clinician, Specialization, DiagnosticCenter, Review

@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Clinician)
class ClinicianAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'is_accepting_patients', 'average_rating', 'rating_count')
    list_filter = ('is_accepting_patients', 'available_online', 'city')
    search_fields = ('name', 'description', 'qualifications', 'address', 'city')
    filter_horizontal = ('specializations',)

@admin.register(DiagnosticCenter)
class DiagnosticCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'is_24_hours', 'has_home_collection', 'average_rating')
    list_filter = ('is_24_hours', 'has_home_collection', 'accepts_insurance', 'city')
    search_fields = ('name', 'description', 'services', 'address', 'city')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('get_reviewed_entity', 'user', 'rating', 'created_at', 'is_verified')
    list_filter = ('rating', 'is_verified', 'is_anonymous')
    search_fields = ('comment',)
    
    def get_reviewed_entity(self, obj):
        if obj.clinician:
            return f"Clinician: {obj.clinician.name}"
        return f"Center: {obj.diagnostic_center.name}"
    
    get_reviewed_entity.short_description = 'Reviewed Entity'