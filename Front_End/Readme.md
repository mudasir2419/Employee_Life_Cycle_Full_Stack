
# Employee Lifecycle Management System (Frontend)

This is the frontend for the **Employee Lifecycle Management System**, built with Angular 20 using modern **standalone components**, clean routing, and a responsive Bootstrap UI. It integrates with the Django REST backend and provides a sleek interface for authentication, employee/department management, and background task tracking.

---

## Features

- Email-based JWT Login
- Register, Forgot Password, Reset Password
- Secure dashboard with route guards
- Department & Employee CRUD
- Automatic onboarding/offboarding status
- Responsive ( Bootstrap) design

---


## Tech Stack

| Tool/Library        | Purpose                            |
|---------------------|------------------------------------|
| Angular 20          | Frontend framework                 |
| HttpClient          | API communication                  |
| Bootstrap + MDB     | UI/UX framework                    |
| Standalone Components | Modern Angular architecture      |

---

## Folder Structure

```

Front\_End\_Angular/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── login/            # Login / Register / Reset Password
│   │   │   ├── dashboard/        # Summary dashboard
│   │   │   ├── employees/        # Employee management
│   │   │   └── departments/      # Department management
│   │   ├── services/             # API services (auth, employee, department)
│   │   ├── guards/               # Route guards (auth check)
│   │   ├── app.routes.ts         # Angular routing
│   │   └── app.config.ts         # App-wide configuration
│   └── assets/
├── .env                         # API base URL config (optional)
└── angular.json / package.json

````

---

##  Setup Instructions

1. **Clone the repository**

```bash
git clone <your_repo_url>
cd Front_End
````

2. **Install dependencies**

```bash
npm install
```

3. **Configure API base URL (optional)**

You can set the API URL in `environment.ts` or `auth.service.ts`:

```ts
export const BASE_URL = "http://localhost:8000/api/";
```

4. **Run the development server**

```bash
ng serve
```

App will run on: [http://localhost:4200]

---

## Authentication Flow

* Users register/login using **email & password**
* JWT token is stored in `localStorage`
* AuthInterceptor adds the token to protected API calls
* Guards block unauthenticated access to protected routes
* Reset password flow integrates with email link from backend

---

## Integrated Endpoints (Backend → Frontend)

| Feature         | Backend Endpoint                | Frontend Route            |
| --------------- | ------------------------------- | ------------------------- |
| Register        | `/api/account/register/`        | `/auth/register`          |
| Login           | `/api/account/login/`           | `/auth/login`             |
| Forgot Password | `/api/account/forgot-password/` | `/auth/forgot`            |
| Reset Password  | `/api/account/reset-password/`  | `/auth/reset/:uid/:token` |
| Departments     | `/api/departments/`             | `/departments`            |
| Employees       | `/api/employees/`               | `/employees`              |
| Tasks           | `/api/tasks/`                   | `/dashboard`              |

---



## Route Structure

| Path                      | Component                 | Auth Guard |
| ------------------------- | ------------------------- | ---------- |
| `/auth/register`          | `RegisterComponent`       |  No        |
| `/auth/login`             | `LoginComponent`          |  No        |
| `/auth/forgot`            | `ForgotComponent`         |  No        |
| `/auth/reset/:uid/:token` | `ResetComponent`          |  No        |
| `/dashboard`              | `DashboardComponent`      |  Yes       |
| `/employees`              | `EmployeeListComponent`   |  Yes       |
| `/departments`            | `DepartmentListComponent` |  Yes       |

---

## Notes

* Ensure backend (`localhost:8000`) is running before frontend.
* CORS is enabled in Django backend.
* For emails (reset link), use Gmail SMTP with an app password.

---



