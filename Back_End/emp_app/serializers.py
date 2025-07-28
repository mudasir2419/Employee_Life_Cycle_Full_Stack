
from rest_framework import serializers
from .models import Department, Employee, TaskStatus

# ---------------- Department Serializer ----------------
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'location', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


# ---------------- Employee Serializer ----------------
class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'email', 'date_of_joining', 'date_of_exit',
            'department', 'department_name', 'status', 'created_at', 'updated_at'
        ]
        
        read_only_fields = ['created_at', 'updated_at', 'date_of_exit']


# ---------------- Task Status Serializer ----------------
class TaskStatusSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = TaskStatus
        fields = [
            'id', 'employee', 'employee_name', 'task_type',
            'status', 'error_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

