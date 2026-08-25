import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { JWTPayload, UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token de autenticación requerido (Bearer token).',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Token inválido o expirado. Por favor inicia sesión nuevamente.',
    });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Usuario no autenticado.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'No tienes los permisos requeridos para acceder a este recurso.',
      });
      return;
    }

    next();
  };
}
