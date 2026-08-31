import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://zgjzwnbtfmkixqmnmxkw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendQueries() {
  console.log('🧪 Verificando lectura completa desde Supabase para el Panel Admin:\n');

  // 1. Departamentos
  const { data: depts, error: dErr } = await supabase
    .from('departments')
    .select('id, name, code, is_creative_region, status')
    .order('name');
  
  console.log(`📋 DEPARTAMENTOS (${depts?.length || 0} encontrados):`);
  console.table(depts);

  // 2. Municipios Creativos
  const { data: mun, error: mErr } = await supabase
    .from('municipalities')
    .select('id, name, is_creative, municipality_type, lat, lng, status')
    .order('name');
  
  console.log(`\n🏛️ MUNICIPIOS CREATIVOS (${mun?.length || 0} encontrados):`);
  console.table(mun);

  // 3. Rutas y Paradas (Hitos Primarios vs Secundarios)
  const { data: places, error: pErr } = await supabase
    .from('route_places')
    .select('id, name, is_primary_route_point, category, points_reward, walk_time')
    .order('order_num');

  console.log(`\n📍 HITOS Y PARADAS DEL MAPA (${places?.length || 0} encontrados):`);
  console.table(places);

  // 4. Logros de Gamificación
  const { data: ach } = await supabase
    .from('achievements')
    .select('id, name, slug, points_reward, achievement_type');

  console.log(`\n🏆 LOGROS DE GAMIFICACIÓN (${ach?.length || 0} encontrados):`);
  console.table(ach);
}

testFrontendQueries();
