import { Module } from '@nestjs/common';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from './service-provider/provider.module';
import { ScheduleOptionsModule } from './schedule-options/schedule-options.module';

@Module({
  imports: [
    SchedulingModule,
    ScheduleOptionsModule,
    ProviderModule,
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
})
export class AppModule {}
