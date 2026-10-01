import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const tenantOwnerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return authService.isTenantOwner() ? true : router.createUrlTree(['/']);
  }

  return authService.getCurrentUser().pipe(
    map(() => (authService.isTenantOwner() ? true : router.createUrlTree(['/']))),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
