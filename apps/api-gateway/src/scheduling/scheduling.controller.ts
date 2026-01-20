import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SCHEDULING_PACKAGE, type SchedulingServiceRPC } from 'libs/src';

@Controller('appointment')
export class SchedulingController implements OnModuleInit {
  private appointmentServiceRPC: SchedulingServiceRPC;

  constructor(
    @Inject(SCHEDULING_PACKAGE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.appointmentServiceRPC =
      this.client.getService<SchedulingServiceRPC>('AppointmentService');
  }

  @Get('id')
  findOne(@Param('id') id: string) {
    return this.appointmentServiceRPC.findOne({ id: +id });
  }
}
