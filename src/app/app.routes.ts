import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Home } from './features/home/home';
import { authGuard } from './core/auth/auth.guard';
import { redirectGuard } from './core/auth/redirect.guard';
import { Tenant } from './features/tenant/tenant';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 't/:slug',
    component: Tenant,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
