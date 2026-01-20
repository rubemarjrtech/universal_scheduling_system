import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SCHEDULING_PACKAGE } from 'libs/src';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'scheduling_client',
          useFactory: (configService: ConfigService) => {
            return {
              name: SCHEDULING_PACKAGE,
              transport: Transport.GRPC,
              options: {
                package: SCHEDULING_PACKAGE,
                protoPath: 'libs/common/scheduling.proto',
                url: configService.get<string>('SCHEDULING_CLIENT_URL'),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
  ],
})
export class SchedulingModule {}
