import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function grantPermissions() {
  const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const client = new Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL...');

    await client.query(`
      -- Grant schema usage
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON SCHEMA public TO postgres, service_role;

      -- Grant table permissions
      GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

      -- Grant sequence permissions
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, anon, authenticated;

      -- Grant routine/function permissions
      GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role, anon, authenticated;

      -- Set default privileges for future tables
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, service_role, anon, authenticated;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, service_role, anon, authenticated;

      -- Reload PostgREST schema cache
      NOTIFY pgrst, 'reload schema';
    `);

    console.log('✅ Permisos de PostgreSQL otorgados a anon, authenticated y service_role.');
  } catch (err: any) {
    console.error('❌ Error aplicando grants:', err.message);
  } finally {
    await client.end();
  }
}

grantPermissions();
