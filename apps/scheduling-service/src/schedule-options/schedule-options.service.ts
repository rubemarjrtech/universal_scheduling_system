import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateSchedOptionsDto,
  findByProviderWeekdayDto,
  SchedOptionsResponseDto,
} from '@app/common';

@Injectable()
export class ScheduleOptionsService {
  constructor(private readonly prismaClient: DatabaseService) {}

  async create(data: CreateSchedOptionsDto): Promise<SchedOptionsResponseDto> {
    return this.prismaClient.scheduleOptions.create({
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        dayOfWeek: data.dayOfWeek,
        provider: {
          connect: {
            id: data.provider_id,
          },
        },
      },
    });
  }

  async findByProviderWeekday(
    data: findByProviderWeekdayDto,
  ): Promise<SchedOptionsResponseDto | null> {
    return this.prismaClient.scheduleOptions.findUnique({
      where: {
        provider_id_dayOfWeek: {
          dayOfWeek: data.dayOfWeek,
          provider_id: data.provider_id,
        },
      },
    });
  }
}
