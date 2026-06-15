export interface Appointment {
  id: number;
  tenantId: number;
  tenantName: string;
  serviceId: number;
  serviceName: string;
  userId: number;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Canceled';
  note: string | null;
  tenantNote: string | null;
  createdAt: string;
  confirmedAt: string | null;
  rejectedAt: string | null;
  canceledAt: string | null;
  cancellationReason: string | null;
  rejectionReason: string | null;
}
