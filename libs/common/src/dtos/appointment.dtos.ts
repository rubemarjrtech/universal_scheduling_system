export interface CreateAppointmentDto {
  startsAt: string;
  provider_id: number;
  customer_id: number;
}

export class AppointmentResponseDto {
  id: string;
  customer_id: number;
  provider_id: number;
  created_at: string;
  updated_at: string;
  startsAt: string;
  endsAt: string;
}

export class FindProviderAppointmentDto {
  provider_id: number;
  startsAt: string;
}
export class FindCustomerAppointmentDto {
  customer_id: number;
  startsAt: string;
}
