import { Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  SchedulingResponseDto,
  ProviderAvailabilityDto,
  FindCustomerSchedulingDto,
  FindProviderSchedulingDto,
} from '@app/common';
import { DatabaseService } from '../database/database.service';
import { LockService } from '../lock/lock.service';
import formatLockKey from '../common/utils/format-lock-string';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { LockGateway } from '../socket/lock.gateway';
import getUtcDayStartEnd from '../common/utils/get-utc-day-start-end';

@Injectable()
export class SchedulingService {
  constructor(
    private readonly prismaClient: DatabaseService,
    private readonly lockService: LockService,
    private readonly lockGateway: LockGateway,
  ) {}

  async create(data: CreateAppointmentDto): Promise<SchedulingResponseDto> {
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

    const appointment = await this.prismaClient.appointment.create({
      data: {
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        provider: {
          connect: {
            id: data.provider_id,
          },
        },
        customer: {
          connect: {
            id: data.customer_id,
          },
        },
      },
    });

    await this.lockService.release(key, customerIdStr);
    this.lockGateway.notifySlotBooked(data.startsAt);

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
    data: FindProviderSchedulingDto,
  ): Promise<SchedulingResponseDto[]> {
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
    data: FindCustomerSchedulingDto,
  ): Promise<SchedulingResponseDto[]> {
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
}
