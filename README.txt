================================================================================
                                    ROOTS
   Plataforma Digital de Turismo Inmersivo, Movilidad Cultural y Gamificación
              Red Nacional de Ciudades Creativas de Nicaragua
================================================================================

Desarrollado por: Jonathan Pastora (Full Stack Developer & Lead Architect)
Repositorio: https://github.com/Hanzaza/Hackathon
Versión: 1.0.0
Licencia: MIT


================================================================================
1. CONTEXTO NACIONAL Y EL RETO DE LAS CIUDADES CREATIVAS
================================================================================

En Nicaragua, la Comisión Nacional de Economía Creativa impulsa la Red Nacional
de Ciudades Creativas, un modelo territorial que reconoce municipios con un
extraordinario patrimonio cultural, artesanal, literario, gastronómico y
arquitectónico.

A pesar de esta riqueza única, existía una marcada desconexión tecnológica:
- Desconexión espacial: No existían herramientas cartográficas interactivas en
  2D/3D con circuitos geolocalizados, puntos de interés patrimonial e
  itinerarios oficiales.
- Falta de visibilidad para MiPymes y artesanos: Ceramistas ancestrales,
  talleres de cuero, marimberos y cooperativas carecían de vitrinas digitales
  georreferenciadas con certificación oficial.
- Ausencia de incentivos para el visitante: El turista realizaba visitas
  aisladas sin recompensas ni registro de su trayectoria cultural por el país.
- Formatos estáticos: Agendas culturales y datos históricos no estaban
  optimizados para dispositivos móviles ni funcionamiento offline.


================================================================================
2. LA SOLUCIÓN: ROOTS
================================================================================

ROOTS es un ecosistema digital desacoplado de última generación que une una
Progressive Web App (PWA) de alto impacto visual con una API REST geoespacial
para transformar la exploración de las Ciudades Creativas de Nicaragua.

Pilares de la solución:
- Cartografía inmersiva en 2D y 3D con vistas tridimensionales.
- Pasaporte cultural gamificado con sellos virtuales oficiales y medallas.
- Perfil de usuario espacioso y configurable con modo claro, oscuro y sistema.
- Directorio y proceso de acreditación de emprendedores locales.
- Agenda cultural sincronizada en tiempo real.
- Identidad gráfica con patrones precolombinos procedurales.


================================================================================
3. RED NACIONAL DE CIUDADES CREATIVAS OFICIALES (10 MUNICIPIOS)
================================================================================

1. LEÓN
   - Vocación: Literatura & Poesía
   - Atractivos: Ruta Dariana, Real e Insigne Basílica Catedral, Muralismo

2. GRANADA
   - Vocación: Arquitectura & Diseño
   - Atractivos: Casco Colonial, Isletas de Granada, Calle La Calzada

3. MASAYA
   - Vocación: Folclore & Artesanía
   - Atractivos: Mercado de Artesanías, Danza de Marimbas, Monimbó

4. SAN JUAN DE ORIENTE
   - Vocación: Barro Ancestral
   - Atractivos: Cerámica Precolombina, Talleres de Torno en Vivo

5. ESTELÍ
   - Vocación: Muralismo & Música
   - Atractivos: Galería Abierta de Murales, Taller de Guitarras, Miraflor

6. BLUEFIELDS
   - Vocación: Música & Danza Caribeña
   - Atractivos: Palo de Mayo (Maypole), Cultura Creole y Miskita, Gastronomía

7. MATAGALPA
   - Vocación: Café & Montaña
   - Atractivos: Ruta del Café de Altura, Senderos Ecológicos, Chocolate

8. JUIGALPA
   - Vocación: Arqueología & Chontales
   - Atractivos: Museo Arqueológico Gregorio Aguilar Barea, Esculturas Amerindias

9. MANAGUA
   - Vocación: Epicentro Cultural
   - Atractivos: Teatro Nacional Rubén Darío, Puerto Salvador Allende

10. NAGAROTE
    - Vocación: Municipio Azul & Sabor
    - Atractivos: Cuna del Quesillo Tradicional, Paseo de la Paz


================================================================================
4. CARACTERÍSTICAS Y MÓDULOS PRINCIPALES
================================================================================

