import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { ScheduleOptionsModule } from '../schedule-options/schedule-options.module';
import { DatabaseModule } from '../database/database.module';
import { LockModule } from '../lock/lock.module';
import { SchedulingModule } from '../scheduling/scheduling.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    DatabaseModule,
    ScheduleOptionsModule,
    LockModule,
    SchedulingModule,
    SocketModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
