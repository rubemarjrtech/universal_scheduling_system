export class CreateSchedOptionsDto {
  startTime: number;
  endTime: number;
  duration: number;
  dayOfWeek: number;
  provider_id: number;
}

export class findByProviderWeekdayDto {
  dayOfWeek: number;
  provider_id: number;
}

export class SchedOptionsResponseDto extends CreateSchedOptionsDto {}
