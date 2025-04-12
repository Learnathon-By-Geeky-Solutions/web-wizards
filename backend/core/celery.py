import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

# Use settings from Django settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Configure periodic tasks
app.conf.beat_schedule = {
    'generate-medication-notifications': {
        'task': 'apps.medications.tasks.generate_medication_notifications',
        'schedule': crontab(minute='*/15'),  # Run every 15 minutes
    },
    'clean-old-notifications': {
        'task': 'apps.medications.tasks.clean_old_notifications',
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
    },
}