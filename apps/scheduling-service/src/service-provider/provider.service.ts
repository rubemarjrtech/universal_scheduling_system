import { Injectable } from '@nestjs/common';
import { ScheduleOptionsService } from '../schedule-options/schedule-options.service';
import Availability from '../common/types/availability.type';
import { ProviderAvailabilityDto } from '../../../../libs/common/src/dtos/provider-availability.dto';
import { formatInTimeZone } from 'date-fns-tz';
import formatLockStr from '../common/utils/format-lock-string';
import { LockService } from '../lock/lock.service';
import { DatabaseService } from '../database/database.service';
import { ProviderLockSlotDto } from '@app/common';
import { addDays, getDay, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class ProviderService {
  constructor(
    private readonly scheduleOptionsService: ScheduleOptionsService,
    private readonly prismaClient: DatabaseService,
    private readonly lockService: LockService,
  ) {}

  async getAvailability(
    data: ProviderAvailabilityDto,
  ): Promise<Availability | null> {
    const referenceDate = new Date(data.date);
    const timezone = 'America/Sao_Paulo';
    const formatted = formatInTimeZone(referenceDate, timezone, 'yyyy-MM-dd');
    const dateObj = parseISO(formatted);
    const day = getDay(dateObj);
    const availability =
      await this.scheduleOptionsService.findByProviderWeekday({
        provider_id: data.provider_id,
        dayOfWeek: day,
      });

    if (!availability) return null;

    // JOGAR ESSA LÓGICA PARA O SCHEDULING SERVICE
    const dayStart = startOfDay(dateObj);
    const dayEnd = addDays(dayStart, 1);
    const appointments = await this.prismaClient.appointment.findMany({
      where: {
        provider_id: data.provider_id,
        startsAt: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
    });
    // TESTAR ESSA LÓGICA DEPOIS DE IMPLEMENTAR CRIAÇÃO DE APPOINTMENTS
    for (const appointment of appointments) {
      const time = formatInTimeZone(appointment.startsAt, timezone, 'HH:mm');
      if (availability.includes(time)) {
        const index = availability.findIndex((value) => value === time);
        if (index > -1) {
          availability.splice(index, 1);
        }
      }
    }

    const checkPromises = availability.map(async (value) => {
      const key = formatLockStr({
        provider_id: data.provider_id,
        date: referenceDate,
        customer_id: data.customer_id,
        hour: value,
      });
      const result = await this.lockService.get(key);
      return typeof result === 'string';
    });
    const result = await Promise.all(checkPromises);
    const availableSlots = availability.filter((_, index) => !result[index]);

    return availableSlots;
  }

  async lockSlot(data: ProviderLockSlotDto) {
    const result = await this.lockService.set(
      formatLockStr({
        provider_id: data.provider_id,
        date: data.date,
        customer_id: data.customer_id,
      }),
      data.customer_id,
    );

    if (!result) {
      return { success: false };
    }

    return { success: true };
  }
}
