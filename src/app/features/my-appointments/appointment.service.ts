import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Appointment } from './appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private httpClient = inject(HttpClient);

  getMyAppointments() {
    return this.httpClient.get<Appointment[]>('/api/appointments/my');
  }

  cancelAppointment(id: number, cancelationMessage: string | null) {
    return this.httpClient.put<Appointment>(`/api/appointments/${id}/cancel`, {
      cancelationMessage,
    });
  }
}
