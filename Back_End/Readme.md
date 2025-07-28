# Employee Lifecycle Management System (Backend)

This is the backend of the **Employee Lifecycle Management System**, built with Django and Django REST Framework. 
It provides a secure authentication system, manages employee onboarding/offboarding workflows 
using Celery + Redis, and supports department-wise organization.

---

## Features

- JWT Authentication (email-based)
- User Registration, Login, Profile
- Forgot/Reset Password via Email
- Department & Employee CRUD
- Automated Onboarding/Offboarding Email Notifications
- Task Queue Management (Celery + Redis)
- Task Retry Logic for Failures
- MySQL Database Integration

---

## Tech Stack

| Tool                   | Usage                          |
|---------------------   |--------------------------------|
| Django 5               | Web framework                  |
| Django REST Framework  | API building                   |
| Celery + Redis         | Background task queueing       |
| MySQL                  | Relational database            |
| Gmail SMTP             | Email delivery                 |
| SimpleJWT              | Token-based authentication     |

---

## Project Structure

employee_lifecycle/
├── account/ # Auth app (register, login, reset password)
├── emp_app/ # Department, Employee, Task models
├── employee_lifecycle/ # Project config & Celery setup
├── .env # Env variables
├── requirements.txt
└── manage.py


---

## Environment Setup

1. **Clone the repository**

```bash
git clone <your_repo_url>
cd employee_lifecycle


2. Create & activate a virtual environment

python -m venv venv
source venv/bin/activate   
or venv\Scripts\activate (Windows)


3. Install dependencies

pip install -r requirements.txt


4. Configure .env


# Database
DB_NAME=db_name
DB_USER=user_name
DB_PASSWORD=pwd
DB_HOST=localhost
DB_PORT=3306

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# Redis + Celery
REDIS_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=django-db


# Celery commands

Celery + Redis Commands for Employee Lifecycle Management System
==================================================================

To run background tasks like onboarding/offboarding emails, follow these steps:

------------------------------------------------------------
Start Redis Server
------------------------------------------------------------

redis-server
 Make sure Redis is installed and running in the background.

------------------------------------------------------------
Start Celery Worker (Always Required)
------------------------------------------------------------
-> celery -A employee_lifecycle worker --loglevel=info --pool=solo


This command starts the Celery worker that listens for tasks and executes them.
Used for sending emails and handling async jobs.

------------------------------------------------------------




5. Apply migrations & create superuser

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

6. Run the development server

python manage.py runserver



## API Endpoints
-> Account Authentication (/api/account/)

| Method | Endpoint            | Description                      | Auth Required|
| ------ | ------------------- | -------------------------------- | -------------|
| POST   | `/register/`        | Register a new user              |   No         |
| POST   | `/login/`           | Login & get JWT tokens           |   No         |
| POST   | `/refresh/`         | Refresh JWT token                |   No         |
| GET    | `/profile/`         | Get logged-in user profile       |   Yes        |
| POST   | `/forgot-password/` | Send password reset email        |   No         |
| POST   | `/reset-password/`  | Reset password using token + uid |   No         |



## Employee & Department Management (/api/)


| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| GET    | `/departments/`      | List all departments    |    Yes        |
| POST   | `/departments/`      | Create a new department |    Yes        |
| PUT    | `/departments/{id}/` | Update a department     |    Yes        |
| DELETE | `/departments/{id}/` | Delete a department     |    Yes        |


| Method | Endpoint           | Description                                             | Auth Required |
| ------ | ------------------ | ------------------------------------------------------- | ------------- |
| GET    | `/employees/`      | List all employees                                      |    Yes        |
| POST   | `/employees/`      | Create a new employee                                   |    Yes        |
| PUT    | `/employees/{id}/` | Update an employee (status change triggers Celery task) |    Yes        |
| DELETE | `/employees/{id}/` | Delete an employee                                      |    Yes        |



## Task Status & Retry (/api/tasks/)


| Method | Endpoint             | Description                          | Auth Required |
| ------ | -------------------- | ------------------------------------ | ------------- |
| GET    | `/tasks/`            | List all background tasks            |   Yes         |
| POST   | `/tasks/{id}/retry/` | Retry a failed/pending task manually |   Yes         |



## Email Templates
Onboarding: “Welcome to the Company!”

Offboarding: “Goodbye and Good Luck!”

Forgot Password: Link to reset (e.g., http://localhost:4200/auth/reset-password/{uid}/{token})



## Celery Task Flow
Onboarding/Offboarding:

Triggered automatically when employee status changes.

Tasks are tracked via TaskStatus model.

Retry logic built-in (up to 3 retries).

Email sent to employee via SMTP.


## JWT Configuration
Access Token: 10 minutes

Refresh Token: 1 day

Blacklist & Rotation: Enabled



Set in settings.py via:

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=10),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}




## Author
Developed by Mudasir
Feel free to connect for collaboration or feedback!