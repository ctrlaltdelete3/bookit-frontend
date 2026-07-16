import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest, User } from './auth.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  currentUser = signal<User | undefined>(undefined);
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  isLoggedIn = computed(() => !!this.tokenSignal());
  isTenantOwner = computed(() => this.currentUser()?.isTenantOwner ?? false);

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponse>('/api/user/login', { email, password }, { withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.tokenSignal.set(response.token);
        }),
      );
  }

  logout() {
    return this.httpClient.post('/api/refreshtoken/logout', null, { withCredentials: true }).pipe(
      tap(() => {
        this.clearToken();
        this.router.navigate(['/login']);
      }),
    );
  }

  register(firstName: string, lastName: string, email: string, password: string, phone: string) {
    const body: RegisterRequest = { firstName, lastName, email, password, phone };
    return this.httpClient
      .post<AuthResponse>('/api/user/register', body, { withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.tokenSignal.set(response.token);
        }),
      );
  }

  getCurrentUser() {
    return this.httpClient.get<User>('/api/user/me').pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSignal.set(token);
  }

  clearToken() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
    this.currentUser.set(undefined);
  }
}
