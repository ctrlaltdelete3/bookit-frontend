import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceInput } from './service.model';
import { Service } from '../../tenant/tenant.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private httpClient = inject(HttpClient);

  createService(newService: ServiceInput) {
    return this.httpClient.post<Service>('/api/services', newService);
  }

  deleteService(serviceId: number) {
    return this.httpClient.delete<void>(`/api/services/${serviceId}`);
  }

  updateService(serviceId: number, updatedService: ServiceInput) {
    return this.httpClient.put<Service>(`/api/services/${serviceId}`, updatedService);
  }

  getService(serviceId: number) {
    return this.httpClient.get<Service>(`/api/services/${serviceId}`);
  }

  //TODO: add these methods
  addTimeSlot() {}

  removeTimeSlot() {}
}
