import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabasePgUrl = 'postgresql://postgres:Stateless_Mobility@db.zgjzwnbtfmkixqmnmxkw.supabase.co:5432/postgres';
const currentDirectUrl = process.env.DIRECT_URL || '';

async function testUrl(name: string, connString: string) {
  console.log(`\n=== Testing: ${name} ===`);
  console.log(`URL: ${connString}`);
  const client = new Client({
    connectionString: connString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`✅ Connected successfully to ${name}`);
    const tablesRes = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);
    console.log('Tables found:', tablesRes.rows.map(r => r.tablename));

    for (const t of ['departments', 'municipalities', 'route_places', 'users']) {
      try {
        const countRes = await client.query(`SELECT COUNT(*) FROM public.${t};`);
        console.log(`  - ${t}: ${countRes.rows[0].count} rows`);
      } catch (e: any) {
        console.log(`  - ${t}: table error (${e.message})`);
      }
    }
  } catch (err: any) {
    console.error(`❌ Failed to connect to ${name}:`, err.message);
  } finally {
    try { await client.end(); } catch {}
  }
}

async function main() {
  await testUrl('Supabase Postgres (db.zgjzwnbtfmkixqmnmxkw.supabase.co)', supabasePgUrl);
  await testUrl('Current DIRECT_URL (pooled.db.prisma.io)', currentDirectUrl);
}

main();
