import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../../layouts/auth-layout/auth-layout';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthLayoutComponent], 
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  first_name = '';
  last_name = '';
  loading = false;
  error = '';
  success = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onRegister(event?: Event) {
    if (event) event.preventDefault();
    this.loading = true;
    this.error = '';
    this.success = '';

    this.auth.register(this.email, this.password, this.first_name, this.last_name).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login...';
        this.loading = false;

        // Redirect to login after short delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registration Error:', err);
        this.error = err.error?.detail || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
