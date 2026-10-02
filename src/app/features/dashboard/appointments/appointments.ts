import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../../core/appointments/appointment.service';
import { Appointment } from '../../../core/appointments/appointment.model';
import {
  AppointmentStatus,
  AppointmentStatusType,
} from '../../../shared/appointment-status.constants';

@Component({
  selector: 'app-tenant-appointments',
  imports: [],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class TenantAppointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  tenantAppointments = signal<Appointment[] | undefined>(undefined);
  protected readonly AppointmentStatus = AppointmentStatus;

  ngOnInit() {
    this.loadTenantAppointments();
  }

  loadTenantAppointments() {
    this.appointmentService
      .getTenantAppointments()
      .subscribe((appointments) => this.tenantAppointments.set(appointments));
  }

  updateStatus(appointment: Appointment, newStatus: AppointmentStatusType, note: string) {
    this.appointmentService
      .updateAppointment(appointment.id, newStatus, note || null)
      .subscribe(() => this.loadTenantAppointments());
  }
}
