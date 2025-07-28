from django.contrib import admin
from .models import Department, Employee, TaskStatus


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'created_at', 'updated_at')
    search_fields = ('name', 'location')
    list_filter = ('location',)
    ordering = ('-created_at',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'department', 'status', 'date_of_joining', 'date_of_exit', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('status', 'department')
    ordering = ('-created_at',)


@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'get_employee_email', 'task_type', 'status', 'created_at', 'updated_at')
    search_fields = ('employee__name', 'employee__email')
    list_filter = ('status', 'task_type')
    ordering = ('-created_at',)

    def get_employee_email(self, obj):
        return obj.employee.email
    get_employee_email.short_description = 'Employee Email'