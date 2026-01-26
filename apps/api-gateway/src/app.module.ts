import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import {
  SCHEDULING_CLIENT,
  SCHEDULING_PROVIDER_PACKAGE,
  SCHEDULING_SCHEDULING_PACKAGE,
} from '@app/common';
import { SchedulingController } from './modules/scheduling/scheduling.controller';
import { ProviderController } from './modules/service-provider/provider.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcToHttpInterceptor } from './common/interceptors/grpc-exception.interceptor';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: SCHEDULING_CLIENT,
          useFactory: (configService: ConfigService) => {
            return {
              name: SCHEDULING_CLIENT,
              transport: Transport.GRPC,
              options: {
                package: [
                  SCHEDULING_SCHEDULING_PACKAGE,
                  SCHEDULING_PROVIDER_PACKAGE,
                ],
                protoPath: [
                  'libs/common/proto/scheduling/scheduling.proto',
                  'libs/common/proto/scheduling/provider.proto',
                ],
                url: configService.get<string>('SCHEDULING_CLIENT_URL'),
                loader: {
                  keepCase: true,
                  defaults: true,
                  arrays: true,
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
  providers: [{ provide: APP_INTERCEPTOR, useClass: GrpcToHttpInterceptor }],
  controllers: [SchedulingController, ProviderController],
})
export class AppModule {}
