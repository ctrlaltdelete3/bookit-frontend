export interface WorkingHoursInput {
  dayOfWeek: number;
  isWorkingDay: boolean;
  startTime: string | null;
  endTime: string | null;
  pauseStart: string | null;
  pauseEnd: string | null;
}
