import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { DatabaseModule } from '../database/database.module';
import { LockModule } from '../lock/lock.module';
import { ScheduleOptionsModule } from '../schedule-options/schedule-options.module';

@Module({
  imports: [DatabaseModule, LockModule, ScheduleOptionsModule],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
