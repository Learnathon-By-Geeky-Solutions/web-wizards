from django.contrib import admin
from .models import (
    HealthIssue,
    LogbookEntry,
    Symptom,
    Chart,
    LabResult,
    Document
)

@admin.register(HealthIssue)
class HealthIssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'start_date', 'status')
    list_filter = ('status', 'start_date')
    search_fields = ('title', 'description')

@admin.register(LogbookEntry)
class LogbookEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'health_issue', 'entry_date')
    list_filter = ('entry_date',)
    search_fields = ('title', 'notes')

@admin.register(Symptom)
class SymptomAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'health_issue', 'severity', 'recorded_date')
    list_filter = ('severity', 'recorded_date')
    search_fields = ('name', 'description')

@admin.register(Chart)
class ChartAdmin(admin.ModelAdmin):
    list_display = ('title', 'chart_type', 'user', 'health_issue', 'measurement_date', 'value')
    list_filter = ('chart_type', 'measurement_date')
    search_fields = ('title', 'notes')

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('test_name', 'user', 'health_issue', 'test_date', 'lab_name')
    list_filter = ('test_date', 'lab_name')
    search_fields = ('test_name', 'result', 'notes')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'user', 'health_issue', 'document_date')
    list_filter = ('document_type', 'document_date')
    search_fields = ('title', 'description')
