import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '../config/env.js';
import { MapDataResponse } from '../types/index.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!ENV.SUPABASE.URL || (!ENV.SUPABASE.ANON_KEY && !ENV.SUPABASE.SERVICE_ROLE_KEY)) {
    throw new Error('Supabase credentials (SUPABASE_URL and SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY) are missing in environment variables.');
  }

  if (!supabaseClient) {
    const key = ENV.SUPABASE.SERVICE_ROLE_KEY || ENV.SUPABASE.ANON_KEY;
    supabaseClient = createClient(ENV.SUPABASE.URL, key);
  }

  return supabaseClient;
}

export async function getMapDataFromSupabase(): Promise<MapDataResponse> {
  const supabase = getSupabaseClient();

  const { data: departamentosData, error: departamentosError } = await supabase
    .from('departments')
    .select('*');

  const { data: ciudadesData, error: ciudadesError } = await supabase
    .from('municipalities')
    .select('*');

  if (departamentosError || ciudadesError) {
    throw departamentosError || ciudadesError;
  }

  const departamentosGeojson = {
    type: 'FeatureCollection' as const,
    features: (departamentosData || []).map((item) => ({
      type: 'Feature' as const,
      properties: {
        name: item.name || null,
        admin_level: item.admin_level || null,
        departamento: item.name || null,
      },
      geometry: item.geom ? JSON.parse(item.geom) : null,
    })),
  };

  const ciudadesGeojson = {
    type: 'FeatureCollection' as const,
    features: (ciudadesData || []).map((item) => ({
      type: 'Feature' as const,
      properties: {
        nombre: item.name || null,
        departamento: item.department_name || null,
        tipo: item.municipality_type || null,
        descripcion: item.description || null,
        status: item.status || null,
      },
      geometry: item.geom ? JSON.parse(item.geom) : null,
    })),
  };

  return {
    departamentos: departamentosGeojson,
    ciudades: ciudadesGeojson,
  };
}
