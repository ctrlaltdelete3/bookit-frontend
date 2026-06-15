import { Component, inject, OnInit, signal } from '@angular/core';
import { TenantService } from './tenant.service';
import { ActivatedRoute } from '@angular/router';
import { Service, Tenant as TenantModel, WorkingHours } from './tenant.model';
import { DayOfWeekPipe } from '../../shared/pipes/day-of-week-pipe';

@Component({
  selector: 'app-tenant',
  imports: [DayOfWeekPipe],
  templateUrl: './tenant.html',
  styleUrl: './tenant.css',
})
export class Tenant implements OnInit {
  private tenantService = inject(TenantService);
  private route = inject(ActivatedRoute);
  tenant = signal<TenantModel | undefined>(undefined);
  tenantServices = signal<Service[] | undefined>(undefined);
  workingHours = signal<WorkingHours[] | undefined>(undefined);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.tenantService.getBySlug(slug).subscribe((tenant) => {
      this.tenant.set(tenant);
    });
    this.tenantService.getServicesBySlug(slug).subscribe((servicesBySlug) => {
      this.tenantServices.set(servicesBySlug);
    });
    this.tenantService.getWorkingHoursBySlug(slug).subscribe((workingHoursBySlug) => {
      this.workingHours.set(workingHoursBySlug);
    });
  }
}
