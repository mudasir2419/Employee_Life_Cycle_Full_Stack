from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Department, Employee, TaskStatus
from .serializers import DepartmentSerializer, EmployeeSerializer, TaskStatusSerializer
from .tasks import process_onboarding_task, process_offboarding_task


# Department ViewSet
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('-id')
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


# Employee ViewSet
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('department').all().order_by('-id')
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Handle task for newly created employee if status is not 'pending'."""
        employee = serializer.save()
        if employee.status == 'onboarded':
            task = TaskStatus.objects.create(employee=employee, task_type='onboard')
            process_onboarding_task.delay(task.id)
        elif employee.status == 'offboarded':
            task = TaskStatus.objects.create(employee=employee, task_type='offboard')
            process_offboarding_task.delay(task.id)

    def perform_update(self, serializer):
        """Handle status change when updating an employee."""
        old_status = self.get_object().status
        employee = serializer.save()

        if old_status != employee.status:
            if employee.status == 'onboarded':
                task = TaskStatus.objects.create(employee=employee, task_type='onboard')
                process_onboarding_task.delay(task.id)
            elif employee.status == 'offboarded':
                task = TaskStatus.objects.create(employee=employee, task_type='offboard')
                process_offboarding_task.delay(task.id)


# Task Status ViewSet
class TaskStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TaskStatus.objects.all().order_by('-created_at')
    serializer_class = TaskStatusSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def retry(self, request, pk=None):
        try:
            task = self.get_object()

            if task.status not in ['failed', 'pending']:
                return Response({'detail': 'Task is not retryable'}, status=status.HTTP_400_BAD_REQUEST)

            task.status = 'pending'
            task.error_message = ''
            task.save()

            if task.task_type == 'onboard':
                process_onboarding_task.delay(task.id)
            elif task.task_type == 'offboard':
                process_offboarding_task.delay(task.id)
            else:
                return Response({'detail': 'Unknown task type'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'detail': 'Retry initiated'}, status=status.HTTP_200_OK)

        except TaskStatus.DoesNotExist:
            return Response({'detail': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
