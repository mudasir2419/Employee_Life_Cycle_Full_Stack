from django.db import models


# Department Model
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dept'
        ordering = ['-created_at']

    def __str__(self):
        return self.name



# Employee Model
class Employee(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('onboarded', 'Onboarded'),
        ('offboarded', 'Offboarded'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_joining = models.DateField()
    date_of_exit = models.DateField(null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'emp'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.department.name}"


# Task Status Model (Queue Tracking)
class TaskStatus(models.Model):
    TASK_TYPE_CHOICES = [
        ('onboard', 'Onboarding'),
        ('offboard', 'Offboarding'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    # employee_email = models.EmailField()
    task_type = models.CharField(max_length=20, choices=TASK_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta: 
        db_table = 'task_status'
        ordering = ['-created_at']  


    def __str__(self):
        return f"{self.employee.name} - {self.task_type} - {self.status}"
