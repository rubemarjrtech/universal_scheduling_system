import { Module } from '@nestjs/common';
import { ScheduleOptionsService } from './schedule-options.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ScheduleOptionsService],
  exports: [ScheduleOptionsService],
})
export class ScheduleOptionsModule {}
