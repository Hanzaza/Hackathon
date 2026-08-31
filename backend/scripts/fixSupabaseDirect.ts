import { Client } from 'pg';

async function fixSupabaseDirect() {
  const url = 'postgresql://postgres:Stateless_Mobility@db.zgjzwnbtfmkixqmnmxkw.supabase.co:5432/postgres';
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL as postgres user.');

    // 1. Check current RLS status on Supabase
    const rls = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
      WHERE nspname = 'public' AND relkind = 'r';
    `);
    console.log('Current RLS on Supabase:', rls.rows);

    // 2. Check current grants
    const grants = await client.query(`
      SELECT grantee, table_name, privilege_type 
      FROM information_schema.role_table_grants 
      WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated');
    `);
    console.log('Grants on Supabase:', grants.rows);

    // 3. Grant schema usage and permissions to anon and authenticated
    console.log('Granting schema and table permissions to anon & authenticated on Supabase...');
    await client.query(`
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
      
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
      GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, postgres, service_role;

      -- Disable RLS or create open policies for public read
      DO $$
      DECLARE
        t text;
      BEGIN
        FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
        LOOP
          EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY;', t);
        END LOOP;
      END $$;

      NOTIFY pgrst, 'reload schema';
    `);
    console.log('✅ Applied permissions and disabled RLS on Supabase!');

  } catch (err) {
    console.error('Error on Supabase:', err);
  } finally {
    await client.end();
  }
}

fixSupabaseDirect();
