import {
  CreateSchedOptionsDto,
  SCHEDULE_OPTIONS_SERVICE,
  ScheduleOptionsRpc,
  SCHEDULING_CLIENT,
} from '@app/common';
import { Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('schedule-options')
export class ScheduleOptionsController implements OnModuleInit {
  private scheduleOptionsRpc: ScheduleOptionsRpc;

  constructor(@Inject(SCHEDULING_CLIENT) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.scheduleOptionsRpc = this.client.getService(SCHEDULE_OPTIONS_SERVICE);
  }

  @Post()
  async create(data: CreateSchedOptionsDto) {
    return this.scheduleOptionsRpc.create(data);
  }
}
