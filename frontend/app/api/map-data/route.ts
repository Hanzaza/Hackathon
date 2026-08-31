import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../src/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const [
      { data: departamentosData, error: departamentosError },
      { data: ciudadesData, error: ciudadesError },
      { data: routesData, error: routesError },
      { data: placesData, error: placesError },
    ] = await Promise.all([
      supabase.from('departments').select('*').order('name', { ascending: true }),
      supabase.from('municipalities').select('*').order('name', { ascending: true }),
      supabase.from('creative_routes').select('*, municipalities(name, slug)').order('name', { ascending: true }),
      supabase.from('route_places').select('*, creative_routes(name, slug), municipalities(name, slug)').order('order_num', { ascending: true }),
    ]);

    if (departamentosError || ciudadesError) {
      throw departamentosError || ciudadesError;
    }

    const departamentosGeojson = {
      type: 'FeatureCollection',
      features: (departamentosData || []).map((item) => ({
        type: 'Feature',
        properties: {
          id: item.id,
          name: item.name || null,
          slug: item.slug || null,
          code: item.code || null,
          admin_level: item.admin_level || null,
          departamento: item.name || null,
          is_creative_region: item.is_creative_region ?? true,
          description: item.description || null,
        },
        geometry: item.geom ? (typeof item.geom === 'string' ? JSON.parse(item.geom) : item.geom) : null,
      })),
    };

    const ciudadesGeojson = {
      type: 'FeatureCollection',
      features: (ciudadesData || []).map((item) => ({
        type: 'Feature',
        properties: {
          id: item.id,
          nombre: item.name || null,
          slug: item.slug || null,
          departamento: item.department_name || null,
          tipo: item.municipality_type || null,
          subtitle: item.subtitle || null,
          descripcion: item.description || null,
          is_creative: item.is_creative ?? false,
          status: item.status || 'active',
          lat: item.lat ? parseFloat(item.lat) : 12.4350,
          lng: item.lng ? parseFloat(item.lng) : -86.8782,
        },
        geometry: item.lat && item.lng
          ? {
              type: 'Point',
              coordinates: [parseFloat(item.lng), parseFloat(item.lat)],
            }
          : item.geom ? (typeof item.geom === 'string' ? JSON.parse(item.geom) : item.geom) : null,
      })),
    };

    const placesGeojson = {
      type: 'FeatureCollection',
      features: (placesData || []).map((p) => ({
        type: 'Feature',
        properties: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          description: p.description,
          icon_name: p.icon_name,
          image_url: p.image_url,
          audio_guide_url: p.audio_guide_url,
          vr_360_url: p.vr_360_url,
          is_primary_route_point: p.is_primary_route_point ?? true,
          walk_time: p.walk_time,
          points_reward: p.points_reward || 50,
          route_id: p.route_id,
          route_name: p.creative_routes?.name,
          city_name: p.municipalities?.name,
          lat: p.lat ? parseFloat(p.lat) : 12.4350,
          lng: p.lng ? parseFloat(p.lng) : -86.8782,
        },
        geometry: {
          type: 'Point',
          coordinates: [
            p.lng ? parseFloat(p.lng) : -86.8782,
            p.lat ? parseFloat(p.lat) : 12.4350,
          ],
        },
      })),
    };

    return NextResponse.json({
      departamentos: departamentosGeojson,
      ciudades: ciudadesGeojson,
      puntos: placesGeojson,
      rutas: routesData || [],
    });
  } catch (error) {
    console.error('Error loading map data from Supabase:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar la base de datos' },
      { status: 500 }
    );
  }
}
