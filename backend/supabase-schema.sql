create extension if not exists postgis;

create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  iso_code text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references countries(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  is_creative_region boolean not null default false,
  geom geometry(Geometry,4326),
  created_at timestamptz not null default now()
);

create table if not exists municipalities (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references departments(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  is_creative boolean not null default false,
  municipality_type text not null default 'tradicional',
  geom geometry(Point,4326),
  department_name text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists creative_routes (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references municipalities(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  status text not null default 'draft',
  cover_image text,
  theme text,
  difficulty text,
  estimated_duration integer,
  points_award integer not null default 0,
  badge_name text,
  is_visible_in_map boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists route_places (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references creative_routes(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  category text,
  geom geometry(Point,4326),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists map_points (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references municipalities(id) on delete set null,
  name text not null,
  point_type text not null,
  category text,
  description text,
  geom geometry(Point,4326),
  status text not null default 'pending_review',
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lastname text not null,
  email text unique not null,
  password_hash text not null,
  avatar text,
  role text not null default 'user',
  status text not null default 'active',
  points integer not null default 0,
  level integer not null default 1,
  bio text,
  country text,
  city text,
  favorite_categories text[],
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists entrepreneur_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  request_type text not null default 'entrepreneur',
  status text not null default 'pending',
  motivation text,
  business_name text,
  business_type text not null default 'fisico',
  address text,
  geom geometry(Point,4326),
  documents text[],
  created_at timestamptz not null default now()
);

create table if not exists entrepreneurs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  municipality_id uuid references municipalities(id) on delete set null,
  business_name text not null,
  business_type text not null default 'fisico',
  description text,
  address text,
  geom geometry(Point,4326),
  status text not null default 'active',
  is_visible_in_map boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists entrepreneur_events (
  id uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid references entrepreneurs(id) on delete cascade,
  municipality_id uuid references municipalities(id) on delete set null,
  title text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  location_name text,
  location_geom geometry(Point,4326),
  status text not null default 'published',
  created_at timestamptz not null default now()
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  achievement_type text not null,
  icon text,
  points_reward integer not null default 0,
  required_count integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  achievement_id uuid references achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  progress integer not null default 100,
  status text not null default 'unlocked'
);

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  route_id uuid references creative_routes(id) on delete set null,
  completed_places uuid[],
  progress_percent integer not null default 0,
  status text not null default 'in_progress',
  last_visited_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  user_id uuid references users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'approved',
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid references users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists idx_departments_country_id on departments(country_id);
create index if not exists idx_municipalities_department_id on municipalities(department_id);
create index if not exists idx_creative_routes_municipality_id on creative_routes(municipality_id);
create index if not exists idx_route_places_route_id on route_places(route_id);
create index if not exists idx_map_points_geom on map_points using gist (geom);
create index if not exists idx_user_progress_user_id on user_progress(user_id);
