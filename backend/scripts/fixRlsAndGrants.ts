import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixRlsAndGrants() {
  const directUrl = process.env.DIRECT_URL;
  const client = new Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL para verificar y otorgar permisos a anon y authenticated...');

    // Deshabilitar RLS en todas las tablas para permitir acceso PostgREST directo
    const disableRlsSql = `
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
    `;

    await client.query(disableRlsSql);
    console.log('✅ RLS deshabilitado en todas las tablas públicas y PostgREST recargado con éxito.');

  } catch (err: any) {
    console.error('❌ Error aplicando permisos:', err.message);
  } finally {
    await client.end();
  }
}

fixRlsAndGrants();
