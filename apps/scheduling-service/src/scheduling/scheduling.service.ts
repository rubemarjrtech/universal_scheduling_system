import { Injectable } from '@nestjs/common';
import { ProviderAvailabilityDto } from './dtos/request/provider-availability.dto';
import Appointment from './types/appointment.type';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SchedulingService {
  constructor(private readonly prismaClient: DatabaseService) {}

  async findByProviderDate(
    data: ProviderAvailabilityDto,
  ): Promise<Appointment | null> {
    return this.prismaClient.appointment.findFirst({
      where: {
        provider_id: data.provider_id,
        startsAt: data.date,
      },
    });
  }

  findOne(data: { id: number }): boolean {
    console.log(data);
    return true;
  }
}
