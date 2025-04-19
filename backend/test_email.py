"""
Test script to diagnose email sending issues
Run from the Django shell: python manage.py shell < test_email.py
"""

from django.core.mail import send_mail
from django.conf import settings
import logging
import sys

# Set up logging to console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('email_test')

def test_email_config():
    """Test email configuration by sending a test email."""
    
    logger.info("Testing email configuration...")
    
    # Log email settings (without printing sensitive info)
    logger.info(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    logger.info(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    logger.info(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    logger.info(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    logger.info(f"EMAIL_HOST_USER: {'Set' if settings.EMAIL_HOST_USER else 'Not set'}")
    logger.info(f"EMAIL_HOST_PASSWORD: {'Set' if settings.EMAIL_HOST_PASSWORD else 'Not set'}")
    logger.info(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    
    # Test email address (replace with your actual email for testing)
    test_email = "your.email@example.com"  # Replace with your email
    
    try:
        # Attempt to send test email
        logger.info(f"Attempting to send test email to {test_email}")
        
        send_mail(
            'Ibn Sina Health - Email Test',
            'This is a test email to verify that the email configuration is working correctly.',
            settings.DEFAULT_FROM_EMAIL,
            [test_email],
            fail_silently=False,
        )
        
        logger.info("Test email sent successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error sending test email: {str(e)}")
        
        # Check for common SMTP issues
        if "Authentication" in str(e):
            logger.error("Email authentication failed. Check your EMAIL_HOST_USER and EMAIL_HOST_PASSWORD.")
        elif "SMTP" in str(e):
            logger.error("SMTP connection issue. Check your EMAIL_HOST and EMAIL_PORT settings.")
        elif "SSL" in str(e) or "TLS" in str(e):
            logger.error("SSL/TLS issue. Check your EMAIL_USE_TLS setting.")
            
        return False

if __name__ == "__main__":
    test_email_config()