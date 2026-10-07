import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET: Listar todas las rutas creativas con su municipio
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('creative_routes')
      .select('*, municipalities(name)')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching routes in API:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const routes = (data || []).map((r: any) => ({
      ...r,
      municipality_name: r.municipalities?.name || '',
    }));

    return NextResponse.json(routes);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error al obtener rutas creativas' },
      { status: 500 }
    );
  }
}

// POST: Crear nueva ruta creativa
export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'El nombre del circuito es obligatorio' }, { status: 400 });
    }

    // Resolver municipality_id si se envió nombre
    let munId = body.municipality_id;
    if (!munId && body.municipality_name) {
      const { data: mun } = await supabase
        .from('municipalities')
        .select('id')
        .ilike('name', `%${body.municipality_name.trim()}%`)
        .limit(1)
        .maybeSingle();
      if (mun) munId = mun.id;
    }
    if (!munId) {
      const { data: firstMun } = await supabase.from('municipalities').select('id').limit(1).maybeSingle();
      munId = firstMun?.id;
    }

    const cleanPayload: Record<string, any> = {
      name: body.name.trim(),
      slug: body.slug || generateSlug(body.name),
      municipality_id: munId,
      description: body.description || '',
      theme: body.theme || 'Cultura & Tradición',
      difficulty: body.difficulty || 'Fácil',
      estimated_duration: Number(body.estimated_duration) || 120,
      points_award: Number(body.points_award) || 200,
      badge_name: body.badge_name || '',
      badge_icon: body.badge_icon || 'Compass',
      cover_image: body.cover_image || null,
      route_color: body.route_color || '#7c3aed',
      status: body.status || 'published',
      is_visible_in_map: body.is_visible_in_map !== undefined ? Boolean(body.is_visible_in_map) : true,
    };

    const { data, error } = await supabase
      .from('creative_routes')
      .insert([cleanPayload])
      .select('*, municipalities(name)')
      .single();

    if (error) {
      console.error('Error creating route in API:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      route: {
        ...data,
        municipality_name: data.municipalities?.name || body.municipality_name || '',
      },
    });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/routes:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al crear ruta' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar ruta creativa existente
export async function PUT(req: Request) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'ID de la ruta es requerido' }, { status: 400 });
    }

    // Resolver municipality_id si se modificó el municipio
    let resolvedMunId = body.municipality_id;
    if (body.municipality_name) {
      const { data: mun } = await supabase
        .from('municipalities')
        .select('id')
        .ilike('name', `%${body.municipality_name.trim()}%`)
        .limit(1)
        .maybeSingle();
      if (mun) resolvedMunId = mun.id;
    }

    // Construir payload limpio con ÚNICAMENTE columnas reales de la tabla creative_routes
    const cleanUpdates: Record<string, any> = {};

    if (body.name !== undefined) {
      cleanUpdates.name = body.name.trim();
    }
    if (body.description !== undefined) {
      cleanUpdates.description = body.description;
    }
    if (body.theme !== undefined) {
      cleanUpdates.theme = body.theme;
    }
    if (body.difficulty !== undefined) {
      cleanUpdates.difficulty = body.difficulty;
    }
    if (body.estimated_duration !== undefined) {
      cleanUpdates.estimated_duration = Number(body.estimated_duration) || 120;
    }
    if (body.points_award !== undefined) {
      cleanUpdates.points_award = Number(body.points_award) || 200;
    }
    if (body.badge_name !== undefined) {
      cleanUpdates.badge_name = body.badge_name;
    }
    if (body.badge_icon !== undefined) {
      cleanUpdates.badge_icon = body.badge_icon;
    }
    if (body.cover_image !== undefined) {
      cleanUpdates.cover_image = body.cover_image;
    }
    if (body.route_color !== undefined) {
      cleanUpdates.route_color = body.route_color;
    }
    if (body.status !== undefined) {
      cleanUpdates.status = body.status;
    }
    if (body.is_visible_in_map !== undefined) {
      cleanUpdates.is_visible_in_map = Boolean(body.is_visible_in_map);
    }
    if (resolvedMunId) {
      cleanUpdates.municipality_id = resolvedMunId;
    }
    if (body.slug) {
      cleanUpdates.slug = body.slug;
    }
    cleanUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('creative_routes')
      .update(cleanUpdates)
      .eq('id', id)
      .select('*, municipalities(name)')
      .single();

    if (error) {
      console.error('Error updating route in API:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      route: {
        ...data,
        municipality_name: data.municipalities?.name || body.municipality_name || '',
      },
    });
  } catch (error: any) {
    console.error('Unexpected error in PUT /api/admin/routes:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al actualizar ruta' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar ruta creativa
export async function DELETE(req: Request) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const { error } = await supabase.from('creative_routes').delete().eq('id', id);

    if (error) {
      console.error('Error deleting route in API:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/admin/routes:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al eliminar ruta' },
      { status: 500 }
    );
  }
}
