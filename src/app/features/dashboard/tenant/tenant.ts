import { Component, inject, OnInit, signal } from '@angular/core';
import { TenantService } from '../../tenant/tenant.service';
import { Tenant as TenantModel, UpdatedTenant } from '../../tenant/tenant.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-tenant',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tenant.html',
  styleUrl: './tenant.css',
})
export class Tenant implements OnInit {
  protected tenant = signal<TenantModel | null>(null);
  private tenantService = inject(TenantService);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    activityType: new FormControl('', [Validators.required]),
    description: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null),
    city: new FormControl<string | null>(null),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
    contactPhone: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.tenantService.getMyTenant().subscribe((tenant) => {
      this.tenant.set(tenant);
      this.form.patchValue({
        name: tenant.name,
        activityType: tenant.activityType,
        description: tenant.description,
        address: tenant.address,
        city: tenant.city,
        contactEmail: tenant.contactEmail,
        contactPhone: tenant.contactPhone,
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const currentTenant = this.tenant();
    if (!currentTenant) {
      return;
    }
    const updatedTenant = this.form.value as UpdatedTenant;
    this.tenantService
      .updateTenant(currentTenant.id, updatedTenant)
      .subscribe((tenant) => this.tenant.set(tenant));
  }
}
