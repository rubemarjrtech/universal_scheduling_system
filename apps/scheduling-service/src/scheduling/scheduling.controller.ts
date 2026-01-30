import { Controller } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateAppointmentDto,
  FindCustomerSchedulingDto,
  FindProviderSchedulingDto,
  SCHEDULING_SERVICE,
} from '@app/common';

@Controller()
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @GrpcMethod(SCHEDULING_SERVICE, 'create')
  create(data: CreateAppointmentDto) {
    return this.schedulingService.create(data);
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'FindOne')
  findOne(data: { id: number }) {
    return this.schedulingService.findOne(data);
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'findManyByProvider')
  async findManyByProvider(data: FindProviderSchedulingDto) {
    const appointments = await this.schedulingService.findManyByProvider(data);

    return {
      data: appointments,
    };
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'findManyByCustomer')
  async findManyByCustomer(data: FindCustomerSchedulingDto) {
    const appointments = await this.schedulingService.findManyByCustomer(data);

    return {
      data: appointments,
    };
  }
}
