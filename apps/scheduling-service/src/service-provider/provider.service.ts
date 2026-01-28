import { Injectable } from '@nestjs/common';
import { ScheduleOptionsService } from '../schedule-options/schedule-options.service';
import Availability from '../common/types/availability.type';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import formatLockKey from '../common/utils/format-lock-string';
import { LockService } from '../lock/lock.service';
import { DatabaseService } from '../database/database.service';
import { ProviderAvailabilityDto, ProviderLockSlotDto } from '@app/common';
import { addDays, format, getDay, parseISO, startOfDay } from 'date-fns';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { SchedulingService } from '../scheduling/scheduling.service';
import { LockGateway } from '../socket/lock.gateway';

@Injectable()
export class ProviderService {
  constructor(
    private readonly scheduleOptionsService: ScheduleOptionsService,
    private readonly prismaClient: DatabaseService,
    private readonly lockService: LockService,
    private readonly schedulingService: SchedulingService,
    private readonly lockGateway: LockGateway,
  ) {}

  async getAvailability(
    data: ProviderAvailabilityDto,
  ): Promise<Availability | null> {
    await this.checkIfProviderCustomerExist(data.provider_id, data.customer_id);
    // date always come as UTC, so convert to desired timezone
    const timezone = 'America/Sao_Paulo';
    const localDateStr = formatInTimeZone(data.date, timezone, 'yyyy-MM-dd');
    const localDateObj = parseISO(localDateStr);
    const availability =
      await this.scheduleOptionsService.findByProviderWeekday({
        provider_id: data.provider_id,
        dayOfWeek: getDay(localDateObj),
      });

    if (!availability) return null;

    // convert start of day local to UTC time because database is always UTC, you can log startUtc and endUtc to visualize better
    const startLocalString = `${localDateStr} 00:00:00`;
    const nextDayDate = addDays(localDateObj, 1);
    const nextDayString = format(nextDayDate, 'yyyy-MM-dd');
    const endLocalString = `${nextDayString} 00:00:00`;
    const startUtc = fromZonedTime(startLocalString, timezone);
    const endUtc = fromZonedTime(endLocalString, timezone);
    const appointments = await this.schedulingService.findManyByProvider({
      provider_id: data.provider_id,
      startsAt: startUtc,
      endsAt: endUtc,
    });

    for (const appointment of appointments) {
      const time = formatInTimeZone(appointment.startsAt, timezone, 'HH:mm');
      const index = availability.findIndex((value) => value === time);
      if (index > -1) {
        availability.splice(index, 1);
      }
    }

    const checkPromises = availability.map(async (value) => {
      const key = formatLockKey({
        provider_id: data.provider_id,
        date: data.date,
        time: value,
      });
      const result = await this.lockService.get(key);
      return typeof result === 'string';
    });
    const result = await Promise.all(checkPromises);
    const availableSlots = availability.filter((_, index) => !result[index]);
    return availableSlots;
  }

  async lockSlot(data: ProviderLockSlotDto) {
    await this.checkIfProviderCustomerExist(data.provider_id, data.customer_id);
    const result = await this.lockService.set(
      formatLockKey({
        provider_id: data.provider_id,
        date: data.date,
      }),
      data.customer_id,
    );

    if (!result) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Slot already locked',
      });
    }

    this.lockGateway.notifySlotLock(data.date);
    return { success: true };
  }

  private async checkIfProviderCustomerExist(
    provider_id: number,
    customer_id: number,
  ): Promise<void> {
    const [providerCount, customerCount] = await Promise.all([
      this.prismaClient.provider.count({
        where: {
          id: provider_id,
        },
      }),
      this.prismaClient.customer.count({
        where: {
          id: customer_id,
        },
      }),
    ]);

    if (!providerCount || !customerCount) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Customer or Provider not found',
      });
    }
  }
}
