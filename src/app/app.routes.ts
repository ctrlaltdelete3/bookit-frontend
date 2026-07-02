import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Home } from './features/home/home';
import { authGuard } from './core/auth/auth.guard';
import { redirectGuard } from './core/auth/redirect.guard';
import { Tenant } from './features/tenant/tenant';
import { MyAppointments } from './features/my-appointments/my-appointments';
import { Booking } from './features/booking/booking';
import { Dashboard } from './features/dashboard/dashboard';
import { tenantOwnerGuard } from './core/auth/tenant-owner-guard';

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
    path: 't/:slug/book',
    component: Booking,
    canActivate: [authGuard],
  },
  {
    path: 'my-appointments',
    component: MyAppointments,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard, tenantOwnerGuard],
    children: [{ path: '', redirectTo: 'appointments', pathMatch: 'full' }],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
