import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const adminRoutes = Router();

// Todas las rutas de administración requieren token válido y rol admin
adminRoutes.use(authenticateToken);
adminRoutes.use(requireRole(['admin']));

adminRoutes.get('/stats', adminController.getStats);
adminRoutes.post('/requests/:id/approve', adminController.approveRequest);
adminRoutes.post('/requests/:id/reject', adminController.rejectRequest);

export default adminRoutes;
