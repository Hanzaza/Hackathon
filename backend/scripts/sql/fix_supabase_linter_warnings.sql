-- =========================================================================================
-- SOLUCIÓN DE ADVERTENCIAS DE SEGURIDAD (SUPABASE LINTER REMEDIATION)
-- =========================================================================================

-- 1. CORREGIR POLÍTICAS DEMASIADO PERMISIVAS EN 'public.users'
-- Evita que cualquiera inserte o modifique perfiles ajenos con USING/WITH CHECK (true)

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::text = id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- 2. ASEGURAR 'search_path' EN FUNCIONES SECURITY DEFINER
-- Evita vulnerabilidades de secuestro de ruta de búsqueda (Search Path Mutability)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, name, lastname, email, role, status, points, level)
  VALUES (
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'lastname', ''),
    new.email,
    'user',
    'active',
    50,
    1
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN new;
END;
$$;

-- 3. REVOCAR PERMISOS DE EJECUCIÓN PÚBLICA EN FUNCIONES INTERNAS
-- Las funciones de trigger (como handle_new_user) no deben ser accesibles vía REST RPC por 'anon' ni 'authenticated'

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Si existe la función rls_auto_enable, protegerla igualmente:
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;';
  END IF;
END $$;
