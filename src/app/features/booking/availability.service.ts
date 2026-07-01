import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AvailableSlot } from './availability.model';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private httpClient = inject(HttpClient);

  getSlots(tenantId: number, serviceId: number, date: string) {
    return this.httpClient.get<AvailableSlot[]>('/api/availability', {
      params: { tenantId, serviceId, date },
    });
  }
}
