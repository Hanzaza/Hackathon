import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../src/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Consultar todos los lugares/hitos de rutas de la base de datos
    const { data: places, error } = await supabase
      .from('route_places')
      .select(`
        id,
        route_id,
        municipality_id,
        name,
        slug,
        description,
        category,
        icon_name,
        image_url,
        audio_guide_url,
        vr_360_url,
        is_primary_route_point,
        walk_time,
        address,
        points_reward,
        lat,
        lng,
        status,
        creative_routes (
          name,
          slug
        ),
        municipalities (
          name,
          slug
        )
      `)
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    // Convertir a GeoJSON dinámico
    const geojson = {
      type: 'FeatureCollection' as const,
      features: (places || []).map((loc: any) => ({
        type: 'Feature' as const,
        properties: {
          id: loc.id,
          name: loc.name || 'Punto sin nombre',
          slug: loc.slug,
          category: loc.category || 'Patrimonio Cultural',
          description: loc.description,
          icon_name: loc.icon_name || 'MapPin',
          image_url: loc.image_url,
          audio_guide_url: loc.audio_guide_url,
          vr_360_url: loc.vr_360_url,
          is_primary_route_point: loc.is_primary_route_point ?? true,
          walk_time: loc.walk_time,
          points_reward: loc.points_reward || 50,
          route_name: loc.creative_routes?.name,
          city_name: loc.municipalities?.name,
          status: loc.status || 'active',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            parseFloat(loc.lng) || -86.8782,
            parseFloat(loc.lat) || 12.4350,
          ],
        },
      })),
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error('Error loading locations from Supabase:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar la base de datos' },
      { status: 500 }
    );
  }
}