import { REDIS_PUB_SUB_TOKEN } from '@app/common';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: REDIS_PUB_SUB_TOKEN,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              transport: Transport.REDIS,
              options: {
                host: configService.get<string>('REDIS_PUB_SUB_HOST'),
                port: Number(configService.get<string>('REDIS_PUB_SUB_PORT')),
              },
            };
          },
        },
      ],
    }),
  ],
  exports: [ClientsModule],
})
export class PubSubModule {}
