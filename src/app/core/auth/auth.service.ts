import { HttpClient, HttpBackend } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest, User, NewAccessToken } from './auth.model';
import { finalize, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  currentUser = signal<User | undefined>(undefined);
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private refreshClient = new HttpClient(inject(HttpBackend));

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
      finalize(() => {
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

  isAccessTokenExpired(): boolean {
    const token = this.tokenSignal();
    if (!token) return true;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  refreshAccessToken() {
    return this.refreshClient
      .post<NewAccessToken>('/api/refreshtoken/refresh', null, { withCredentials: true })
      .pipe(
        tap((response) => this.setToken(response.accessToken)),
        catchError((error) => {
          this.clearToken();
          return throwError(() => error);
        }),
      );
  }
}
