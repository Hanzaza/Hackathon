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
        gallery,
        audio_guide_url,
        vr_360_url,
        is_primary_route_point,
        walk_time,
        address,
        points_reward,
        lat,
        lng,
        status,
        order_num,
        creative_routes (
          id,
          name,
          slug
        ),
        municipalities (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'active')
      .order('order_num', { ascending: true });

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
          gallery: Array.isArray(loc.gallery) ? loc.gallery : [],
          audio_guide_url: loc.audio_guide_url,
          vr_360_url: loc.vr_360_url,
          is_primary_route_point: loc.is_primary_route_point ?? true,
          walk_time: loc.walk_time,
          points_reward: loc.points_reward || 50,
          route_id: loc.route_id || loc.creative_routes?.id,
          route_name: loc.creative_routes?.name,
          route_slug: loc.creative_routes?.slug,
          municipality_id: loc.municipality_id || loc.municipalities?.id,
          city_name: loc.municipalities?.name,
          city_slug: loc.municipalities?.slug,
          status: loc.status || 'active',
          order_num: loc.order_num || 0,
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