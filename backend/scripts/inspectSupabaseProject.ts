import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://zgjzwnbtfmkixqmnmxkw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('🔍 Inspeccionando Supabase URL:', supabaseUrl);

  const tables = ['countries', 'departments', 'municipalities', 'cities', 'routes', 'creative_routes', 'route_places', 'places', 'users'];

  for (const t of tables) {
    try {
      const { data, error, count } = await supabase.from(t).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ Tabla "${t}": ${error.message} (Código: ${error.code})`);
      } else {
        console.log(`✅ Tabla "${t}": EXISTE (${count} registros)`);
      }
    } catch (e: any) {
      console.log(`⚠️ Excepción en "${t}":`, e.message);
    }
  }
}

inspect();
