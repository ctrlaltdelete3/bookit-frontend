import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentService } from '../../core/appointments/appointment.service';
import { Appointment } from '../../core/appointments/appointment.model';
import { AppointmentStatus } from '../../shared/appointment-status.constants';

@Component({
  selector: 'app-my-appointments',
  imports: [],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit {
  protected readonly AppointmentStatus = AppointmentStatus;
  private appointmentsService = inject(AppointmentService);
  myAppointments = signal<Appointment[] | undefined>(undefined);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentsService
      .getMyAppointments()
      .subscribe((appointments) => this.myAppointments.set(appointments));
  }

  onCancelAppointment(appointment: Appointment) {
    //TODO: instead of null add field for cancelation message
    this.appointmentsService.cancelAppointment(appointment.id, null).subscribe(() => {
      this.loadAppointments();
    });
  }
}
