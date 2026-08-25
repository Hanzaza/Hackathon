import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import locationsRoutes from './locationsRoutes.js';
import mapDataRoutes from './mapDataRoutes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/locations', locationsRoutes);
apiRouter.use('/map-data', mapDataRoutes);

export default apiRouter;
