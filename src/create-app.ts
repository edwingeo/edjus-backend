import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

export function getCorsOrigins(): string[] {
  return (
    process.env.CORS_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) || [
      'https://edjus.onrender.com',
      'http://localhost:3000',
    ]
  );
}

export async function createApp(
  adapter?: ExpressAdapter,
): Promise<NestExpressApplication> {
  const app = adapter
    ? await NestFactory.create<NestExpressApplication>(AppModule, adapter)
    : await NestFactory.create<NestExpressApplication>(AppModule);

  const corsOrigins = getCorsOrigins();

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}
