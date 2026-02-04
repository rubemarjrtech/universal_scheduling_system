import { Controller } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateAppointmentDto,
  FindCustomerAppointmentDto,
  FindProviderAppointmentDto,
  SCHEDULING_SERVICE,
} from '@app/common';

@Controller()
export class AppointmentController {
  constructor(private readonly schedulingService: AppointmentService) {}

  @GrpcMethod(SCHEDULING_SERVICE, 'create')
  create(data: CreateAppointmentDto) {
    return this.schedulingService.create(data);
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'FindOne')
  findOne(data: { id: number }) {
    return this.schedulingService.findOne(data);
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'findManyByProvider')
  async findManyByProvider(data: FindProviderAppointmentDto) {
    const appointments = await this.schedulingService.findManyByProvider(data);

    return {
      data: appointments,
    };
  }

  @GrpcMethod(SCHEDULING_SERVICE, 'findManyByCustomer')
  async findManyByCustomer(data: FindCustomerAppointmentDto) {
    const appointments = await this.schedulingService.findManyByCustomer(data);

    return {
      data: appointments,
    };
  }
}
