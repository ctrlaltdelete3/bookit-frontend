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
      //note: this is to prevent infinite loop: if the refresh endpoint itself returns 401, don't try to refresh again
      if (error.status === 401 && !req.url.includes('/api/refreshtoken/refresh')) {
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
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
          );
      }
      return throwError(() => error);
    }),
  );
};
