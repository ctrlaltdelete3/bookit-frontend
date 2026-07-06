import { Component, inject, OnInit, signal } from '@angular/core';
import { TenantService } from '../../tenant/tenant.service';
import { ServiceService } from './services.service';
import { switchMap } from 'rxjs';
import { Service } from '../../tenant/tenant.model';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  private tenantService = inject(TenantService);
  private servicesService = inject(ServiceService);
  services = signal<Service[]>([]);

  ngOnInit() {
    this.tenantService
      .getMyTenant()
      .pipe(switchMap((tenant) => this.tenantService.getServicesBySlug(tenant.slug)))
      .subscribe((services) => this.services.set(services));
  }
}
