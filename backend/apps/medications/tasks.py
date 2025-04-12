from celery import shared_task
from datetime import datetime, timedelta
from django.db.models import Q
from .models.medication_plan import MedicationPlan
from .models.notification import MedicationNotification
from .models.medication_time import MedicationTime

@shared_task
def generate_medication_notifications():
    """
    Generate notifications for upcoming medications.
    Runs periodically to create notifications for the next 24 hours.
    """
    now = datetime.now()
    end_time = now + timedelta(days=1)
    today_weekday = now.weekday()
    tomorrow_weekday = (today_weekday + 1) % 7

    # Get all active medication plans
    active_plans = MedicationPlan.objects.filter(
        status='Active',
        Q(end_date__isnull=True) | Q(end_date__gte=now.date())
    ).select_related('user').prefetch_related('medication_times')

    notifications_to_create = []

    for plan in active_plans:
        # Get medication times for today and tomorrow
        times = plan.medication_times.filter(
            Q(is_daily=True) |
            Q(day_of_week__in=[today_weekday, tomorrow_weekday])
        )

        for time in times:
            # Calculate the next occurrence of this medication time
            time_obj = datetime.combine(
                now.date() if time.day_of_week == today_weekday else end_time.date(),
                time.time
            )

            # Skip if the time has passed for today
            if time_obj < now:
                continue

            # Calculate when the notification should be sent
            notify_at = time_obj - timedelta(minutes=plan.notification_time)

            # Create notification if it doesn't exist
            if not MedicationNotification.objects.filter(
                medication_plan=plan,
                scheduled_time=time_obj,
                status='pending'
            ).exists():
                message = (
                    f"Time to take {plan.medication_name}: "
                    f"{time.dose_override or plan.dose_amount}"
                )
                if time.notes:
                    message += f"\nNotes: {time.notes}"

                notifications_to_create.append(
                    MedicationNotification(
                        user=plan.user,
                        medication_plan=plan,
                        scheduled_time=time_obj,
                        remind_before_minutes=plan.notification_time,
                        message=message,
                        is_enabled=plan.notifications_enabled
                    )
                )

    # Bulk create notifications
    if notifications_to_create:
        MedicationNotification.objects.bulk_create(notifications_to_create)

@shared_task
def clean_old_notifications():
    """
    Remove old notifications that are no longer needed.
    Keeps the last 7 days of notification history.
    """
    cutoff_date = datetime.now() - timedelta(days=7)
    MedicationNotification.objects.filter(
        scheduled_time__lt=cutoff_date
    ).delete()