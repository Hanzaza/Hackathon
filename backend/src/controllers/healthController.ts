import { Request, Response } from 'express';

export function getHealthStatus(_req: Request, res: Response): void {
  res.status(200).json({
    status: 'ok',
    service: 'stateless-mobility-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
