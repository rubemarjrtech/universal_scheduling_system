import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { SCHEDULING_PACKAGE } from '@app/common';
import { SchedulingController } from './modules/scheduling/scheduling.controller';
import { ProviderController } from './modules/service-provider/provider.controller';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: SCHEDULING_PACKAGE,
          useFactory: (configService: ConfigService) => {
            return {
              name: SCHEDULING_PACKAGE,
              transport: Transport.GRPC,
              options: {
                package: SCHEDULING_PACKAGE,
                protoPath: 'libs/common/scheduling.proto',
                url: configService.get<string>('SCHEDULING_CLIENT_URL'),
                loader: {
                  keepCase: true,
                },
              },
            } as GrpcOptions;
          },
          inject: [ConfigService],
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SchedulingController, ProviderController],
})
export class AppModule {}
