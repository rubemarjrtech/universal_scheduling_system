export interface CreateAppointmentDto {
  startsAt: string;
  endsAt: string;
  customer_id: number;
  provider_id: number;
}

export class SchedulingResponseDto {
  id: string;
  customer_id: number;
  provider_id: number;
  created_at: string;
  updated_at: string;
  startsAt: string;
  endsAt: string;
}

export class FindProviderSchedulingDto {
  provider_id: number;
  startsAt: string;
}
export class FindCustomerSchedulingDto {
  customer_id: number;
  startsAt: string;
}
