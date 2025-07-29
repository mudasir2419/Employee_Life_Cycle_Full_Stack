import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Employees } from './components/employees/employees';
import { Departments } from './components/departments/departments';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './pages/guards/auth.guard';
import { RegisterComponent } from './pages/register/register/register';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password/reset-password';



export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/reset-password/:uid/:token', component: ResetPasswordComponent },
 
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'employees', component: Employees, canActivate: [authGuard] },
  { path: 'departments', component: Departments, canActivate: [authGuard] },
 
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];



