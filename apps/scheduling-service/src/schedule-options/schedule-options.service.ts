import { Injectable } from '@nestjs/common';
import ScheduleOptions from './types/schedule-options.type';
import Availability from '../common/types/availability.type';
import availableTime from '../common/utils/available-time';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ScheduleOptionsService {
  constructor(private readonly prismaClient: DatabaseService) {}

  async findByProviderWeekday(
    data: Pick<ScheduleOptions, 'provider_id' | 'dayOfWeek'>,
  ): Promise<Availability | null> {
    const scheduleOptions = await this.prismaClient.scheduleOptions.findFirst({
      where: {
        dayOfWeek: data.dayOfWeek,
        provider_id: data.provider_id,
      },
    });

    if (!scheduleOptions) return null;

    const schedule: Availability = [];
    let time = scheduleOptions.startTime;

    while (time < scheduleOptions.endTime) {
      schedule.push(availableTime[time]);
      time += scheduleOptions.duration;
    }

    return schedule;
  }
}
