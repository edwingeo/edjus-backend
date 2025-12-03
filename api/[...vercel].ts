import { VercelRequest, VercelResponse } from '@vercel/node';
import express, { RequestHandler } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createApp } from '../src/create-app';

let cachedServer: RequestHandler | undefined;

async function bootstrap(): Promise<RequestHandler> {
  const expressInstance = express();
  const adapter = new ExpressAdapter(expressInstance);
  const app = await createApp(adapter);
  await app.init();
  return expressInstance;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  const url = req.url || '';
  req.url = url.startsWith('/api') ? url : `/api${url}`;

  return cachedServer(req, res);
}
