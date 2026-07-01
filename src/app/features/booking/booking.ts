import { Component, inject, OnInit, signal } from '@angular/core';
import { Service, Tenant } from '../tenant/tenant.model';
import { AvailableSlot } from './availability.model';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TenantService } from '../tenant/tenant.service';
import { AvailabilityService } from './availability.service';
import { AppointmentService } from '../../core/appointments/appointment.service';

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private route = inject(ActivatedRoute);
  private tenantService = inject(TenantService);
  private availabilityService = inject(AvailabilityService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  tenant = signal<Tenant | null>(null);
  services = signal<Service[]>([]);
  currentStep = signal(1);
  selectedService = signal<Service | null>(null);
  selectedDate = signal('');
  availableSlots = signal<AvailableSlot[]>([]);
  selectedSlot = signal<AvailableSlot | null>(null);
  note = signal('');

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    forkJoin({
      tenant: this.tenantService.getBySlug(slug),
      services: this.tenantService.getServicesBySlug(slug),
    }).subscribe(({ tenant, services }) => {
      this.tenant.set(tenant);
      this.services.set(services.filter((s) => s.isActive));
    });
  }

  selectService(service: Service) {
    this.selectedService.set(service);
    this.currentStep.set(2);
  }

  onDateChange(date: string) {
    this.selectedDate.set(date);
    this.availableSlots.set([]);
    this.selectedSlot.set(null);

    const tenant = this.tenant();
    const service = this.selectedService();

    if (!tenant || !service || !date) {
      return;
    }

    this.availabilityService
      .getSlots(tenant.id, service.id, date)
      .subscribe((slots) => this.availableSlots.set(slots));
  }

  selectSlot(slot: AvailableSlot) {
    this.selectedSlot.set(slot);
    this.currentStep.set(3);
  }

  submit() {
    const tenant = this.tenant();
    const service = this.selectedService();
    const slot = this.selectedSlot();

    if (!tenant || !service || !slot) {
      return;
    }

    this.appointmentService
      .createAppointment(tenant.id, service.id, slot.date, slot.startTime, this.note() || null)
      .subscribe(() => this.router.navigate(['/my-appointments']));
  }
}
