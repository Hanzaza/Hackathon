import { Router } from 'express';
import { getLocations } from '../controllers/locationsController.js';

const router = Router();
router.get('/', getLocations);

export default router;
