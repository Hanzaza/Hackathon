import { Router } from 'express';
import { getMapData } from '../controllers/mapDataController.js';

const router = Router();
router.get('/', getMapData);

export default router;
