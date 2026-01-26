import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateAppointmentDto,
  SCHEDULING_CLIENT,
  type SchedulingServiceRPC,
} from '@app/common';

@Controller('scheduling')
export class SchedulingController implements OnModuleInit {
  private appointmentServiceRPC: SchedulingServiceRPC;

  constructor(@Inject(SCHEDULING_CLIENT) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.appointmentServiceRPC =
      this.client.getService<SchedulingServiceRPC>('SchedulingService');
  }

  @Post()
  async create(@Body() data: CreateAppointmentDto) {
    return this.appointmentServiceRPC.create(data);
  }

  @Get('id')
  findOne(@Param('id') id: string) {
    return this.appointmentServiceRPC.findOne({ id: +id });
  }
}
