import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'scheduling',
        protoPath: join(__dirname, '../../../libs/common/scheduling.proto'),
        url: 'localhost:50051',
      },
    },
  );
  await app.listen();
}
bootstrap();
