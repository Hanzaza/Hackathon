import { Request, Response, NextFunction } from 'express';
import { getSupabaseClient } from '../services/supabaseService.js';
import { UserRole } from '../types/index.js';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token de autenticación de Supabase requerido (Bearer token).',
    });
    return;
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Sesión inválida o expirada en Supabase Auth.',
      });
      return;
    }

    // Consultar el rol en la tabla users
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    const role = (profile?.role || data.user.user_metadata?.role || 'user') as UserRole;

    req.user = {
      userId: data.user.id,
      email: data.user.email || '',
      role,
    };

    next();
  } catch (err: any) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Error al verificar autenticación con Supabase.',
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
        message: 'No tienes los permisos requeridos para acceder a este recurso administrativo.',
      });
      return;
    }

    next();
  };
}
