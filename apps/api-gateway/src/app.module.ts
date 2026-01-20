import { Module } from '@nestjs/common';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SchedulingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
