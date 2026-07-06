export interface ServiceInput {
  name: string;
  description: string | null;
  durationMinutes: number;
  breakMinutesAfterService: number | null;
  price: number | null;
}
