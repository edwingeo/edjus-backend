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

if (require.main === module) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen((process.env.PORT || 3000), '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
  bootstrap();
}