A. MAPA INMERSIVO 2D/3D (MAPLIBRE GL & TURF.JS)
   - Vista maximizada de borde a borde en desktop y dispositivos táctiles.
   - Controles de inclinación de cámara (3D Pitch), rotación y zoom vectorial.
   - Capas espaciales dinámicas: Satelital, Topográfica, Cultural y Rutas.
   - Selector modal interactivo de Circuitos Creativos temáticos.
   - Microtítulo responsivo con efecto translúcido para navegación despejada.

B. PASAPORTE DE EXPLORADOR CULTURAL (GAMIFICACIÓN)
   - Colección interactiva de los 10 sellos de ciudades creativas oficiales.
   - Puntos de Experiencia ROOTS por visitas y circuitos completados.
   - Medallas desbloqueables con barras de progreso:
     * Maestro Alfarero (San Juan de Oriente)
     * Poeta Dariano (León)
     * Embajador de Identidad (500+ puntos de experiencia)
     * Ritmo Caribeño (Bluefields)
     * Explorador Bicentenario (5 circuitos en 3 departamentos)

C. PERFIL DE USUARIO ESPACIOSO (/perfil)
   - Layout desktop panorámico de 1400px en armonía con la barra superior.
   - Avatar ampliado con anillo de verificación y nivel de aventurero.
   - 6 Pestañas de navegación integradas:
     1. Pasaporte Cultural (sellos y progreso de expedición).
     2. Logros & Medallas (progreso en tiempo real y recompensas).
     3. Eventos Guardados (marcadores culturales geolocalizados).
     4. Mis Circuitos (historial de rutas culturales recorridas).
     5. Emprendimiento (panel de solicitud de acreditación comercial).
     6. Ajustes & Tema (Modo Claro, Modo Oscuro y Sincronización con Sistema,
        más configuración de residencia por departamentos y municipios).

D. DIRECTORIO Y ACREDITACIÓN DE EMPRENDEDORES (/emprendedores)
   - Catálogo clasificado: Cerámica, Textil, Café/Cacao, Cuero, Gastronomía.
   - Fichas con geolocalización, galería de fotos y sello de verificación.

E. AGENDA CULTURAL INTELIGENTE (/agenda)
   - Cartelera de ferias patronales, eventos y festivales de poesía.
   - Búsqueda instantánea por ciudad y guardado directo al perfil.

F. IDENTIDAD VISUAL & PATRONES PRECOLOMBINOS
   - Paleta de colores oficial:
     * Verde Selva Profundo: #0F3A2E
     * Turquesa Caribe:     #00A8A7
     * Ocre & Maíz Dorado:  #F4A43B / #F4D44D
     * Verde Esperanza:     #3BA455
     * Noche Volcánica:     #0A1217
     * Arena Suave:         #F5EFE6
   - Generador procedural de patrones en SVG (mandalas y teselaciones).
   - Pantalla de bienvenida (Splash Screen) cinemática.

G. SEGURIDAD Y CONTROL DE ACCESO POR ROLES (RBAC)
   - Roles soportados:
     * explorer: Turista o visitante cultural.
     * entrepreneur: Dueño de negocio o artesano acreditado.
     * admin: Administrador territorial con acceso al panel /admin.
   - Autenticación con Supabase Auth, tokens JWT y contraseñas con bcrypt.


================================================================================
5. STACK TECNOLÓGICO
================================================================================

FRONTEND:
- Next.js 16.3.3 con compilador Turbopack y App Router
- React 19.2.4
- Tailwind CSS v4.0 (Sistema de diseño tokenizado y Dark Mode)
- MapLibre GL 5.24 + @turf/turf (Cartografía 2D/3D acelerada por WebGL)
- GSAP 3.15 + Framer Motion 12 + Lenis Smooth Scroll
- Lucide React + React Icons
- @ducanh2912/next-pwa (Progressive Web App, Service Worker y caché offline)

BACKEND:
- Node.js + Express.js 4.21
- TypeScript 5.7
- JSON Web Tokens (JWT) + Bcrypt.js
- CORS + Dotenv

BASES DE DATOS & NUBE:
- Supabase (PostgreSQL 15+ con extensión espacial PostGIS)
- MongoDB Atlas (Almacenamiento NoSQL de colecciones GeoJSON)


