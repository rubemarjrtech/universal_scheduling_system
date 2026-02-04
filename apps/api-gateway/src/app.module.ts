import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import {
  SCHEDULING_CLIENT,
  PROVIDER_PACKAGE,
  SCHEDULE_OPTIONS_PACKAGE,
  APPOINTMENT_PACKAGE,
} from '@app/common';
import { AppointmentController } from './modules/appointment/scheduling.controller';
import { ProviderController } from './modules/service-provider/provider.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcExceptionInterceptor } from './common/interceptors/grpc-exception.interceptor';
import { ScheduleOptionsController } from './modules/schedule-options/schedule-options.controller';
import { SocketModule } from './socket/socket.module';

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
                  APPOINTMENT_PACKAGE,
                  PROVIDER_PACKAGE,
                  SCHEDULE_OPTIONS_PACKAGE,
                ],
                protoPath: [
                  'libs/common/proto/scheduling/appointment.proto',
                  'libs/common/proto/scheduling/provider.proto',
                  'libs/common/proto/scheduling/schedule-options.proto',
                ],
                url: configService.get<string>('APPOINTMENT_CLIENT_URL'),
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
      envFilePath: ['apps/api-gateway/.env'],
    }),
    SocketModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: GrpcExceptionInterceptor }],
  controllers: [
    AppointmentController,
    ProviderController,
    ScheduleOptionsController,
  ],
})
export class AppModule {}
