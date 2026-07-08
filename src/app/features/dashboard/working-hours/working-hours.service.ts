import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WorkingHoursInput } from './working-hours.model';

@Injectable({ providedIn: 'root' });
export class WorkingHoursService {
  private httpClient = inject(HttpClient);

  setWorkingHours(workingHours: WorkingHoursInput[]) {
    return this.httpClient.put<WorkingHoursInput[]>('/api/working-hours', workingHours);
  }
}
