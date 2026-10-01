import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { WorkingHoursService } from './working-hours.service';
import { WorkingHoursInput } from './working-hours.model';
import { TenantService } from '../../tenant/tenant.service';
import { WorkingHours as WorkingHoursModel } from '../../tenant/tenant.model';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DayOfWeekPipe } from '../../../shared/pipes/day-of-week-pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { workingDayValidator, workingDayErrorMessages } from './working-day.validator';
import { CompleteTimeDirective } from '../../../shared/directives/complete-time.directive';

const TIME_CONTROLS = ['startTime', 'endTime', 'pauseStart', 'pauseEnd'] as const;

@Component({
  selector: 'app-working-hours',
  imports: [ReactiveFormsModule, DayOfWeekPipe, CompleteTimeDirective],
  templateUrl: './working-hours.html',
  styleUrl: './working-hours.css',
})
export class WorkingHours implements OnInit {
  private workingHoursService = inject(WorkingHoursService);
  private tenantService = inject(TenantService);
  private tenantSlug: string | null = null;
  private cdr = inject(ChangeDetectorRef);
  protected errorMessages = signal<string[]>([]);

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
    this.tenantService.getWorkingHoursBySlug(this.tenantSlug).subscribe((workingHours) => {
      this.buildForm(workingHours);
      this.cdr.markForCheck();
    });
  }

  private buildForm(existing: WorkingHoursModel[]) {
    this.days.clear();
    for (let day = 0; day <= 6; day++) {
      const found = existing.find((wh) => wh.dayOfWeek === day);

      //create group for current day
      const dayGroup = new FormGroup(
        {
          dayOfWeek: new FormControl(day, { nonNullable: true }),
          isWorkingDay: new FormControl(found?.isWorkingDay ?? false, { nonNullable: true }),
          startTime: new FormControl(found?.startTime ?? null),
          endTime: new FormControl(found?.endTime ?? null),
          pauseStart: new FormControl(found?.pauseStart ?? null),
          pauseEnd: new FormControl(found?.pauseEnd ?? null),
        },
        {
          validators: workingDayValidator,
        },
      );

      //starting with: if it's non-working day - all fields will be disabled
      this.updateTimeControls(dayGroup, dayGroup.controls.isWorkingDay.value);

      //each time checkbox for this day is changed:
      dayGroup.controls.isWorkingDay.valueChanges.subscribe((isWorkingDay) =>
        this.updateTimeControls(dayGroup, isWorkingDay),
      );

      this.days.push(dayGroup);
    }
  }

  private updateTimeControls(dayGroup: FormGroup, isWorkingDay: boolean) {
    for (const name of TIME_CONTROLS) {
      const control = dayGroup.get(name)!;
      if (isWorkingDay) {
        control.enable();
      } else {
        control.disable();
      }
    }
  }

  protected dayErrorMessage(dayGroup: AbstractControl): string | null {
    if (!(dayGroup.touched || dayGroup.dirty)) {
      return null;
    }
    // error on a single field (from CompleteTimeDirective) - checked first, because a half-typed time looks empty to the group validator
    const hasIncompleteTime = TIME_CONTROLS.some((name) => dayGroup.get(name)?.hasError('incompleteTime'));
    if (hasIncompleteTime) {
      return 'Neko vrijeme nije do kraja upisano (provjeri sate, minute i AM/PM).';
    }
    if (!dayGroup.errors) {
      return null;
    }
    const errorKey = Object.keys(dayGroup.errors)[0];
    return workingDayErrorMessages[errorKey];
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show all errors
      return;
    }
    this.errorMessages.set([]); // clear old error messages before retry

    // an emptied <input type="time"> gives "" instead of null - backend can't convert "" to TimeOnly?
    const workingHours = (this.days.value as WorkingHoursInput[]).map((day) => ({
      ...day,
      startTime: day.startTime || null,
      endTime: day.endTime || null,
      pauseStart: day.pauseStart || null,
      pauseEnd: day.pauseEnd || null,
    }));
    this.workingHoursService.setWorkingHours(workingHours).subscribe({
      next: () => this.loadWorkingHours(),
      error: (err: HttpErrorResponse) => {
        const errors = err.error?.errors;
        if (errors) {
          this.errorMessages.set(Object.values(errors).flat() as string[]);
        } else {
          this.errorMessages.set(['Spremanje nije uspjelo. Pokušaj ponovno.']);
        }
      },
    });
  }
}
