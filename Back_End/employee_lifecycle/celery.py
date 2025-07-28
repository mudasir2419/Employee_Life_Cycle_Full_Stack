
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'employee_lifecycle.settings')

app = Celery('employee_lifecycle')

# Load settings from Django settings file with CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all apps
app.autodiscover_tasks()



