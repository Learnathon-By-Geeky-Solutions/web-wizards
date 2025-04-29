from django.apps import AppConfig


class NewsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.news'  # Important: use the correct dotted path here
    verbose_name = 'News'
