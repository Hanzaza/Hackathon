-- =========================================================================================
-- SOLUCIÓN DEFINITIVA: HABILITAR LECTURA Y GESTIÓN DE DATOS EN SUPABASE
-- Proyecto: Red Nacional de Ciudades Creativas de Nicaragua
-- =========================================================================================
-- INSTRUCCIONES:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard/project/zgjzwnbtfmkixqmnmxkw
-- 2. En el menú lateral izquierdo, haz clic en "SQL Editor".
-- 3. Haz clic en "New query".
-- 4. Pega todo este código y haz clic en el botón verde "Run".
-- =========================================================================================

-- PASO 1: Deshabilitar Row Level Security (RLS) en todas las tablas principales
ALTER TABLE IF EXISTS public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.municipalities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.creative_routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.route_places DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.entrepreneur_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.entrepreneurs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.entrepreneur_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

-- PASO 2: Otorgar permisos de uso y ejecución a todos los roles de Supabase (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- PASO 3: Asegurar privilegios por defecto para cualquier creación o alteración futura
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- PASO 4: Recargar el esquema en PostgREST inmediatamente para que los cambios surtan efecto en tiempo real
NOTIFY pgrst, 'reload schema';
