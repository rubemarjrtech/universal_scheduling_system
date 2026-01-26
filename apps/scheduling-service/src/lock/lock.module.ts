import { Module } from '@nestjs/common';
import LOCK_PROVIDER_TOKEN from '../common/tokens/lock-provider.token';
import { createClient } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LockService } from './lock.service';

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
    LockService,
  ],
  exports: [LockService],
})
export class LockModule {}
