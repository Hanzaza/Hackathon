import { getSupabaseClient } from '../src/services/supabaseService.js';
import dotenv from 'dotenv';
dotenv.config();

async function testSupabase() {
  console.log('====================================================');
  console.log('  TEST DE CONEXIÓN Y TABLAS - SUPABASE POSTGRES');
  console.log('====================================================');

  try {
    const supabase = getSupabaseClient();
    console.log(' Cliente Supabase inicializado correctamente.');

    const tables = [
      'countries',
      'departments',
      'municipalities',
      'creative_routes',
      'route_places',
      'map_points',
      'users',
      'entrepreneur_requests',
      'entrepreneurs',
      'entrepreneur_events',
      'achievements',
      'user_achievements',
      'user_progress',
      'reviews',
      'reports'
    ];

    console.log('\n Verificando tablas en Supabase:');
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ Tabla [${table}]: Error (${error.message})`);
        } else {
          console.log(` Tabla [${table}]: OK (${count || 0} registros)`);
        }
      } catch (err: any) {
        console.log(`⚠️ Tabla [${table}]: No accesible (${err.message})`);
      }
    }

    console.log('\n====================================================');
    console.log(' Test completado.');
    console.log('====================================================');
  } catch (error: any) {
    console.error('❌ Error de conexión general:', error.message || error);
  }
}

testSupabase();
