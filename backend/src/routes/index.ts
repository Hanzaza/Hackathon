import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import locationsRoutes from './locationsRoutes.js';
import mapDataRoutes from './mapDataRoutes.js';
import authRoutes from './authRoutes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/locations', locationsRoutes);
apiRouter.use('/map-data', mapDataRoutes);

export default apiRouter;
