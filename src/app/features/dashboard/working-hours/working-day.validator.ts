import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// "09:00:00" (iz baze) i "09:00" (iz inputa) -> oboje "09:00", da se mogu usporediti
function toHHmm(value: string | null): string | null {
  return value ? value.slice(0, 5) : null;
}

export const workingDayValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  if (!group.get('isWorkingDay')?.value) {
    return null; // neradni dan: polja su ionako onemogućena, nema što provjeravati
  }

  const start = toHHmm(group.get('startTime')?.value);
  const end = toHHmm(group.get('endTime')?.value);
  const pauseStart = toHHmm(group.get('pauseStart')?.value);
  const pauseEnd = toHHmm(group.get('pauseEnd')?.value);

  if (!start || !end) {
    return { workingHoursRequired: true };
  }
  if (start >= end) {
    return { endBeforeStart: true };
  }
  if (!!pauseStart !== !!pauseEnd) {
    return { pauseIncomplete: true };
  }
  if (pauseStart && pauseEnd) {
    if (pauseStart >= pauseEnd) {
      return { pauseEndBeforeStart: true };
    }
    if (pauseStart <= start || pauseEnd >= end) {
      return { pauseOutsideWorkingHours: true };
    }
  }
  return null; // sve u redu
};

export const workingDayErrorMessages: Record<string, string> = {
  workingHoursRequired: 'Radni dan mora imati upisano vrijeme od i do.',
  endBeforeStart: 'Kraj radnog vremena mora biti nakon početka.',
  pauseIncomplete: 'Pauza mora imati i početak i kraj (ili ostavi oba prazna).',
  pauseEndBeforeStart: 'Kraj pauze mora biti nakon početka pauze.',
  pauseOutsideWorkingHours: 'Pauza mora biti unutar radnog vremena.',
};
