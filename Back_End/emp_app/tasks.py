from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils.timezone import now
from .models import TaskStatus, Employee
import logging

logger = logging.getLogger(__name__)


# ONBOARDING TASK

@shared_task(bind=True, max_retries=3)
def process_onboarding_task(self, task_id):
    try:
        task = TaskStatus.objects.get(id=task_id)
        task.status = 'processing'
        task.save()

        employee = task.employee
        logger.info(f"[Onboarding] Processing employee: {employee.email}")

        subject = "Welcome to the Company!"
        message = f"Hello {employee.name},\n\nWelcome to our organization! We're excited to have you."

        send_mail(subject, message, settings.EMAIL_HOST_USER, [employee.email])

        
        employee.status = 'onboarded'
        employee.date_of_exit = None
        employee.save(update_fields=['status', 'date_of_exit'])
        logger.info(f"[Onboarding] Updated employee: status=onboarded, exit_date=None")

        task.status = 'success'
        task.save()
        logger.info(f"[Onboarding] Task completed successfully for {employee.email}")

    except Exception as e:
        logger.error(f"[Onboarding] Error: {str(e)}")
        try:
            self.retry(exc=e, countdown=60)
        except self.MaxRetriesExceededError:
            task = TaskStatus.objects.get(id=task_id)
            task.status = 'failed'
            task.error_message = str(e)
            task.save()



# OFFBOARDING TASK

@shared_task(bind=True, max_retries=3)
def process_offboarding_task(self, task_id):
    try:
        task = TaskStatus.objects.get(id=task_id)
        task.status = 'processing'
        task.save()

        employee = task.employee
        logger.info(f"[Offboarding] Processing employee: {employee.email}")

        subject = "Goodbye and Good Luck!"
        message = f"Dear {employee.name},\n\nThank you for your contributions. Best wishes for the future!"
        send_mail(subject, message, settings.EMAIL_HOST_USER, [employee.email])

        
        employee.status = 'offboarded'
        employee.date_of_exit = now().date()
        employee.save(update_fields=['status', 'date_of_exit', 'updated_at'])

        logger.info(f"[Offboarding] Updated employee: status=offboarded, exit_date={employee.date_of_exit}")

        task.status = 'success'
        task.save()
        logger.info(f"[Offboarding] Task completed successfully for {employee.email}")

    except Exception as e:
        logger.error(f"[Offboarding] Error: {str(e)}")
        try:
            self.retry(exc=e, countdown=60)
        except self.MaxRetriesExceededError:
            task = TaskStatus.objects.get(id=task_id)
            task.status = 'failed'
            task.error_message = str(e)
            task.save()
