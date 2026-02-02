import { Inject, Injectable } from '@nestjs/common';
import { ScheduleOptionsService } from '../schedule-options/schedule-options.service';
import Availability from '../common/types/availability.type';
import { formatInTimeZone } from 'date-fns-tz';
import formatLockKey from '../common/utils/format-lock-string';
import { LockService } from '../lock/lock.service';
import { DatabaseService } from '../database/database.service';
import {
  ProviderAvailabilityDto,
  ProviderLockSlotDto,
  REDIS_PUB_SUB_TOKEN,
  SchedOptionsResponseDto,
} from '@app/common';
import { getDay, parseISO } from 'date-fns';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { SchedulingService } from '../scheduling/scheduling.service';
import availableTime from '../common/utils/available-time';

@Injectable()
export class ProviderService {
  constructor(
    private readonly scheduleOptionsService: ScheduleOptionsService,
    private readonly prismaClient: DatabaseService,
    private readonly lockService: LockService,
    private readonly schedulingService: SchedulingService,
    @Inject(REDIS_PUB_SUB_TOKEN) private readonly pubSubClient: ClientProxy,
  ) {}

  async getAvailability(
    data: ProviderAvailabilityDto,
  ): Promise<Availability | null> {
    await this.checkIfProviderCustomerExist(data.provider_id, data.customer_id);
    // date always come as UTC, so convert to desired timezone
    const timezone = 'America/Sao_Paulo';
    const localDateStr = formatInTimeZone(data.date, timezone, 'yyyy-MM-dd');
    const localDateObj = parseISO(localDateStr);
    const scheduleOptions =
      await this.scheduleOptionsService.findByProviderWeekday({
        provider_id: data.provider_id,
        dayOfWeek: getDay(localDateObj),
      });

    if (!scheduleOptions) return null;

    const availability = this.calculateAvailability(scheduleOptions);
    const appointments = await this.schedulingService.findManyByProvider({
      provider_id: data.provider_id,
      startsAt: data.date,
    });
    for (const appointment of appointments) {
      const time = formatInTimeZone(appointment.startsAt, timezone, 'HH:mm');
      const index = availability.findIndex((value) => value === time);
      if (index > -1) {
        availability.splice(index, 1);
      }
    }

    return this.filterAvailableSlots(availability, data.provider_id, data.date);
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

    this.pubSubClient.emit('slot_locked', {
      date: data.date,
      provider_id: data.provider_id,
    });
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

  private async filterAvailableSlots(
    availability: Availability,
    provider_id: number,
    date: string,
  ): Promise<Availability> {
    const checkPromises = availability.map(async (value) => {
      const key = formatLockKey({
        provider_id: provider_id,
        date,
        time: value,
      });
      const result = await this.lockService.get(key);
      return typeof result === 'string';
    });
    const result = await Promise.all(checkPromises);
    const availableSlots = availability.filter((_, index) => !result[index]);
    return availableSlots;
  }

  private calculateAvailability(
    scheduleOptions: SchedOptionsResponseDto,
  ): Availability {
    const schedule: Availability = [];
    let time = scheduleOptions.startTime;

    while (time < scheduleOptions.endTime) {
      schedule.push(availableTime[time]);
      time += scheduleOptions.duration;
    }

    return schedule;
  }
}
