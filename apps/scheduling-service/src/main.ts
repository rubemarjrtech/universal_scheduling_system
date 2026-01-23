import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AsyncMicroserviceOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SCHEDULING_PACKAGE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    AppModule,
    {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
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
    },
  );
  await app.listen();
}
bootstrap();
