import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthLayoutComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onLogin(event?: Event) {
    if (event) event.preventDefault();
    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res: { access: string; refresh?: string }) => {
        if (res.access) {
          this.auth.saveToken(res.access);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Login failed: No token in response';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.error = 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
