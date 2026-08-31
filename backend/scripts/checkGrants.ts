import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  console.log('--- TABLE GRANTS ---');
  const grants = await client.query(`
    SELECT grantee, table_name, privilege_type
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated', 'public')
    ORDER BY table_name, grantee;
  `);
  console.table(grants.rows.slice(0, 30));

  console.log('--- RLS STATUS ---');
  const rls = await client.query(`
    SELECT relname, relrowsecurity, relforcerowsecurity
    FROM pg_class
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE nspname = 'public' AND relkind = 'r'
    ORDER BY relname;
  `);
  console.table(rls.rows);

  console.log('--- POLICIES ---');
  const pol = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public';
  `);
  console.table(pol.rows);

  await client.end();
}

check().catch(console.error);
