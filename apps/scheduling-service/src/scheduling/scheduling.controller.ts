import { Controller } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateAppointmentDto, SCHEDULING_SERVICE } from '@app/common';

@Controller()
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @GrpcMethod(SCHEDULING_SERVICE, 'create')
  async create(data: CreateAppointmentDto) {
    return this.schedulingService.create(data);
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'FindOne')
  findOne(data: { id: number }) {
    return this.schedulingService.findOne(data);
  }
}
