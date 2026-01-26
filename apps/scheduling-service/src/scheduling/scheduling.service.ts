import { Injectable } from '@nestjs/common';
import {
  CreateAppointmentDto,
  DefaultAppoResponseDto,
  ProviderAvailabilityDto,
} from '@app/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SchedulingService {
  constructor(private readonly prismaClient: DatabaseService) {}

  async create(data: CreateAppointmentDto): Promise<DefaultAppoResponseDto> {
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

    return {
      ...appointment,
      startsAt: appointment.startsAt.toISOString(),
      endsAt: appointment.endsAt.toISOString(),
      created_at: appointment.created_at.toISOString(),
      updated_at: appointment.updated_at.toISOString(),
    };
  }

  async findByProviderDate(data: ProviderAvailabilityDto) {
    return this.prismaClient.appointment.findFirst({
      where: {
        provider_id: data.provider_id,
        startsAt: data.date,
      },
    });
  }

  async findManyByProvider(data: {
    provider_id: number;
    startsAt: Date;
    endsAt: Date;
  }) {
    return this.prismaClient.appointment.findMany({
      where: {
        provider_id: data.provider_id,
        startsAt: {
          gte: data.startsAt,
          lt: data.endsAt,
        },
      },
    });
  }

  findOne(data: { id: number }): boolean {
    console.log(data);
    return true;
  }
}
