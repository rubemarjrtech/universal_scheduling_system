import { Module } from '@nestjs/common';
import { LockGateway } from './lock.gateway';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { LOCK_PROVIDER_TOKEN } from '@app/common';
import { EventsController } from './events.controller';

@Module({
  providers: [
    {
      provide: LOCK_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        return createClient({
          url: configService.get<string>('LOCK_PROVIDER_URL'),
        }).connect();
      },
      inject: [ConfigService],
    },
    LockGateway,
  ],
  controllers: [EventsController],
  exports: [LockGateway],
})
export class SocketModule {}
