import { Injectable } from '@nestjs/common';
import { ScheduleOptionsService } from '../schedule-options/schedule-options.service';
import Availability from '../common/types/availability.type';
import { ProviderAvailabilityDto } from '../scheduling/dtos/request/provider-availability.dto';
import { PrismaClient } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import formatLockStr from '../common/utils/format-lock-string';
import { LockService } from '../lock/lock.service';

@Injectable()
export class ProviderService {
  constructor(
    private readonly scheduleOptions: ScheduleOptionsService,
    private readonly prismaClient: PrismaClient,
    private readonly lockService: LockService,
  ) {}

  async getAvailability(
    data: ProviderAvailabilityDto,
  ): Promise<Availability | null> {
    const availability = await this.scheduleOptions.findByProviderWeekday({
      provider_id: data.provider_id,
      dayOfWeek: data.date.getDay(),
    });

    if (!availability) return null;

    const appointments = await this.prismaClient.appointment.findMany({
      where: {
        provider_id: data.provider_id,
        startsAt: {
          gte: new Date(
            data.date.getFullYear(),
            data.date.getMonth(),
            data.date.getDate(),
            0,
            0,
            0,
            0,
          ),
          lte: new Date(
            data.date.getFullYear(),
            data.date.getMonth(),
            data.date.getDate(),
            23,
            59,
            59,
            0,
          ),
        },
      },
    });

    for (const appointment of appointments) {
      const time = formatInTimeZone(
        appointment.startsAt,
        'America/Sao_Paulo',
        'HH:mm',
      );
      // remove from availability if this schedule has been taken before
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
      if (result) {
        availability.splice(index, 1);
      }
    });

    return availability;
  }
}
