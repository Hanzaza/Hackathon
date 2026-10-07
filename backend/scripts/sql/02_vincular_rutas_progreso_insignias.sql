-- =========================================================================================
-- MIGRACIÓN 02: VINCULACIÓN DE RUTAS CREATIVAS, PROGRESO DE HITOS E INSIGNIAS
-- Proyecto: Red Nacional de Ciudades Creativas de Nicaragua (ROOTS)
-- =========================================================================================
-- INSTRUCCIONES:
-- 1. Ve a tu panel de Supabase: https://supabase.com/dashboard/project/zgjzwnbtfmkixqmnmxkw
-- 2. En el menú lateral izquierdo, haz clic en "SQL Editor".
-- 3. Haz clic en "New query".
-- 4. Pega todo este código y haz clic en el botón verde "Run".
-- =========================================================================================

-- 1. Agregar columna route_id a la tabla de logros (achievements)
ALTER TABLE IF EXISTS public.achievements 
ADD COLUMN IF NOT EXISTS route_id TEXT REFERENCES public.creative_routes(id) ON DELETE SET NULL;

-- 2. Vincular logros existentes a sus rutas oficiales
UPDATE public.achievements
SET route_id = '383a8707-898a-4ffe-9df9-04c3e3bc1184'
WHERE slug = 'guardian-dariano';

UPDATE public.achievements
SET route_id = '8ebef586-f87f-4267-9ae7-e4810b1db985'
WHERE slug = 'explorador-circuitos';

-- 3. Crear tabla de progreso de usuario por lugar de ruta (2 pasos evaluados: reseña + foto)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  route_id TEXT NOT NULL REFERENCES public.creative_routes(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES public.route_places(id) ON DELETE CASCADE,
  has_review BOOLEAN DEFAULT false,
  review_rating INTEGER,
  review_comment TEXT,
  has_photo BOOLEAN DEFAULT false,
  photo_url TEXT,
  is_completed BOOLEAN DEFAULT false, -- True solo cuando has_review = true Y has_photo = true
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, route_id, place_id)
);

-- 4. Crear tabla de logros desbloqueados por usuario
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  route_id TEXT REFERENCES public.creative_routes(id) ON DELETE SET NULL,
  points_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'unlocked',
  UNIQUE(user_id, achievement_id)
);

-- 5. Crear tabla de reseñas públicas de lugares
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  place_id TEXT REFERENCES public.route_places(id) ON DELETE CASCADE,
  route_id TEXT REFERENCES public.creative_routes(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  author_name TEXT DEFAULT 'Explorador Cultural',
  comment TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Deshabilitar RLS y otorgar permisos
ALTER TABLE IF EXISTS public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
