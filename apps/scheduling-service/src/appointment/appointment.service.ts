import { Inject, Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  AppointmentResponseDto,
  ProviderAvailabilityDto,
  FindCustomerAppointmentDto,
  FindProviderAppointmentDto,
  REDIS_PUB_SUB_TOKEN,
} from '@app/common';
import { DatabaseService } from '../database/database.service';
import { LockService } from '../lock/lock.service';
import formatLockKey from '../common/utils/format-lock-string';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import getUtcDayStartEnd from '../common/utils/get-utc-day-start-end';
import { addMinutes } from 'date-fns';
import { ScheduleOptionsService } from '../schedule-options/schedule-options.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prismaClient: DatabaseService,
    private readonly lockService: LockService,
    @Inject(REDIS_PUB_SUB_TOKEN) private readonly pubSubClient: ClientProxy,
    private readonly scheduleOptionsService: ScheduleOptionsService,
  ) {}

  async create(data: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    await this.checkIfProviderCustomerExist(data.provider_id, data.customer_id);
    const key = formatLockKey({
      date: data.startsAt,
      provider_id: data.provider_id,
    });
    const customerIdStr = String(data.customer_id);
    const result = await this.lockService.get(key);
    if (typeof result === 'string' && result !== customerIdStr) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'You unexpectedly took too long to fill in your information.',
      });
    }

    const scheduleOptions = await this.scheduleOptionsService.findByProvider(
      data.provider_id,
    );
    const endsAt = this.calculateEndsAt(
      new Date(data.startsAt),
      scheduleOptions.duration,
    );
    const appointment = await this.prismaClient.appointment.create({
      data: {
        startsAt: data.startsAt,
        endsAt,
        provider_id: data.provider_id,
        customer_id: data.customer_id,
      },
    });

    await this.lockService.release(key, customerIdStr);
    this.pubSubClient.emit('slot_booked', {
      date: data.startsAt,
      provider_id: data.provider_id,
      customer_id: data.customer_id,
      appointmentId: appointment.id,
    });

    return {
      ...appointment,
      startsAt: appointment.startsAt.toISOString(),
      endsAt: appointment.endsAt.toISOString(),
      created_at: appointment.created_at.toISOString(),
      updated_at: appointment.updated_at.toISOString(),
    };
  }

  async findByProviderDate(data: ProviderAvailabilityDto) {
    return this.prismaClient.appointment.findUnique({
      where: {
        provider_id: data.provider_id,
        startsAt: data.date,
      },
    });
  }

  async findManyByProvider(
    data: FindProviderAppointmentDto,
  ): Promise<AppointmentResponseDto[]> {
    // convert start of day local to UTC time because database is always UTC, you can log startUtc and endUtc to visualize better
    const { startUtc, endUtc } = getUtcDayStartEnd(data.startsAt);
    const appointments = await this.prismaClient.appointment.findMany({
      where: {
        provider_id: data.provider_id,
        startsAt: {
          gte: startUtc,
          lt: endUtc,
        },
      },
    });

    return appointments.map((appointment) => {
      return {
        ...appointment,
        startsAt: appointment.startsAt.toISOString(),
        endsAt: appointment.endsAt.toISOString(),
        created_at: appointment.created_at.toISOString(),
        updated_at: appointment.updated_at.toISOString(),
      };
    });
  }

  async findManyByCustomer(
    data: FindCustomerAppointmentDto,
  ): Promise<AppointmentResponseDto[]> {
    const { startUtc, endUtc } = getUtcDayStartEnd(data.startsAt);
    const appointments = await this.prismaClient.appointment.findMany({
      where: {
        customer_id: data.customer_id,
        startsAt: {
          gte: startUtc,
          lt: endUtc,
        },
      },
    });

    return appointments.map((appointment) => {
      return {
        ...appointment,
        startsAt: appointment.startsAt.toISOString(),
        endsAt: appointment.endsAt.toISOString(),
        created_at: appointment.created_at.toISOString(),
        updated_at: appointment.updated_at.toISOString(),
      };
    });
  }

  findOne(data: { id: number }): boolean {
    console.log(data);
    return true;
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

  private calculateEndsAt(startsAt: Date, amount: number): string {
    return addMinutes(startsAt, amount).toISOString();
  }
}
