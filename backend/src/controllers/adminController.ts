import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { backendAdminService } from '../services/adminService.js';

export const adminController = {
  async getStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await backendAdminService.getDashboardStats();
      res.json({ success: true, stats });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener estadísticas.';
      res.status(500).json({ success: false, error: message });
    }
  },

  async approveRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await backendAdminService.approveEntrepreneurRequest(id);
      res.json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al aprobar solicitud.';
      res.status(400).json({ success: false, error: message });
    }
  },

  async rejectRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await backendAdminService.rejectEntrepreneurRequest(id);
      res.json(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al rechazar solicitud.';
      res.status(400).json({ success: false, error: message });
    }
  },
};
