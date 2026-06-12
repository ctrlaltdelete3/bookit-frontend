import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest } from './auth.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.httpClient.post<AuthResponse>('/api/user/login', { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  logout() {
    return this.httpClient.post('/api/user/logout', null).pipe(
      tap(() => {
        this.clearToken();
        this.router.navigate(['/login']);
      }),
    );
  }

  register(firstName: string, lastName: string, email: string, password: string, phone: string) {
    const body: RegisterRequest = { firstName, lastName, email, password, phone };
    return this.httpClient.post<AuthResponse>('/api/user/register', body).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}
