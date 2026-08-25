import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Rutas Públicas
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rutas Protegidas
router.get('/me', authenticateToken, getMe);

export default router;
