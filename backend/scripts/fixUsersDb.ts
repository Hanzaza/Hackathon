import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function fixUsersDatabase() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database...');

    // 1. Make password_hash nullable and default to empty string or remove constraint
    console.log('1. Altering password_hash column in public.users...');
    await client.query(`
      ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;
      ALTER TABLE public.users ALTER COLUMN password_hash SET DEFAULT '';
    `);

    // 2. Set default points to 50 and ensure country/city have good defaults
    console.log('2. Setting defaults on public.users...');
    await client.query(`
      ALTER TABLE public.users ALTER COLUMN points SET DEFAULT 50;
      ALTER TABLE public.users ALTER COLUMN country SET DEFAULT 'Nicaragua';
      ALTER TABLE public.users ALTER COLUMN city SET DEFAULT 'León';
    `);

    // 3. Create or replace the handle_new_user function
    console.log('3. Creating handle_new_user function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.users (
          id,
          email,
          name,
          lastname,
          password_hash,
          role,
          avatar,
          city,
          country,
          points,
          level
        )
        VALUES (
          new.id::text,
          new.email,
          COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
          COALESCE(new.raw_user_meta_data->>'lastname', ''),
          '',
          COALESCE(new.raw_user_meta_data->>'role', 'user'),
          COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'),
          COALESCE(new.raw_user_meta_data->>'city', 'León'),
          'Nicaragua',
          50,
          1
        )
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          name = CASE WHEN public.users.name = '' OR public.users.name IS NULL THEN EXCLUDED.name ELSE public.users.name END,
          lastname = CASE WHEN public.users.lastname = '' OR public.users.lastname IS NULL THEN EXCLUDED.lastname ELSE public.users.lastname END,
          city = COALESCE(EXCLUDED.city, public.users.city);
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // 4. Create trigger on auth.users
    console.log('4. Creating trigger on auth.users...');
    await client.query(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);

    // 5. Retroactive sync from existing auth.users into public.users
    console.log('5. Running retroactive sync from auth.users into public.users...');
    await client.query(`
      INSERT INTO public.users (id, email, name, lastname, password_hash, role, avatar, city, country, points, level)
      SELECT 
        id::text,
        email,
        COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
        COALESCE(raw_user_meta_data->>'lastname', ''),
        '',
        COALESCE(raw_user_meta_data->>'role', 'user'),
        COALESCE(raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'),
        COALESCE(raw_user_meta_data->>'city', 'León'),
        'Nicaragua',
        50,
        1
      FROM auth.users
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email;
    `);

    // 6. Ensure RLS policies allow SELECT and INSERT/UPDATE
    console.log('6. Ensuring RLS policies...');
    await client.query(`
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Public read for users" ON public.users;
      CREATE POLICY "Public read for users" ON public.users FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
      CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (true);

      DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
      CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (true);
    `);

    console.log('🎉 Database configuration and triggers successfully applied!');
  } catch (err) {
    console.error('❌ Error executing database fixes:', err);
  } finally {
    await client.end();
  }
}

fixUsersDatabase();
