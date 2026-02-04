import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AsyncMicroserviceOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  PROVIDER_PACKAGE,
  SCHEDULE_OPTIONS_PACKAGE,
  APPOINTMENT_PACKAGE,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    AppModule,
    {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
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
            },
          },
        } as GrpcOptions;
      },
    },
  );
  await app.listen();
}
bootstrap();
