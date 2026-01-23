import { Injectable } from '@nestjs/common';
import { ScheduleOptionsService } from '../schedule-options/schedule-options.service';
import Availability from '../common/types/availability.type';
import { ProviderAvailabilityDto } from '../../../../libs/common/src/dtos/provider-availability.dto';
import { formatInTimeZone } from 'date-fns-tz';
import formatLockStr from '../common/utils/format-lock-string';
import { LockService } from '../lock/lock.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProviderService {
  constructor(
    private readonly scheduleOptions: ScheduleOptionsService,
    private readonly prismaClient: DatabaseService,
    private readonly lockService: LockService,
  ) {}

  async getAvailability(
    data: ProviderAvailabilityDto,
  ): Promise<Availability | null> {
    const date = new Date(data.date);
    const availability = await this.scheduleOptions.findByProviderWeekday({
      provider_id: data.provider_id,
      dayOfWeek: date.getDay(),
    });

    if (!availability) return null;

    const appointments = await this.prismaClient.appointment.findMany({
      where: {
        provider_id: data.provider_id,
        startsAt: {
          gte: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0,
          ),
          lte: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59,
            59,
            0,
          ),
        },
      },
    });
    // remove from availability if this schedule has been taken before
    for (const appointment of appointments) {
      const time = formatInTimeZone(
        appointment.startsAt,
        'America/Sao_Paulo',
        'HH:mm',
      );
      if (availability.includes(time)) {
        const index = availability.findIndex((value) => value === time);
        if (index > -1) {
          availability.splice(index, 1);
        }
      }
    }

    availability.forEach(async (value, index) => {
      const result = await this.lockService.get(
        formatLockStr(data.provider_id, value),
      );
      if (typeof result === 'string') {
        availability.splice(index, 1);
      }
    });

    return availability;
  }
}
