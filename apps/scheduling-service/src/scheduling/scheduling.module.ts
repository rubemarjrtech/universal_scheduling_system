import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { DatabaseModule } from '../database/database.module';
import { LockModule } from '../lock/lock.module';
import { ScheduleOptionsModule } from '../schedule-options/schedule-options.module';
import { SocketModule } from '../../../api-gateway/src/socket/socket.module';

@Module({
  imports: [DatabaseModule, LockModule, ScheduleOptionsModule, SocketModule],
  providers: [SchedulingService],
  controllers: [SchedulingController],
  exports: [SchedulingService],
})
export class SchedulingModule {}
