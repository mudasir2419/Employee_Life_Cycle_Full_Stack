

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private jwtHelper = new JwtHelperService();

  // API URLs
  private loginUrl = `${environment.apiBaseUrl}account/login/`;
  private registerUrl = `${environment.apiBaseUrl}account/register/`;
  private forgotPasswordUrl = `${environment.apiBaseUrl}${environment.endpoints.forgotPassword}`;
  private resetPasswordUrl = `${environment.apiBaseUrl}${environment.endpoints.resetPassword}`;

  constructor(private http: HttpClient) {}

  // Register a new user
  register(email: string, password: string, first_name: string, last_name: string): Observable<any> {
    return this.http.post(this.registerUrl, {
      email,
      password,
      first_name,
      last_name
    });
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }

  // Save token in localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check login status
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  // Get user email from token
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.email || null;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Forgot password
  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.forgotPasswordUrl, { email });
  }

  // Reset password
  resetPassword(uid: string, token: string, password: string): Observable<any> {
    return this.http.post(this.resetPasswordUrl, {
      uid,
      token,
      password
    });
  }
}
