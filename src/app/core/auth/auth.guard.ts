import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // no token - go to login
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // there is a token - pass through
  if (!authService.isAccessTokenExpired()) {
    return true;
  }

  // token expired - try silent refresh first
  return authService.refreshAccessToken().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
