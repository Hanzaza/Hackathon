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

// Mapeos por defecto para los logros icónicos de la plataforma
const DEFAULT_ROUTE_LINKS: Record<string, string> = {
  'guardian-dariano': '383a8707-898a-4ffe-9df9-04c3e3bc1184', // Circuito Creativo Rubén Darío (León)
  'explorador-circuitos': '8ebef586-f87f-4267-9ae7-e4810b1db985', // Circuito Creativo “Tierra Viva” (San Juan de Oriente)
};

function parseRouteIdFromDesc(desc: string | null | undefined): { cleanDesc: string; routeId?: string } {
  if (!desc) return { cleanDesc: '' };
  const match = desc.match(/\[route:([a-zA-Z0-9_-]+)\]/);
  if (match) {
    const routeId = match[1];
    const cleanDesc = desc.replace(/\[route:[a-zA-Z0-9_-]+\]/, '').trim();
    return { cleanDesc, routeId };
  }
  return { cleanDesc: desc };
}

// GET: Listar todos los logros (enriquecidos con route_id y nombre de la ruta)
export async function GET() {
  try {
    const supabase = getAdminClient();
    
    // Obtener logros y rutas en paralelo
    const [achsRes, routesRes] = await Promise.all([
      supabase.from('achievements').select('*').order('points_reward', { ascending: false }),
      supabase.from('creative_routes').select('id, name, slug'),
    ]);

    if (achsRes.error) {
      return NextResponse.json({ error: achsRes.error.message }, { status: 500 });
    }

    const routes = routesRes.data || [];
    const routeMap = new Map(routes.map((r: any) => [r.id, r]));

    const enriched = (achsRes.data || []).map((a: any) => {
      let route_id = a.route_id;
      let description = a.description || '';

      // Si no viene en columna nativa, buscar en tag embebido o defaults
      if (!route_id) {
        const parsed = parseRouteIdFromDesc(description);
        if (parsed.routeId) {
          route_id = parsed.routeId;
          description = parsed.cleanDesc;
        } else if (DEFAULT_ROUTE_LINKS[a.slug]) {
          route_id = DEFAULT_ROUTE_LINKS[a.slug];
        }
      }

      const linkedRoute = route_id ? routeMap.get(route_id) : undefined;

      return {
        ...a,
        description,
        route_id: route_id || null,
        route_name: linkedRoute ? linkedRoute.name : null,
      };
    });

    return NextResponse.json(enriched);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en servidor' }, { status: 500 });
  }
}

// POST: Crear nuevo logro
export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const routeId = body.route_id || null;

    // Intentar primero con la columna route_id nativa
    const payloadWithRoute: Record<string, any> = {
      name: body.name,
      slug,
      description: body.description || '',
      achievement_type: body.achievement_type || 'ruta',
      icon: body.icon || '🏆',
      points_reward: Number(body.points_reward) || 100,
      required_count: Number(body.required_count) || 1,
    };

    if (routeId) {
      payloadWithRoute.route_id = routeId;
    }

    let insertRes = await supabase.from('achievements').insert([payloadWithRoute]).select().single();

    // Si falló porque la columna route_id aún no existe en Supabase, guardar como tag en description
    if (insertRes.error && insertRes.error.message.includes('route_id')) {
      const descWithTag = routeId
        ? `${body.description || ''} [route:${routeId}]`.trim()
        : (body.description || '');

      const payloadFallback = {
        name: body.name,
        slug,
        description: descWithTag,
        achievement_type: body.achievement_type || 'ruta',
        icon: body.icon || '🏆',
        points_reward: Number(body.points_reward) || 100,
        required_count: Number(body.required_count) || 1,
      };

      insertRes = await supabase.from('achievements').insert([payloadFallback]).select().single();
    }

    if (insertRes.error) {
      return NextResponse.json({ error: insertRes.error.message }, { status: 500 });
    }

    const created = insertRes.data;
    const parsed = parseRouteIdFromDesc(created.description);

    return NextResponse.json({
      ...created,
      description: parsed.cleanDesc,
      route_id: created.route_id || parsed.routeId || routeId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al crear logro' }, { status: 500 });
  }
}

// PUT: Actualizar logro existente
export async function PUT(req: Request) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'ID de logro requerido para edición' }, { status: 400 });
    }

    const { id, ...updates } = body;
    const cleanUpdates: Record<string, any> = {};

    if (updates.name !== undefined) cleanUpdates.name = updates.name;
    if (updates.slug !== undefined) cleanUpdates.slug = updates.slug;
    if (updates.description !== undefined) cleanUpdates.description = updates.description;
    if (updates.achievement_type !== undefined) cleanUpdates.achievement_type = updates.achievement_type;
    if (updates.icon !== undefined) cleanUpdates.icon = updates.icon;
    if (updates.points_reward !== undefined) cleanUpdates.points_reward = Number(updates.points_reward) || 0;
    if (updates.required_count !== undefined) cleanUpdates.required_count = Number(updates.required_count) || 1;
    if (updates.route_id !== undefined) cleanUpdates.route_id = updates.route_id;

    let updateRes = await supabase
      .from('achievements')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    // Si falló por route_id inexistente en BD, guardar route_id embebido en description
    if (updateRes.error && updateRes.error.message.includes('route_id')) {
      delete cleanUpdates.route_id;
      const baseDesc = updates.description !== undefined ? updates.description : '';
      const cleanDesc = baseDesc.replace(/\[route:[a-zA-Z0-9_-]+\]/, '').trim();
      cleanUpdates.description = updates.route_id
        ? `${cleanDesc} [route:${updates.route_id}]`.trim()
        : cleanDesc;

      updateRes = await supabase
        .from('achievements')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();
    }

    if (updateRes.error) {
      return NextResponse.json({ error: updateRes.error.message }, { status: 500 });
    }

    const updated = updateRes.data;
    const parsed = parseRouteIdFromDesc(updated.description);

    return NextResponse.json({
      ...updated,
      description: parsed.cleanDesc,
      route_id: updated.route_id || parsed.routeId || updates.route_id || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al actualizar logro' }, { status: 500 });
  }
}

// DELETE: Eliminar logro
export async function DELETE(req: Request) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido para eliminación' }, { status: 400 });
    }

    const { error } = await supabase.from('achievements').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Logro eliminado con éxito' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al eliminar logro' }, { status: 500 });
  }
}
