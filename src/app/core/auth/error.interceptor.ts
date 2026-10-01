import { HttpBackend, HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { NewAccessToken } from './auth.model';
import { AuthService } from './auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const httpBackend = inject(HttpBackend);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      // don't try to refresh for auth requests:
      // - login/register: 401 means wrong credentials, not an expired token
      // - refresh: prevents an infinite loop if the refresh endpoint itself returns 401
      const isAuthRequest =
        req.url.includes('/api/user/login') ||
        req.url.includes('/api/user/register') ||
        req.url.includes('/api/refreshtoken/refresh');

      if (error.status === 401 && !isAuthRequest) {
        const refreshClient = new HttpClient(httpBackend);
        return refreshClient
          .post<NewAccessToken>('/api/refreshtoken/refresh', null, { withCredentials: true })
          .pipe(
            switchMap((response) => {
              authService.setToken(response.accessToken);
              const newRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`),
              });
              return next(newRequest);
            }),
            catchError((refreshError) => {
              authService.clearToken();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
          );
      }
      return throwError(() => error);
    }),
  );
};
