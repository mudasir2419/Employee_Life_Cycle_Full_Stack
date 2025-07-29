import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../../layouts/auth-layout/auth-layout';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthLayoutComponent],
  templateUrl: './forgot-password.html',

})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';
  loading = false;

  private auth = inject(AuthService);

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.error = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.message = 'Password reset link sent to your email.';
        this.loading = false;
      },
      error: () => {
        this.error = 'Email not found';
        this.loading = false;
      }
    });
  }
}
