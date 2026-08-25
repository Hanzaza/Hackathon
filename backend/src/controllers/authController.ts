import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar usuario';
    res.status(400).json({ success: false, error: message });
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
    res.status(401).json({ success: false, error: message });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'No autenticado' });
      return;
    }

    const user = await getUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  });
}
