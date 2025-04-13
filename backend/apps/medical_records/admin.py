from django.contrib import admin
from .models import (
    HealthIssue,
    LogbookEntry,
    Symptom,
    Chart,
    Document
)
from .models.lab_result import LabResult
from .models.test_parameters import TestType, ParameterDefinition, TestResult, ParameterValue

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
    
    def get_queryset(self, request):
        # Show associated test results in the inline
        return super().get_queryset(request).prefetch_related('test_results')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'user', 'health_issue', 'document_date')
    list_filter = ('document_type', 'document_date')
    search_fields = ('title', 'description')

# Inline admin for parameter values
class ParameterValueInline(admin.TabularInline):
    model = ParameterValue
    extra = 1
    fields = ('parameter', 'numeric_value', 'text_value', 'boolean_value', 'is_abnormal')

# Inline admin for parameter definitions
class ParameterDefinitionInline(admin.TabularInline):
    model = ParameterDefinition.test_types.through
    extra = 1

# Admin for test results
@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'test_type', 'lab_result', 'performed_at')
    list_filter = ('test_type', 'performed_at')
    search_fields = ('test_type__name', 'lab_result__id')
    inlines = [ParameterValueInline]

# Admin for test types
@admin.register(TestType)
class TestTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category')
    search_fields = ('name', 'code', 'category')
    inlines = [ParameterDefinitionInline]

# Admin for parameter definitions
@admin.register(ParameterDefinition)
class ParameterDefinitionAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'unit', 'data_type')
    list_filter = ('data_type',)
    search_fields = ('name', 'code')
    exclude = ('test_types',)

# Admin for parameter values
@admin.register(ParameterValue)
class ParameterValueAdmin(admin.ModelAdmin):
    list_display = ('parameter', 'get_display_value', 'is_abnormal', 'test_result')
    list_filter = ('is_abnormal', 'parameter__name', 'test_result__test_type')
    search_fields = ('parameter__name', 'parameter__code')
    
    def get_display_value(self, obj):
        return obj.get_value()
    get_display_value.short_description = 'Value'
