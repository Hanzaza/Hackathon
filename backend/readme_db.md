# Propuesta de base de datos para Stateless Mobility en PostgreSQL

## 1. Objetivo

Diseñar una base de datos robusta, relacional y escalable para soportar el mapa interactivo de Nicaragua, las rutas creativas, los usuarios, los reconocimientos, los emprendedores y la lógica de gamificación del proyecto.

La base debe permitir:

- gestionar el territorio nacional de Nicaragua
- organizar departamentos, municipios y localidades
- crear rutas creativas o denominaciones
- almacenar lugares en el mapa con fotos, videos, reseñas y multimedia
- permitir que los usuarios participen, acumulen puntos y obtengan recompensas
- habilitar solicitudes de emprendedores y aprobaciones por parte del administrador
- diferenciar entre lugares pertenecientes a una ruta creativa y otros puntos libres del mapa

---

## 2. Enfoque tecnológico

Dado que el proyecto migrará a PostgreSQL, esta propuesta está pensada para una arquitectura relacional con PostgreSQL + PostGIS, implementada sobre Supabase.

Se recomienda usar:

- Supabase como backend y capa de base de datos PostgreSQL
- PostGIS para datos geográficos y búsquedas por ubicación
- JSONB para contenido semi-estructurado cuando sea necesario
- un sistema de roles claro: usuario, emprendedor, administrador
- UUID como identificadores principales para mayor escalabilidad y seguridad

---

## 3. Modelo general de negocio

El sistema se organiza en estas entidades principales:

1. País
2. Departamento
3. Municipio
4. Ruta creativa o denominación
5. Lugar dentro de una ruta
6. Punto libre del mapa
7. Usuario
8. Solicitud de emprendedor
9. Emprendimiento
10. Evento de emprendedor
11. Recompensa o logro
12. Progreso del usuario
13. Reseñas y reportes

---

## 4. Tablas recomendadas

### 4.1 countries

Representa el país.

