import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateAppointmentDto,
  SCHEDULING_CLIENT,
  SCHEDULING_SERVICE,
  type AppointmentServiceRPC,
} from '@app/common';

@Controller('appointment')
export class AppointmentController implements OnModuleInit {
  private appointmentServiceRPC: AppointmentServiceRPC;

  constructor(@Inject(SCHEDULING_CLIENT) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.appointmentServiceRPC =
      this.client.getService<AppointmentServiceRPC>(SCHEDULING_SERVICE);
  }

  @Post()
  create(@Body() data: CreateAppointmentDto) {
    return this.appointmentServiceRPC.create(data);
  }

  @Get('provider')
  async findManyByProvider(
    @Query('provider_id') provider_id: string,
    @Query('startsAt') startsAt: string,
  ) {
    return this.appointmentServiceRPC.findManyByProvider({
      provider_id: +provider_id,
      startsAt,
    });
  }

  @Get('customer')
  async findManyByCustomer(
    @Query('customer_id') customer_id: string,
    @Query('startsAt') startsAt: string,
  ) {
    return this.appointmentServiceRPC.findManyByCustomer({
      customer_id: +customer_id,
      startsAt,
    });
  }

  @Get('id')
  findOne(@Param('id') id: string) {
    return this.appointmentServiceRPC.findOne({ id: +id });
  }
}
