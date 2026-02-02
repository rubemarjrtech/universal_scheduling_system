import { Module } from '@nestjs/common';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from './service-provider/provider.module';
import { ScheduleOptionsModule } from './schedule-options/schedule-options.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LockModule } from './lock/lock.module';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/scheduling-service/.env', 'apps/api-gateway/.env'],
    }),
    PubSubModule,
    SchedulingModule,
    ScheduleOptionsModule,
    ProviderModule,
    LockModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: PrismaExceptionFilter }],
})
export class AppModule {}
