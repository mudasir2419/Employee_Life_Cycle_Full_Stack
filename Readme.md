
### Employee Lifecycle Management System - Project Flow 


+-----------------+              
|     User        |   <-- HR/Admin interacts with UI
+-----------------+
         |
         v
+------------------------------+
|       Frontend (Angular)     |
|------------------------------|
| - Login/Register (JWT Auth) |
| - Dashboard (Task Status)   |
| - Employees CRUD            |
| - Departments CRUD          |
+------------------------------+
         |
         v
+------------------------------+
|      Backend (Django + DRF)  |
|------------------------------|
| - /account/ (Auth APIs)     |
| - /employees/ (CRUD APIs)   |
| - /departments/ (CRUD APIs) |
| - Task triggers for Celery  |
+------------------------------+
         |
         v
+------------------------------+
|     Celery Task Queue        |
|------------------------------|
| - Handles async tasks        |
| - Sends onboarding/offboarding emails |
+------------------------------+
         |
         v
+------------------+     +--------------------+
|     Redis        | --> |   Gmail SMTP        |
| (Message Broker) |     | (Email Sending API) |
+------------------+     +--------------------+
```


### Example Workflow

1. User logs in (JWT issued and stored)
2. User creates a department
3. User adds an employee under a department
4. Employee status changed to "Onboarded"
5. Django triggers a Celery task
6. Celery pushes job into Redis queue
7. Task is picked up and sends email via Gmail SMTP
8. Task status is saved and shown on dashboard
