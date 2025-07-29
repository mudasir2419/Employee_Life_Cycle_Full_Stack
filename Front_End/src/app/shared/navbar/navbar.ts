

import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  appTitle = 'Employee Lifecycle';
  username: string | null = null;

  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.username = this.auth.getUserEmail();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getUserEmail(): string | null {
    return this.auth.getUserEmail();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
