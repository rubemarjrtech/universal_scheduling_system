import { Controller } from '@nestjs/common';
import { ScheduleOptionsService } from './schedule-options.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateSchedOptionsDto, SCHEDULE_OPTIONS_SERVICE } from '@app/common';

@Controller()
export class ScheduleOptionsController {
  constructor(
    private readonly scheduleOptionsService: ScheduleOptionsService,
  ) {}

  @GrpcMethod(SCHEDULE_OPTIONS_SERVICE, 'create')
  async create(data: CreateSchedOptionsDto) {
    return this.scheduleOptionsService.create(data);
  }
}
