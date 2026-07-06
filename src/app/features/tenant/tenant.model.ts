export interface Tenant {
  id: number;
  name: string;
  activityType: string;
  description: string | null;
  address: string | null;
  city: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  slug: string;
  ownerName: string;
  isActive: boolean;
  createdAt: string;
}

//TODO: move Service later to some shared place
export interface Service {
  id: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  breakMinutesAfterService: number;
  price: number;
  isActive: boolean;
  tenantId: number;
  tenantName: string;
}

export interface WorkingHours {
  id: number;
  dayOfWeek: number;
  isWorkingDay: boolean;
  startTime: string | null;
  endTime: string | null;
  pauseStart: string | null;
  pauseEnd: string | null;
  tenantId: number;
}
