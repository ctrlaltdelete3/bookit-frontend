import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Service, Tenant, WorkingHours } from './tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private httpClient = inject(HttpClient);

  getBySlug(slug: string) {
    return this.httpClient.get<Tenant>(`/api/tenants/${slug}`);
  }

  getServicesBySlug(slug: string) {
    return this.httpClient.get<Service[]>(`/api/tenants/${slug}/services`);
  }

  getWorkingHoursBySlug(slug: string) {
    return this.httpClient.get<WorkingHours[]>(`/api/tenants/${slug}/working-hours`);
  }

  getMyTenant() {
    return this.httpClient.get<Tenant>('/api/tenants/my');
  }
}
