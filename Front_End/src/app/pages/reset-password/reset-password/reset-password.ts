import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../../layouts/auth-layout/auth-layout';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthLayoutComponent],
  templateUrl: './reset-password.html'
})
export class ResetPasswordComponent {
  password = '';
  message = '';
  error = '';
  loading = false;

  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.error = '';

    const uid = this.route.snapshot.paramMap.get('uid') || '';
    const token = this.route.snapshot.paramMap.get('token') || '';

    this.auth.resetPassword(uid, token, this.password).subscribe({
      next: () => {
        this.message = 'Password reset successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        this.loading = false;
      },
      error: () => {
        this.error = 'Invalid or expired link.';
        this.loading = false;
      }
    });
  }
}
