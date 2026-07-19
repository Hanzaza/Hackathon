import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../src/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

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
      type: 'FeatureCollection',
      features: (departamentosData || []).map((item) => ({
        type: 'Feature',
        properties: {
          name: item.name || null,
          admin_level: item.admin_level || null,
          departamento: item.name || null
        },
        geometry: item.geom ? JSON.parse(item.geom) : null
      }))
    };

    const ciudadesGeojson = {
      type: 'FeatureCollection',
      features: (ciudadesData || []).map((item) => ({
        type: 'Feature',
        properties: {
          nombre: item.name || null,
          departamento: item.department_name || null,
          tipo: item.municipality_type || null,
          descripcion: item.description || null,
          status: item.status || null
        },
        geometry: item.geom ? JSON.parse(item.geom) : null
      }))
    };

    return NextResponse.json({
      departamentos: departamentosGeojson,
      ciudades: ciudadesGeojson
    });
  } catch (error) {
    console.error('Error loading map data from Supabase:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar la base de datos' },
      { status: 500 }
    );
  }
}
