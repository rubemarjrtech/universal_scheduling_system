import { Controller } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class SchedulingController {
  constructor(private readonly SchedulingModuleService: SchedulingService) {}

  @GrpcMethod('SchedulingService', 'FindOne')
  findOne(data: { id: number }) {
    return this.SchedulingModuleService.findOne(data);
  }
}