```sql
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  iso_code CHAR(2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.2 departments

Representa los departamentos de Nicaragua.

```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_creative_region BOOLEAN NOT NULL DEFAULT false,
  geom GEOGRAPHY(Polygon, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Campos importantes:

- `is_creative_region`: indica si el departamento forma parte de la red de ciudades creativas
- `geom`: permite trabajar con geometrías geográficas en PostGIS

---

### 4.3 municipalities

Representa los municipios.

```sql
CREATE TABLE municipalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  is_creative BOOLEAN NOT NULL DEFAULT false,
  municipality_type VARCHAR(30) NOT NULL DEFAULT 'tradicional',
  geom GEOGRAPHY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Campos importantes:

- `is_creative`: si el municipio pertenece a una categoría creativa
- `municipality_type`: valores como `creativa`, `tradicional`, `mixta`, `en_desarrollo`

---

### 4.4 creative_routes

Aquí se almacenan las denominaciones o rutas creativas.

```sql
CREATE TABLE creative_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  cover_image TEXT,
  theme VARCHAR(100),
  difficulty VARCHAR(30),
  estimated_duration INTEGER,
  points_award INTEGER NOT NULL DEFAULT 0,
  badge_name VARCHAR(100),
  is_visible_in_map BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Campos importantes:

- `municipality_id`: el municipio asociado a la ruta
- `points_award`: puntos que otorga al completarse
- `badge_name`: nombre del reconocimiento que se desbloquea

---

### 4.5 route_places

Son los lugares que conforman una ruta creativa.

```sql
CREATE TABLE route_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES creative_routes(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  geom GEOGRAPHY(Point, 4326),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Regla de negocio:

- Cuando un usuario seleccione una ruta creativa, el mapa debe mostrar únicamente los puntos asociados a esa ruta.
- Los demás locales o puntos del mapa no deben mostrarse dentro de esa vista.

---

### 4.6 map_points

Representa puntos libres del mapa que no pertenecen a una ruta creativa, pero sí son relevantes para el proyecto.

```sql
CREATE TABLE map_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_id UUID REFERENCES municipalities(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  point_type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  geom GEOGRAPHY(Point, 4326),
  status VARCHAR(30) NOT NULL DEFAULT 'pending_review',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Esto permite mostrar:

- emprendimientos
- negocios locales
- sitios culturales
- puntos de interés generales del mapa

---

### 4.7 users

Representa a los usuarios de la plataforma.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role VARCHAR(30) NOT NULL DEFAULT 'user',
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  bio TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  favorite_categories TEXT[],
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Roles sugeridos:

- `user`: visitante
- `entrepreneur`: emprendedor con permisos especiales
- `admin`: administrador del sistema

---

### 4.8 entrepreneur_requests

Permite registrar la solicitud para convertirse en emprendedor.

```sql
CREATE TABLE entrepreneur_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_type VARCHAR(30) NOT NULL DEFAULT 'entrepreneur',
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  motivation TEXT,
  business_name VARCHAR(200),
  business_type VARCHAR(30) NOT NULL DEFAULT 'fisico',
  address TEXT,
  geom GEOGRAPHY(Point, 4326),
  documents TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Estados recomendados:

- `pending`
- `approved`
- `rejected`
- `suspended`

---

### 4.9 entrepreneurs

Representa el perfil del emprendedor ya aprobado.

```sql
CREATE TABLE entrepreneurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  municipality_id UUID REFERENCES municipalities(id) ON DELETE SET NULL,
  business_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(30) NOT NULL DEFAULT 'fisico',
  description TEXT,
  address TEXT,
  geom GEOGRAPHY(Point, 4326),
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  is_visible_in_map BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Funcionalidades:

- el usuario aprobado puede crear su propio espacio
- puede publicar su emprendimiento en el mapa
- puede gestionar eventos asociados

---

### 4.10 entrepreneur_events

Eventos promovidos por emprendedores.

```sql
CREATE TABLE entrepreneur_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrepreneur_id UUID NOT NULL REFERENCES entrepreneurs(id) ON DELETE CASCADE,
  municipality_id UUID REFERENCES municipalities(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location_name VARCHAR(200),
  location_geom GEOGRAPHY(Point, 4326),
  status VARCHAR(30) NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.11 achievements

Recompensas o reconocimientos del sistema.

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  achievement_type VARCHAR(50) NOT NULL,
  icon TEXT,
  points_reward INTEGER NOT NULL DEFAULT 0,
  required_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Tipos sugeridos:

- `route_completion`
- `route_streak`
- `map_visit`
- `entrepreneur_support`
- `event_attendance`
- `special_discovery`

---

### 4.12 user_achievements

Registro de logros obtenidos por los usuarios.

```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INTEGER NOT NULL DEFAULT 100,
  status VARCHAR(30) NOT NULL DEFAULT 'unlocked'
);
```

---

### 4.13 user_progress

Permite llevar el seguimiento de actividades del usuario.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES creative_routes(id) ON DELETE SET NULL,
  completed_places UUID[],
  progress_percent INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'in_progress',
  last_visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Esto sirve para:

- medir avance por ruta
- desbloquear recompensas
- guardar historial de recorridos

---

### 4.14 reviews

Reseñas de lugares, rutas, emprendimientos o eventos.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.15 reports

Para reportes de contenido inapropiado o solicitudes de moderación.

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  reason VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 5. Relaciones clave

### 5.1 Jerarquía territorial

- Un país tiene muchos departamentos
- Un departamento tiene muchos municipios
- Un municipio puede tener muchas rutas creativas
- Una ruta creativa contiene muchos lugares

### 5.2 Usuarios y gamificación

- Un usuario puede completar muchas rutas
- Un usuario puede obtener muchos logros
- Un usuario puede escribir reseñas
- Un usuario puede solicitar ser emprendedor

### 5.3 Emprendedores y mapa

- Un emprendedor pertenece a un usuario aprobado
- Un emprendedor pertenece a un municipio
- Puede crear muchos eventos
- Puede publicar un emprendimiento visible en el mapa

### 5.4 Diferencia entre rutas y puntos libres

- En una ruta creativa solo se muestran los lugares asignados a esa ruta
- Los demás puntos del mapa no aparecen dentro de esa vista
- Los puntos libres sirven para mostrar locales, comercios, culturales o emprendimientos generales del territorio

---

## 6. Reglas de negocio recomendadas

1. Cada municipio puede tener varias rutas creativas.
2. Cada ruta creativa debe pertenecer a un solo municipio.
3. Un lugar puede pertenecer a una ruta creativa o aparecer como un punto libre del mapa.
4. Un usuario puede ganar puntos al completar rutas, visitar lugares o participar en eventos.
5. El sistema puede dar recompensas por alcanzar ciertos umbrales.
6. Un emprendedor necesita aprobación administrativa antes de poder publicar su emprendimiento.
7. Los puntos de una ruta creativa no deben mezclarse con los puntos del mapa general mientras se navega esa ruta.
8. Cada municipio tiene un tipo de identidad: creativa o no creativa.
9. El administrador debe poder revisar, aprobar o rechazar solicitudes, publicaciones y contenido.

---

## 7. Lógica de gamificación

Se recomienda implementar una lógica similar a Steam o sistemas de logros, con niveles y recompensas.

### Ejemplo

- Completar 1 ruta = 100 puntos
- Completar 3 rutas = desbloquea insignia de explorador
- Completar 5 rutas = desbloquea avatar especial
- Visitar 10 lugares = desbloquea badge de viajero
- Participar en eventos de emprendedores = obtiene puntos extra

### Recomendación

Crear un motor de logros basado en reglas:

- si `completed_routes >= 3`, desbloquear insignia
- si `points >= 1000`, desbloquear icono especial de perfil
- si `event_attendance >= 5`, desbloquear recompensa especial

---

## 8. Campos adicionales que conviene agregar

Para enriquecer el sistema, se sugiere añadir:

- `featured`: destacar rutas o lugares
- `verified`: validar contenido oficial
- `language`: soporte multilenguaje
- `tags`: categorías temáticas
- `seasonality`: si el lugar es temporal o estacional
- `opening_hours`: horarios de negocios o eventos
- `contact_info`: teléfono, redes, sitio web
- `social_proof`: cantidad de visitas o reseñas
- `moderation_status`: aprobado, pendiente, rechazado

---

## 9. Índices recomendados en PostgreSQL

Para que el sistema sea rápido, conviene crear índices en:

- `department_id`
- `municipality_id`
- `route_id`
- `user_id`
- `status`
- `is_creative`
- `geom`

Ejemplo:

```sql
CREATE INDEX idx_departments_country_id ON departments(country_id);
CREATE INDEX idx_municipalities_department_id ON municipalities(department_id);
CREATE INDEX idx_creative_routes_municipality_id ON creative_routes(municipality_id);
CREATE INDEX idx_route_places_route_id ON route_places(route_id);
CREATE INDEX idx_map_points_geom ON map_points USING GIST (geom);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

---

## 10. Propuesta de flujo de uso

### Flujo de usuario

1. El usuario entra al mapa
2. Puede ver municipios, rutas creativas y puntos generales
3. Selecciona una ruta
4. El mapa muestra solo los sitios de esa ruta
5. Completa puntos y gana progreso
6. Obtiene logros y recompensas

### Flujo de emprendedor

1. El usuario envía solicitud para ser emprendedor
2. El administrador la aprueba
3. El emprendedor crea su espacio
4. Publica emprendimiento en el mapa
5. Crea eventos y recibe seguimiento de usuarios

---

## 11. Sugerencias extra para este proyecto

Además de lo anterior, conviene incluir estas capas para que la plataforma sea más completa:

- historial de visitas del usuario
- favoritos y listas personalizadas
- rutas recomendadas por ubicación
- sistema de badges visuales
- sistema de notificaciones
- panel de administración para moderar contenidos
- buscador por nombre, categoría, municipio o ruta
- filtros por tipo de lugar, categoría y estado
- soporte para imágenes y videos enriquecidos
- administración de eventos culturales y empresariales
- seguimiento de actividad para analytics

---

## 12. Recomendación final

La estructura más sólida para este proyecto sería una combinación de:

- una jerarquía territorial clara: país → departamento → municipio
- una capa de rutas creativas para experiencias guiadas
- una capa de puntos de mapa para negocios, cultura y contenido libre
- una capa de usuarios con sistema de logros y recompensas
- una capa de emprendedores para publicar negocios y eventos

Esta estructura permite que el proyecto evolucione desde una plataforma de turismo visual hasta una red social de experiencias culturales y emprendimiento territorial.

---

## 13. Resumen ejecutivo

Si se implementa esta base de datos en PostgreSQL, el proyecto podrá:

- mostrar el mapa de Nicaragua de forma organizada
- integrar rutas creativas con contenido multimedia
- diferenciar entre rutas cerradas y puntos libres del mapa
- incentivar la participación con recompensas y logros
- habilitar el ecosistema de emprendedores con aprobación administrativa
- crecer de manera modular sin romper la arquitectura actual
