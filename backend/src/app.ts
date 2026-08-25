import express, { Express } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Middlewares globales
  app.use(cors({
    origin: ENV.CORS_ORIGIN === '*' ? true : ENV.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());

  // Rutas de la API
  app.use('/api', apiRouter);

  // Healthcheck directo en raíz
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}
