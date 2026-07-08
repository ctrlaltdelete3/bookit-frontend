import { Component, inject, OnInit } from '@angular/core';
import { WorkingHoursService } from './working-hours.service';
import { WorkingHoursInput } from './working-hours.model';
import { TenantService } from '../../tenant/tenant.service';
import { WorkingHours as WorkingHoursModel } from '../../tenant/tenant.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DayOfWeekPipe } from '../../../shared/pipes/day-of-week-pipe';

@Component({
  selector: 'app-working-hours',
  imports: [ReactiveFormsModule, DayOfWeekPipe],
  templateUrl: './working-hours.html',
  styleUrl: './working-hours.css',
})
export class WorkingHours implements OnInit {
  private workingHoursService = inject(WorkingHoursService);
  private tenantService = inject(TenantService);
  private tenantSlug: string | null = null;

  form = new FormGroup({
    days: new FormArray<FormGroup>([]),
  });

  get days() {
    return this.form.controls.days;
  }

  ngOnInit() {
    this.tenantService.getMyTenant().subscribe((tenant) => {
      this.tenantSlug = tenant.slug;
      this.loadWorkingHours();
    });
  }

  loadWorkingHours() {
    if (!this.tenantSlug) {
      return;
    }
    this.tenantService
      .getWorkingHoursBySlug(this.tenantSlug)
      .subscribe((workingHours) => this.buildForm(workingHours));
  }

  private buildForm(existing: WorkingHoursModel[]) {
    this.days.clear();
    for (let day = 0; day <= 6; day++) {
      const found = existing.find((wh) => wh.dayOfWeek === day);
      this.days.push(
        new FormGroup({
          dayOfWeek: new FormControl(day, { nonNullable: true }),
          isWorkingDay: new FormControl(found?.isWorkingDay ?? false, { nonNullable: true }),
          startTime: new FormControl(found?.startTime ?? null),
          endTime: new FormControl(found?.endTime ?? null),
          pauseStart: new FormControl(found?.pauseStart ?? null),
          pauseEnd: new FormControl(found?.pauseEnd ?? null),
        }),
      );
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const workingHours = this.days.value as WorkingHoursInput[];
    this.workingHoursService.setWorkingHours(workingHours).subscribe(() => this.loadWorkingHours());
  }
}
