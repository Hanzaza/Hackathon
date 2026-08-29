import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function inspectDb() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Check columns of public.users
    const columnsRes = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position;
    `);
    console.log('\n--- Columns of public.users ---');
    console.table(columnsRes.rows);

    // Check RLS policies on public.users
    const rlsRes = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'users';
    `);
    console.log('\n--- RLS Policies on public.users ---');
    console.table(rlsRes.rows);

  } catch (err) {
    console.error('Error querying pg:', err);
  } finally {
    await client.end();
  }
}

inspectDb();
