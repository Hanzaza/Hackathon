-- ==============================================================================
-- BASE DE DATOS MAESTRA PARA SUPABASE: RED DE CIUDADES CREATIVAS DE NICARAGUA
-- ARQUITECTURA SEGURA: Integrada nativamente con Supabase Auth (auth.users)
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Estructura de Tablas

-- 2.1 Países
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  iso_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Departamentos
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_creative_region BOOLEAN NOT NULL DEFAULT false,
  geom GEOMETRY(Geometry, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Municipios / Ciudades Creativas
CREATE TABLE IF NOT EXISTS public.municipalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_creative BOOLEAN NOT NULL DEFAULT false,
  municipality_type TEXT NOT NULL DEFAULT 'tradicional',
  geom GEOMETRY(Point, 4326),
  department_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Circuitos y Rutas Creativas
CREATE TABLE IF NOT EXISTS public.creative_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_id UUID REFERENCES public.municipalities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  cover_image TEXT,
  theme TEXT,
  difficulty TEXT DEFAULT 'Fácil',
  estimated_duration INTEGER DEFAULT 120,
  points_award INTEGER NOT NULL DEFAULT 0,
  badge_name TEXT,
  is_visible_in_map BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Lugares / Puntos dentro de una Ruta
CREATE TABLE IF NOT EXISTS public.route_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.creative_routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  geom GEOMETRY(Point, 4326),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Puntos Libres del Mapa
CREATE TABLE IF NOT EXISTS public.map_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_id UUID REFERENCES public.municipalities(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  point_type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  geom GEOMETRY(Point, 4326),
  status TEXT NOT NULL DEFAULT 'approved',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 Perfiles de Usuarios (Vinculados 1:1 a auth.users de Supabase)
-- Las contraseñas y sesiones se gestionan de forma segura en auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'entrepreneur' | 'admin'
  status TEXT NOT NULL DEFAULT 'active',
  points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  bio TEXT,
  country TEXT DEFAULT 'Nicaragua',
  city TEXT DEFAULT 'León',
  favorite_categories TEXT[],
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.8 Solicitudes de Registro de Emprendedores
CREATE TABLE IF NOT EXISTS public.entrepreneur_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL DEFAULT 'entrepreneur',
  status TEXT NOT NULL DEFAULT 'pending',
  motivation TEXT,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'fisico',
  address TEXT,
  geom GEOMETRY(Point, 4326),
  documents TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 Emprendimientos Acreditados
CREATE TABLE IF NOT EXISTS public.entrepreneurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  municipality_id UUID REFERENCES public.municipalities(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'fisico',
  description TEXT,
  address TEXT,
  geom GEOMETRY(Point, 4326),
  status TEXT NOT NULL DEFAULT 'active',
  is_visible_in_map BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.10 Eventos Culturales y de Emprendedores
CREATE TABLE IF NOT EXISTS public.entrepreneur_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrepreneur_id UUID REFERENCES public.entrepreneurs(id) ON DELETE SET NULL,
  municipality_id UUID REFERENCES public.municipalities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location_name TEXT,
  location_geom GEOMETRY(Point, 4326),
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.11 Logros y Medallas de Gamificación
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  achievement_type TEXT NOT NULL,
  icon TEXT,
  points_reward INTEGER NOT NULL DEFAULT 0,
  required_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.12 Logros Desbloqueados por Usuarios
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'unlocked'
);

-- 2.13 Progreso de Rutas de Usuarios
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES public.creative_routes(id) ON DELETE SET NULL,
  completed_places UUID[],
  progress_percent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress',
  last_visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.14 Reseñas
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.15 Reportes y Moderación
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_departments_country_id ON public.departments(country_id);
CREATE INDEX IF NOT EXISTS idx_municipalities_department_id ON public.municipalities(department_id);
CREATE INDEX IF NOT EXISTS idx_creative_routes_municipality_id ON public.creative_routes(municipality_id);
CREATE INDEX IF NOT EXISTS idx_route_places_route_id ON public.route_places(route_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 4. Trigger Automático para Crear Perfil al Registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    lastname,
    role,
    avatar,
    city
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'lastname', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'),
    COALESCE(new.raw_user_meta_data->>'city', 'León')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Configuración de Row Level Security (RLS)
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepreneur_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepreneurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepreneur_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura Pública
CREATE POLICY "Public read for countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Public read for departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public read for municipalities" ON public.municipalities FOR SELECT USING (true);
CREATE POLICY "Public read for creative_routes" ON public.creative_routes FOR SELECT USING (true);
CREATE POLICY "Public read for route_places" ON public.route_places FOR SELECT USING (true);
CREATE POLICY "Public read for map_points" ON public.map_points FOR SELECT USING (true);
CREATE POLICY "Public read for achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read for events" ON public.entrepreneur_events FOR SELECT USING (true);
CREATE POLICY "Public read for entrepreneurs" ON public.entrepreneurs FOR SELECT USING (true);
CREATE POLICY "Public read for users" ON public.users FOR SELECT USING (true);

-- Políticas de Edición de Usuario
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own requests" ON public.entrepreneur_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own requests" ON public.entrepreneur_requests FOR SELECT USING (auth.uid() = user_id);

-- 6. Sincronización Retroactiva (Ejecutar para importar usuarios ya creados en auth.users a public.users)
INSERT INTO public.users (id, email, name, lastname, role, avatar, city)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'lastname', ''),
  COALESCE(raw_user_meta_data->>'role', 'user'),
  COALESCE(raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'),
  COALESCE(raw_user_meta_data->>'city', 'León')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;
