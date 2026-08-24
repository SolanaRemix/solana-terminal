import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();
