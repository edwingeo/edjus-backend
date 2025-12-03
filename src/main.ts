import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, Express } from 'express';

let server: Express;

export const handler = async (req: Request, res: Response) => {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    server = app.getHttpAdapter().getInstance();
  }
  return server(req, res);
};