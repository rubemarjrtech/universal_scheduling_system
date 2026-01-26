export interface CreateAppointmentDto {
  startsAt: Date;
  endsAt: Date;
  customer_id: number;
  provider_id: number;
}

export class DefaultAppoResponseDto {
  id: string;
  customer_id: number;
  provider_id: number;
  created_at: string;
  updated_at: string;
  startsAt: string;
  endsAt: string;
}
