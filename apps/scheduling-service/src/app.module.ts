import { Module } from '@nestjs/common';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from './service-provider/provider.module';
import { ScheduleOptionsModule } from './schedule-options/schedule-options.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

@Module({
  imports: [
    SchedulingModule,
    ScheduleOptionsModule,
    ProviderModule,
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: PrismaExceptionFilter }],
})
export class AppModule {}
