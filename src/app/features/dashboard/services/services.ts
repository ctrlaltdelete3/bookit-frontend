import { Component, inject, OnInit, signal } from '@angular/core';
import { TenantService } from '../../tenant/tenant.service';
import { ServiceService } from './services.service';
import { Service } from '../../tenant/tenant.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceInput } from './service.model';

@Component({
  selector: 'app-services',
  imports: [ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  private tenantService = inject(TenantService);
  private servicesService = inject(ServiceService);
  services = signal<Service[]>([]);
  private tenantSlug: string | null = null;
  isFormOpen = false;
  editingServiceId: number | null = null;

  ngOnInit() {
    this.tenantService.getMyTenant().subscribe((tenant) => {
      this.tenantSlug = tenant.slug;
      this.loadServices();
    });
  }

  private loadServices() {
    if (!this.tenantSlug) {
      return;
    }
    this.tenantService
      .getServicesBySlug(this.tenantSlug)
      .subscribe((services) => this.services.set(services));
  }

  form = new FormGroup({
    serviceName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    description: new FormControl(''),
    duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    breakAfterService: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const { serviceName, description, duration, breakAfterService, price } = this.form.value;
    const serviceInput: ServiceInput = {
      name: serviceName!,
      description: description!,
      durationMinutes: duration!,
      breakMinutesAfterService: breakAfterService!,
      price: price!,
    };

    if (this.editingServiceId !== null) {
      this.servicesService.updateService(this.editingServiceId, serviceInput).subscribe(() => {
        this.loadServices();
        this.closeForm();
      });
    } else {
      this.servicesService.createService(serviceInput).subscribe(() => {
        this.loadServices();
        this.closeForm();
      });
    }
  }

  onDelete(serviceId: number) {
    this.servicesService.deleteService(serviceId).subscribe(() => this.loadServices());
  }

  onOpenAddForm() {
    this.editingServiceId = null;
    this.form.reset();
    this.isFormOpen = true;
  }

  onOpenEditForm(service: Service) {
    this.editingServiceId = service.id;
    this.form.patchValue({
      serviceName: service.name,
      description: service.description,
      duration: service.durationMinutes,
      breakAfterService: service.breakMinutesAfterService,
      price: service.price,
    });
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
    this.editingServiceId = null;
    this.form.reset();
  }
}
