import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api');
  app.connectMicroservice<AsyncMicroserviceOptions>({
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
  });
  app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
