import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDynamicCrud() {
  console.log('🧪 Probando inserción y consulta dinámica en Supabase en tiempo real...\n');

  // 1. Obtener Municipios
  const { data: municipalities } = await supabase
    .from('municipalities')
    .select('id, name, slug');

  console.log('Municipios encontrados:', municipalities);
  const targetMun = municipalities?.[0];

  if (!targetMun) {
    console.error('❌ No se encontraron municipios.');
    return;
  }
  console.log(`✅ Municipio seleccionado: ${targetMun.name} (ID: ${targetMun.id})`);

  // 2. Crear un Circuito Dinámico de Prueba
  const testSlug = `circuito-test-dinamico-${Date.now()}`;
  const { data: newRoute, error: routeErr } = await supabase
    .from('creative_routes')
    .insert([
      {
        municipality_id: targetMun.id,
        name: 'Circuito Test Dinámico de Artes & Poesía',
        slug: testSlug,
        description: 'Circuito insertado dinámicamente para validar persistencia 100% real.',
        theme: 'Cultura & Creatividad',
        difficulty: 'Fácil',
        estimated_duration: 90,
        points_award: 150,
        badge_name: 'Pionero Creativo',
        is_visible_in_map: true,
        status: 'published',
      },
    ])
    .select()
    .single();

  if (routeErr || !newRoute) {
    console.error('❌ Error creando circuito:', routeErr?.message);
    return;
  }
  console.log(`✅ Circuito creado en BD: "${newRoute.name}" con ID: ${newRoute.id}`);

  // 3. Crear una Parada Principal (Hito de Ruta)
  const { data: primaryPlace, error: pErr } = await supabase
    .from('route_places')
    .insert([
      {
        route_id: newRoute.id,
        municipality_id: targetMun.id,
        name: 'Hito Principal: Casa de los Leones Histórica',
        slug: `casa-leones-${Date.now()}`,
        description: 'Monumento central del recorrido.',
        category: 'Patrimonio Cultural',
        is_primary_route_point: true,
        lat: 12.4360,
        lng: -86.8790,
        points_reward: 100,
        walk_time: 'Inicio de ruta',
        audio_guide_url: 'https://cdn.roots.ni/audio/casa-leones.mp3',
        status: 'active',
      },
    ])
    .select()
    .single();

  if (pErr || !primaryPlace) {
    console.error('❌ Error creando parada principal:', pErr?.message);
    return;
  }
  console.log(`✅ Parada Principal creada: "${primaryPlace.name}" (is_primary_route_point = ${primaryPlace.is_primary_route_point})`);

  // 4. Crear una Parada Secundaria (Local Comercial / Taller de la Ciudad)
  const { data: secondaryPlace, error: sErr } = await supabase
    .from('route_places')
    .insert([
      {
        route_id: newRoute.id,
        municipality_id: targetMun.id,
        name: 'Punto Secundario: Taller & Galería El Arte Sutiaba',
        slug: `arte-sutiaba-${Date.now()}`,
        description: 'Taller artesanal asociado a la ciudad.',
        category: 'Taller Artesanal',
        is_primary_route_point: false,
        lat: 12.4345,
        lng: -86.8810,
        points_reward: 50,
        walk_time: '6 min a pie',
        status: 'active',
      },
    ])
    .select()
    .single();

  if (sErr || !secondaryPlace) {
    console.error('❌ Error creando parada secundaria:', sErr?.message);
    return;
  }
  console.log(`✅ Parada Secundaria creada: "${secondaryPlace.name}" (is_primary_route_point = ${secondaryPlace.is_primary_route_point})`);

  // 5. Consultar paradas del circuito
  const { data: allPlaces } = await supabase
    .from('route_places')
    .select('id, name, is_primary_route_point, points_reward, audio_guide_url')
    .eq('route_id', newRoute.id);

  console.log('\n--- VERIFICACIÓN DE CONSULTA EN VIVO ---');
  console.table(allPlaces);

  // 6. Limpieza de prueba
  await supabase.from('route_places').delete().eq('route_id', newRoute.id);
  await supabase.from('creative_routes').delete().eq('id', newRoute.id);
  console.log('🧹 Limpieza de registros de prueba completada.');
  console.log('🎉 ¡Prueba de inserción, distinción de puntos y lectura en tiempo real 100% EXITOSA!');
}

testDynamicCrud();
