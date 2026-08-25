import { Request, Response, NextFunction } from 'express';
import { getMapDataFromSupabase } from '../services/supabaseService.js';

export async function getMapData(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getMapDataFromSupabase();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching map data from Supabase:', error);
    next(error);
  }
}
