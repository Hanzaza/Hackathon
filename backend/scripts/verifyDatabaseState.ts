import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyDatabase() {
  const directUrl = process.env.DIRECT_URL;
  if (!directUrl) {
    console.error('❌ DIRECT_URL is missing in backend/.env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos PostgreSQL en vivo.\n');

    const tables = [
      'departments',
      'municipalities',
      'creative_routes',
      'route_places',
      'users',
      'entrepreneur_requests',
      'entrepreneurs',
      'entrepreneur_events',
      'achievements',
      'user_achievements',
      'user_progress',
      'reviews',
      'reports',
    ];

    console.log('--- RECUENTO DE REGISTROS POR TABLA ---');
    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM public.${table};`);
        console.log(`📋 ${table.padEnd(25)}: ${res.rows[0].count} registros`);
      } catch (err: any) {
        console.error(`❌ Error en tabla ${table}:`, err.message);
      }
    }

    console.log('\n--- VERIFICACIÓN DE COLUMNAS CLAVE EN route_places ---');
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'route_places'
      ORDER BY ordinal_position;
    `);
    cols.rows.forEach((c) => {
      console.log(`  - ${c.column_name} (${c.data_type})`);
    });

    console.log('\n--- MUESTRA DE HITOS PRINCIPALES VS SECUNDARIOS ---');
    const placesSample = await client.query(`
      SELECT name, is_primary_route_point, category, points_reward, walk_time
      FROM public.route_places
      LIMIT 10;
    `);
    console.table(placesSample.rows);

    console.log('\n--- MUESTRA DE DEPARTAMENTOS Y REGIONES CREATIVAS ---');
    const deptsSample = await client.query(`
      SELECT name, code, is_creative_region, status
      FROM public.departments
      LIMIT 10;
    `);
    console.table(deptsSample.rows);

    console.log('\n--- MUESTRA DE CIUDADES CREATIVAS ---');
    const munSample = await client.query(`
      SELECT name, is_creative, municipality_type, status
      FROM public.municipalities
      LIMIT 10;
    `);
    console.table(munSample.rows);

  } catch (err) {
    console.error('❌ Error verificando BD:', err);
  } finally {
    await client.end();
  }
}

verifyDatabase();
