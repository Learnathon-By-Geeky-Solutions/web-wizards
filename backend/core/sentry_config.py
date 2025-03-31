import os
import logging
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

def init_sentry():
    """
    Initialize Sentry with configuration from environment variables.
    """
    sentry_dsn = os.getenv('SENTRY_DSN', '')
    sentry_environment = os.getenv('SENTRY_ENVIRONMENT', 'development')
    sentry_traces_sample_rate = float(os.getenv('SENTRY_TRACES_SAMPLE_RATE', 0.2))
    sentry_profiles_sample_rate = float(os.getenv('SENTRY_PROFILES_SAMPLE_RATE', 0.1))
    sentry_enable_in_dev = os.getenv('SENTRY_ENABLE_DEV', 'false').lower() == 'true'

    # Only initialize Sentry if DSN is provided or in production
    if sentry_dsn or sentry_environment != 'development':
        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[
                DjangoIntegration(),
                LoggingIntegration(
                    level=logging.INFO,  # Capture info and above as breadcrumbs
                    event_level=logging.ERROR  # Send errors as events
                ),
            ],
            traces_sample_rate=sentry_traces_sample_rate,
            profiles_sample_rate=sentry_profiles_sample_rate,
            environment=sentry_environment,
            send_default_pii=False,
            release=os.getenv('SENTRY_RELEASE', '1.0.0'),
            before_send=lambda event, hint: event,  # Customize event filtering here
        )
        if sentry_environment == 'development':
            print(f"Sentry initialized with environment: {sentry_environment}")

def capture_exception(exception, context=None):
    """
    Capture an exception in Sentry with optional context.
    """
    sentry_sdk.capture_exception(exception)

def capture_message(message, level='info'):
    """
    Capture a message in Sentry with a specified level.
    """
    sentry_sdk.capture_message(message, level=level)

def add_breadcrumb(category, message, level='info', data=None):
    """
    Add a breadcrumb to the current Sentry scope.
    """
    sentry_sdk.add_breadcrumb(
        category=category,
        message=message,
        level=level,
        data=data,
    )