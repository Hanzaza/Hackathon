-- =========================================================================================
-- MASTER SQL MIGRATION & SEED FOR SUPABASE
-- Proyecto: Red Nacional de Ciudades Creativas de Nicaragua
-- =========================================================================================

-- 1. LIMPIEZA DE TABLAS OBSOLETAS Y RELACIONES ANTERIORES
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.route_places CASCADE;
DROP TABLE IF EXISTS public.creative_routes CASCADE;
DROP TABLE IF EXISTS public.entrepreneurs CASCADE;
DROP TABLE IF EXISTS public.entrepreneur_events CASCADE;
DROP TABLE IF EXISTS public.entrepreneur_requests CASCADE;
DROP TABLE IF EXISTS public.municipalities CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.countries CASCADE;

-- 2. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================================
-- 3. TABLAS PRINCIPALES
-- =========================================================================================

-- A. USUARIOS (Sincronizado con Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lastname TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'entrepreneur', 'department_manager', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  points INTEGER DEFAULT 50,
  level INTEGER DEFAULT 1,
  bio TEXT,
  country TEXT DEFAULT 'Nicaragua',
  city TEXT DEFAULT 'León',
  department TEXT,
  assigned_department_id TEXT,
  favorite_categories TEXT[] DEFAULT '{}',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B. DEPARTAMENTOS (15 Departamentos + 2 Regiones Autónomas)
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  description TEXT,
  hero_image TEXT,
  is_creative_region BOOLEAN DEFAULT false,
  manager_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- C. MUNICIPIOS / CIUDADES CREATIVAS
CREATE TABLE IF NOT EXISTS public.municipalities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  is_creative BOOLEAN DEFAULT false,
  municipality_type TEXT DEFAULT 'tradicional' CHECK (municipality_type IN ('creativa', 'tradicional', 'mixta', 'en_desarrollo')),
  hero_image TEXT,
  logo_url TEXT,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  specialties TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'pending', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- D. RUTAS Y CIRCUITOS CREATIVOS
CREATE TABLE IF NOT EXISTS public.creative_routes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  municipality_id TEXT REFERENCES public.municipalities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  theme TEXT,
  difficulty TEXT DEFAULT 'Fácil' CHECK (difficulty IN ('Fácil', 'Moderada', 'Desafiante')),
  estimated_duration INTEGER DEFAULT 120,
  points_award INTEGER DEFAULT 200,
  badge_name TEXT,
  badge_icon TEXT,
  cover_image TEXT,
  route_color TEXT DEFAULT '#9333ea',
  is_visible_in_map BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E. PARADAS Y PUNTOS DEL MAPA (HITOS PRINCIPALES VS PUNTOS SECUNDARIOS)
CREATE TABLE IF NOT EXISTS public.route_places (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  route_id TEXT REFERENCES public.creative_routes(id) ON DELETE CASCADE,
  municipality_id TEXT REFERENCES public.municipalities(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'Patrimonio Cultural',
  icon_name TEXT DEFAULT 'MapPin',
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  audio_guide_url TEXT,
  vr_360_url TEXT,
  is_primary_route_point BOOLEAN DEFAULT true, -- TRUE = Hito de Ruta | FALSE = Punto Secundario de la Ciudad
  walk_time TEXT,
  address TEXT,
  points_reward INTEGER DEFAULT 50,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  order_num INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- F. SOLICITUDES DE ACREDITACIÓN DE EMPRENDEDORES
CREATE TABLE IF NOT EXISTS public.entrepreneur_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  municipality_id TEXT REFERENCES public.municipalities(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_type TEXT DEFAULT 'fisico' CHECK (business_type IN ('fisico', 'digital', 'hibrido', 'artesania', 'gastronomia', 'hospedaje', 'tours')),
  category TEXT,
  description TEXT,
  motivation TEXT,
  address TEXT,
  phone TEXT,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  documents TEXT[] DEFAULT '{}',
  admin_notes TEXT,
  reviewed_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- G. EMPRENDEDORES ACREDITADOS
CREATE TABLE IF NOT EXISTS public.entrepreneurs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  municipality_id TEXT REFERENCES public.municipalities(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_type TEXT DEFAULT 'fisico',
  category TEXT DEFAULT 'Artesanías & Tradición',
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  cover_image TEXT,
  is_verified BOOLEAN DEFAULT true,
  is_visible_in_map BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- H. EVENTOS Y FESTIVALES CULTURALES
CREATE TABLE IF NOT EXISTS public.entrepreneur_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  municipality_id TEXT REFERENCES public.municipalities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Tradición & Folclore',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_name TEXT,
  image_url TEXT,
  points_reward INTEGER DEFAULT 100,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- I. LOGROS Y MEDALLAS DE GAMIFICACIÓN
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  achievement_type TEXT DEFAULT 'ruta' CHECK (achievement_type IN ('ruta', 'puntos_secundarios', 'foto', 'resena', 'evento', 'especial', 'visita')),
  icon TEXT DEFAULT '🏆',
  points_reward INTEGER DEFAULT 100,
  required_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- J. REPORTES Y MODERACIÓN
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reported_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('lugar', 'ruta', 'comentario', 'emprendedor')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================================
-- 4. POLÍTICAS RLS Y PERMISOS DE ACCESO
-- =========================================================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipalities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_places DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepreneur_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepreneurs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrepreneur_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, postgres, service_role;

-- =========================================================================================
-- 5. SEMBRADO DE DATOS (SEEDING) OFICIALES DE NICARAGUA
-- =========================================================================================

-- A. 15 Departamentos + 2 Regiones Autónomas
INSERT INTO public.departments (id, name, slug, code, description, is_creative_region, status) VALUES
  ('dept-01', 'León', 'leon', 'LE', 'Capital del Aprendizaje UNESCO, cuna de Rubén Darío, ciudad universitaria y epicentro del arte y la literatura.', true, 'active'),
  ('dept-02', 'Masaya', 'masaya', 'MY', 'Cuna del Folclore Nacional, artesanías en barro, hamacas, marimba y tradición ancestral de Monimbó.', true, 'active'),
  ('dept-03', 'Granada', 'granada', 'GR', 'La Gran Sultana, diseño colonial, arquitectura patrimonial, poesía internacional y tradición del lago.', true, 'active'),
  ('dept-04', 'Estelí', 'esteli', 'ES', 'El Diamante de las Segovias, capital del muralismo nicaragüense, música norteña y tradición tabacalera.', true, 'active'),
  ('dept-05', 'Matagalpa', 'matagalpa', 'MT', 'La Perla del Septentrión, café de especialidad, sones campesinos, naturaleza y tradiciones indígenas.', true, 'active'),
  ('dept-06', 'Managua', 'managua', 'MN', 'Capital de la República, vibrante centro de artes escénicas, diseño contemporáneo e innovación urbana.', true, 'active'),
  ('dept-07', 'Chontales', 'chontales', 'CT', 'Tierra de serranías, arqueología precolombina, cultura ganadera y tradición oral de Juigalpa.', true, 'active'),
  ('dept-08', 'Costa Caribe Sur (RACCS)', 'costa-caribe-sur', 'RACCS', 'Cultura caribeña multiétnica, danza del Palo de Mayo, música garífuna y creole de Bluefields.', true, 'active'),
  ('dept-09', 'Chinandega', 'chinandega', 'CH', 'Tierra de volcanes, agricultura féil, gastronomía marina y tradiciones religiosas coloniales.', false, 'active'),
  ('dept-10', 'Carazo', 'carazo', 'CZ', 'Cuna del Güegüense (Patrimonio de la Humanidad UNESCO) y tradiciones ecuestres.', false, 'active'),
  ('dept-11', 'Rivas', 'rivas', 'RI', 'Puerta del sur, rica en historias caciquiles, vientos lacustres y artesanías de la costa.', false, 'active'),
  ('dept-12', 'Nueva Segovia', 'nueva-segovia', 'NS', 'Montañas de pinares, café de altura, artesanías de tusa y riqueza histórica.', false, 'active'),
  ('dept-13', 'Madriz', 'madriz', 'MD', 'Hogar del Cañón de Somoto, rosquillas tradicionales de fama mundial y artesanías de henequén.', false, 'active'),
  ('dept-14', 'Jinotega', 'jinotega', 'JI', 'Ciudad de las Brumas, música de polkas y mazurcas campesinas y lagos de Apanás.', false, 'active'),
  ('dept-15', 'Boaco', 'boaco', 'BO', 'La Ciudad de Dos Pisos, tradición de bailes de moros y cristianos y quesos artesanales.', false, 'active'),
  ('dept-16', 'Río San Juan', 'rio-san-juan', 'RSJ', 'Ruta fluvial histórica, arte primitivista de Solentiname y exuberante biodiversidad.', false, 'active'),
  ('dept-17', 'Costa Caribe Norte (RACCN)', 'costa-caribe-norte', 'RACCN', 'Tierras ancestrales Miskitas, Mayangnas, artesanías de tuno y lengua materna viva.', false, 'active')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  is_creative_region = EXCLUDED.is_creative_region;

-- B. 10 Ciudades Creativas Oficiales
INSERT INTO public.municipalities (id, department_id, name, slug, subtitle, description, is_creative, municipality_type, hero_image, logo_url, lat, lng, specialties, status) VALUES
  ('mun-01', 'dept-01', 'León', 'leon', 'Capital del Aprendizaje y Ciudad Creativa Literaria', 'Ciudad universitaria, hogar de la Insigne Catedral de León y mausoleo de Rubén Darío.', true, 'creativa', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop', 12.4350, -86.8782, ARRAY['Literatura', 'Artes Plásticas', 'Patrimonio UNESCO'], 'active'),
  ('mun-02', 'dept-02', 'Masaya', 'masaya', 'Cuna del Folclore y Artesanía Nacional', 'Capital de las artesanías en barro, máscaras de cedazo, hamacas tejidas e indumentaria tradicional.', true, 'creativa', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300&auto=format&fit=crop', 11.9744, -86.0942, ARRAY['Artesanías en Barro', 'Folclore', 'Marimba'], 'active'),
  ('mun-03', 'dept-02', 'San Juan de Oriente', 'san-juan-de-oriente', 'Cuna de la Cerámica Precolombina y Contemporánea', 'Pueblo de artesanos donde cada casa es un taller de alfarería con técnicas heredadas de generaciones.', true, 'creativa', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop', 11.9064, -86.0750, ARRAY['Cerámica de Barro', 'Alfarería Precolombina', 'Diseño'], 'active'),
  ('mun-04', 'dept-02', 'Catarina', 'catarina', 'Jardín de Nicaragua y Ciudad Creativa del Diseño Paisajístico', 'Mirador panorámico sobre la Laguna de Apoyo, viveros florales y artesanías de bambú y madera.', true, 'creativa', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop', 11.9122, -86.0747, ARRAY['Diseño Paisajístico', 'Viveros', 'Artesanías de Bambú'], 'active'),
  ('mun-05', 'dept-03', 'Granada', 'granada', 'La Gran Sultana y Ciudad Creativa del Diseño Colonial', 'Ciudad patrimonial con calles empedradas, iglesias barrocas y riqueza gastronómica del vigorón.', true, 'creativa', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop', 11.9299, -85.9560, ARRAY['Arquitectura Colonial', 'Poesía', 'Gastronomía Tradicional'], 'active'),
  ('mun-06', 'dept-04', 'Estelí', 'esteli', 'Diamante de las Segovias y Capital del Muralismo', 'Ciudad de murales históricos en cada esquina, son nica, poesía y excelencia artesanal del tabaco.', true, 'creativa', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300&auto=format&fit=crop', 13.0919, -86.3538, ARRAY['Muralismo', 'Música Norteña', 'Cultura del Tabaco'], 'active'),
  ('mun-07', 'dept-05', 'Matagalpa', 'matagalpa', 'Perla del Septentrión y Ciudad Creativa de la Música Campesina', 'Tierras altas cafetaleras, polkas y mazurcas, chocolate artesanal y leyendas del norte.', true, 'creativa', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop', 12.9256, -85.9178, ARRAY['Café de Especialidad', 'Polkas y Mazurcas', 'Chocolate'], 'active'),
  ('mun-08', 'dept-08', 'Bluefields', 'bluefields', 'Capital Multicultural del Caribe Nicaragüense', 'Riqueza rítmica del Palo de Mayo, gastronomía de rondón y confluencia de 6 pueblos originarios.', true, 'creativa', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop', 12.0137, -83.7635, ARRAY['Palo de Mayo', 'Danza Étnica', 'Gastronomía Caribeña'], 'active'),
  ('mun-09', 'dept-07', 'Juigalpa', 'juigalpa', 'Tierra de Serranías, Poesía y Arqueología Chontaleña', 'Centro de la cultura taurina tradicional, museo arqueológico Gregorio Aguilar Barea y literatura de montaña.', true, 'creativa', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop', 12.1063, -85.3645, ARRAY['Arqueología', 'Tradición Taurina', 'Poesía Chontaleña'], 'active'),
  ('mun-10', 'dept-01', 'Nagarote', 'nagarote', 'Municipio Azul y Cuna del Quesillo Tradicional', 'Ciudad más limpia de Nicaragua, famosa por sus quesillos trenzados y vistas hacia el Lago Xolotlán.', true, 'creativa', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop', 12.2664, -86.5647, ARRAY['Quesillo Tradicional', 'Medio Ambiente', 'Gastronomía'], 'active')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  is_creative = EXCLUDED.is_creative,
  municipality_type = EXCLUDED.municipality_type,
  hero_image = EXCLUDED.hero_image,
  logo_url = EXCLUDED.logo_url,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  specialties = EXCLUDED.specialties;

-- C. Circuito Creativo Principal (Ruta Dariana)
INSERT INTO public.creative_routes (id, municipality_id, name, slug, description, theme, difficulty, estimated_duration, points_award, badge_name, badge_icon, cover_image, route_color, is_visible_in_map, status) VALUES
  ('route-01', 'mun-01', 'Ruta Creativa de los Leones & Rubén Darío', 'ruta-dariana-leon', 'Circuito cultural interactivo por los hitos históricos del modernismo literario y talleres artesanales de León.', 'Literatura & Patrimonio', 'Fácil', 120, 200, 'Caballero Dariano', 'BookOpen', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1600&auto=format&fit=crop', '#9333ea', true, 'published')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  points_award = EXCLUDED.points_award;

-- D. Paradas y Puntos (Hitos Principales vs Puntos Secundarios de la Ciudad)
INSERT INTO public.route_places (id, route_id, municipality_id, name, slug, description, category, icon_name, image_url, audio_guide_url, vr_360_url, is_primary_route_point, walk_time, address, points_reward, lat, lng, order_num, status) VALUES
  ('place-01', 'route-01', 'mun-01', 'Insigne Catedral de León (Patrimonio de la Humanidad UNESCO)', 'catedral-de-leon', 'La basílica más grande de Centroamérica. Mausoleo de Rubén Darío custodiado por el león doliente.', 'Patrimonio UNESCO', 'Landmark', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop', 'https://cdn.roots.ni/audios/catedral-leon-guia.mp3', 'https://cdn.roots.ni/vr360/catedral-leon.html', true, 'Punto de inicio', 'Costado este del Parque Central, León', 100, 12.4350, -86.8782, 1, 'active'),
  ('place-02', 'route-01', 'mun-01', 'Museo Archivo Rubén Darío', 'museo-ruben-dario', 'Casa solariega colonial donde Darío vivió su infancia. Manuscritos originales y pertenencias del Príncipe de las Letras.', 'Museo Literario', 'BookOpen', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop', 'https://cdn.roots.ni/audios/museo-dario.mp3', NULL, true, '4 min a pie', 'Calle Rubén Darío, León', 80, 12.4372, -86.8795, 2, 'active'),
  ('place-03', 'route-01', 'mun-01', 'Teatro Municipal José de la Cruz Mena', 'teatro-jose-de-la-cruz-mena', 'Templo neoclásico de las artes escénicas de Nicaragua, sede de óperas, recitales poéticos y danza clásica.', 'Artes Escénicas', 'Sparkles', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop', NULL, NULL, true, '3 min a pie', 'Costado este de la Iglesia San Francisco, León', 70, 12.4361, -86.8770, 3, 'active'),
  ('place-04', 'route-01', 'mun-01', 'Taller de Cerámica y Barro Negro Sutiaba', 'taller-barro-sutiaba', 'Taller artesanal familiar con demostraciones en vivo de torneado en barro y técnicas ancestrales de Sutiaba.', 'Taller Artesanal', 'Store', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop', NULL, NULL, false, '12 min a pie', 'Barrio Indígena de Sutiaba, León', 50, 12.4285, -86.8890, 4, 'active'),
  ('place-05', 'route-01', 'mun-01', 'Café & Dulcería Tradicional El Solar Leonés', 'dulceria-solar-leones', 'Emprendimiento gastronómico con más de 40 años sirviendo cajetas de leche, bienmesabe y café orgánico.', 'Gastronomía Tradicional', 'Utensils', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop', NULL, NULL, false, '2 min a pie', 'Frente a Iglesia La Merced, León', 40, 12.4338, -86.8775, 5, 'active')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_primary_route_point = EXCLUDED.is_primary_route_point,
  points_reward = EXCLUDED.points_reward;

-- E. Logros de Gamificación
INSERT INTO public.achievements (id, name, slug, description, achievement_type, icon, points_reward, required_count) VALUES
  ('ach-01', 'Primeros Pasos Creativos', 'primeros-pasos', 'Visita y escanea tu primer hito cultural en cualquier ciudad.', 'visita', 'Compass', 50, 1),
  ('ach-02', 'Explorador de Circuitos', 'explorador-circuitos', 'Completa un circuito creativo completo con todos sus hitos.', 'ruta', 'Award', 200, 1),
  ('ach-03', 'Mecenas de la Tradición', 'mecenas-tradicion', 'Visita y apoya 3 locales de emprendedores o talleres secundarios.', 'puntos_secundarios', 'Store', 150, 3),
  ('ach-04', 'Embajador Visual de Nicaragua', 'embajador-visual', 'Comparte 5 fotografías de monumentos o artesanías en la plataforma.', 'foto', 'Camera', 100, 5),
  ('ach-05', 'Crítico Cultural de Honor', 'critico-cultural', 'Escribe 3 reseñas detalladas sobre experiencias en ciudades creativas.', 'resena', 'Star', 75, 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  points_reward = EXCLUDED.points_reward;

-- F. Eventos Culturales
INSERT INTO public.entrepreneur_events (id, department_id, municipality_id, title, description, category, start_date, end_date, location_name, points_reward, status) VALUES
  ('evt-01', 'dept-01', 'mun-01', 'Festival Internacional de las Artes Rubén Darío 2026', 'Magno festival cultural con poetas internacionales, danza folclórica, música en vivo y feria gastronómica.', 'Tradición & Folclore', NOW() + INTERVAL '5 days', NOW() + INTERVAL '8 days', 'Plaza Mayor de la Catedral de León', 150, 'published')
ON CONFLICT (id) DO NOTHING;

-- Notificar a PostgREST para recargar el esquema en vivo
NOTIFY pgrst, 'reload schema';
