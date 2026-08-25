import { Request, Response, NextFunction } from 'express';
import { getInfrastructureGeoJSON } from '../services/mongoService.js';

export async function getLocations(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const geojson = await getInfrastructureGeoJSON();
    res.status(200).json(geojson);
  } catch (error) {
    console.error('Error fetching infrastructure locations:', error);
    next(error);
  }
}