================================================================================
6. ESTRUCTURA DEL MONOREPO
================================================================================

Hackathon/
├── frontend/                     # Aplicación Next.js 16 (PWA)
│   ├── app/                      # Rutas de App Router (/, /perfil, /agenda, etc.)
│   ├── src/
│   │   ├── components/           # Componentes UI, Mapas, Auth y Perfil
│   │   ├── context/              # AuthContext (Estado global del usuario)
│   │   ├── data/                 # Datos cartográficos de los 17 departamentos
│   │   └── lib/                  # Clientes de Supabase y servicios HTTP
│   └── public/                   # Logos oficiales, patrones SVG y PWA manifest
│
├── backend/                      # Servidor API Express + TypeScript
│   ├── src/
│   │   ├── config/               # Conectores a Supabase y MongoDB Atlas
│   │   ├── controllers/          # Controladores de ubicaciones, rutas y auth
│   │   └── routes/               # Endpoints REST (/api/locations, /api/map-data)
│   └── scripts/                  # Scripts de seeding y migraciones
│
├── supabase-master-migration.sql # Esquema SQL consolidado para PostgreSQL
├── README.md                     # Documentación principal en formato Markdown
├── README.txt                    # Este archivo en texto plano
└── package.json                  # Scripts unificados de orquestación


================================================================================
7. GUÍA DE INSTALACIÓN Y EJECUCIÓN
================================================================================

PRERREQUISITOS:
- Node.js v18.0.0 o superior (Recomendado v20+ LTS)
- npm v9+

PASO 1: Clonar el repositorio
   git clone https://github.com/Hanzaza/Hackathon.git
   cd Hackathon

PASO 2: Instalar todas las dependencias
   npm install

PASO 3: Configurar Variables de Entorno

   Crear backend/.env:
   --------------------------------------------------------
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/roots_db
   MONGODB_DB_NAME=roots_db
   JWT_SECRET=tu_clave_secreta_jwt
   --------------------------------------------------------

   Crear frontend/.env.local:
   --------------------------------------------------------
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-anon-key-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   --------------------------------------------------------

PASO 4: Base de Datos
   Ejecutar el archivo 'supabase-master-migration.sql' en el SQL Editor del
   panel de control de Supabase para generar tablas, índices y políticas RLS.

PASO 5: Ejecución en Desarrollo
   Desde la raíz del proyecto:
   
   npm run dev:all         # Inicia Frontend (3000) y Backend (4000) simultáneamente
   
   O de forma individual:
   npm run dev:frontend    # Solo la interfaz web en http://localhost:3000
   npm run dev:backend     # Solo la API REST en http://localhost:4000

PASO 6: Compilación de Producción
   npm run build           # Compila ambos proyectos
   npm run build:frontend  # Compila únicamente el frontend con Turbopack


================================================================================
8. ENDPOINTS DE LA API REST
================================================================================

MÉTODO   ENDPOINT                 ACCESO     DESCRIPCIÓN
--------------------------------------------------------------------------------
GET      /health                  Público    Estado y disponibilidad del servidor
GET      /api/locations           Público    Colección GeoJSON de atractivos
GET      /api/map-data            Público    Polígonos de Departamentos y Municipios
POST     /api/auth/register       Público    Registro de usuario con rol
POST     /api/auth/login          Público    Autenticación y generación de JWT
GET      /api/circuits            Público    Listado de Circuitos Creativos
GET      /api/events              Público    Agenda de festividades y ferias
POST     /api/passport/stamp      Protegido  Validación de sello de ciudad
POST     /api/entrepreneurs/apply Protegido  Solicitud de acreditación comercial


================================================================================
9. EQUIPO DE DESARROLLO
================================================================================

Jonathan Pastora
- Rol: Full Stack Developer & Lead Architect
- GitHub: https://github.com/Hanzaza


================================================================================
10. LICENCIA
================================================================================

Este proyecto está bajo la Licencia MIT.
Desarrollado para el Hackathon de Ciudades Creativas de Nicaragua (2026).
ROOTS • Conectando las Raíces Creativas de Nicaragua con el Futuro Digital.
================================================================================
