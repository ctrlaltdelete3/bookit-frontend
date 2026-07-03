export const AppointmentStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Canceled: 'Canceled',
  Rejected: 'Rejected',
} as const;

export type AppointmentStatusType = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
