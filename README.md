<div align="center">

  <img src="./frontend/public/logos/preview-lockup-dark.png" alt="ROOTS • Red Nacional de Ciudades Creativas" width="340" style="margin-bottom: 12px;" />

  # 🌿 ROOTS
  ### **Plataforma Digital de Turismo Inmersivo, Movilidad Cultural y Pasaporte de Gamificación Territorial**
  #### *Red Nacional de Ciudades Creativas de Nicaragua*

  [![Next.js](https://img.shields.io/badge/Next.js-16.3.3_(Turbopack)-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.24_(2D/3D)-2C3E50?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_PostGIS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_GeoJSON-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.21_(REST_API)-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![PWA](https://img.shields.io/badge/PWA-Installable_(iOS/Android)-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

  <p align="center">
    <a href="#-el-reto-y-contexto-nacional">Contexto Nacional</a> •
    <a href="#-ciudades-creativas-oficiales">Ciudades Creativas</a> •
    <a href="#-características-y-módulos-clave">Módulos del Sistema</a> •
    <a href="#-pasaporte-cultural-y-gamificación">Pasaporte Cultural</a> •
    <a href="#-arquitectura-técnica">Arquitectura</a> •
    <a href="#-instalación-y-ejecución">Instalación</a> •
    <a href="#-endpoints-de-la-api">API REST</a> •
    <a href="#-equipo-de-desarrollo">Equipo</a>
  </p>

</div>

---

## 🎯 El Reto y Contexto Nacional

En Nicaragua, la **Comisión Nacional de Economía Creativa** impulsa la **Red Nacional de Ciudades Creativas**, un modelo territorial que reconoce municipios con extraordinaria herencia cultural, artesanal, literaria, gastronómica y arquitectónica.

A pesar de esta riqueza única, el turismo y la economía naranja enfrentaban barreras críticas:
1. 🗺️ **Desconexión cartográfica y dispersión:** No existía una herramienta digital unificada en 2D/3D que consolidara los circuitos geolocalizados, puntos de interés patrimonial e itinerarios oficiales.
2. 🏷️ **Falta de visibilidad para MiPymes y artesanos:** Maestros ceramistas, talleres de cuero, marimberos y cooperativas de café carecían de vitrinas digitales georreferenciadas con certificación oficial.
3. 🎮 **Ausencia de incentivos para el visitante:** El turista nacional y extranjero realizaba visitas aisladas sin un sistema de incentivos o recompensas por recorrer y validar su paso por los diferentes municipios.
4. 📱 **Experiencias móviles deficientes:** La información histórica y agendas de eventos tradicionales se encontraban en formatos estáticos no optimizados para dispositivos táctiles ni funcionamiento offline.

---

## 💡 La Solución: *ROOTS*

**ROOTS** es un ecosistema digital desacoplado de última generación (**Progressive Web App + API REST Geoespacial**) que conecta a turistas, artesanos, emprendedores y gestores culturales en una experiencia inmersiva, dinámica y gamificada.

```mermaid
graph TD
    subgraph "Clientes Multiplataforma (PWA)"
        A[Turista / Explorador] -->|Navega en 2D/3D & Colecciona Sellos| Web[ROOTS App: Next.js 16 + Tailwind v4]
        B[Emprendedor / Artesano] -->|Gestiona Catálogo & Postulación| Web
        C[Administrador Cultural] -->|Valida Sellos, Eventos y Rutas| Web
    end

    subgraph "Servicios & Lógica de Negocio"
        Web -->|MapLibre GL + Turf.js| Map[Motor Cartográfico 2D/3D Vectorial]
        Web -->|Cliente HTTP Seguro| API[Roots API Server: Express + TypeScript]
        Web -->|Supabase Auth / SSR Client| Auth[Auth JWT & RBAC]
    end

    subgraph "Capa de Datos Híbrida & Alta Disponibilidad"
        API -->|Consultas Espaciales & Relacionales| PG[(Supabase PostgreSQL + PostGIS)]
        API -->|Capas GeoJSON & Infraestructura| Mongo[(MongoDB Atlas)]
        Auth -->|Perfiles, Sellos, Medallas| PG
    end
```

---

## 🏛️ Ciudades Creativas Oficiales Integradas

ROOTS digitaliza de manera integral los **10 municipios** declarados como Ciudades Creativas de Nicaragua, cada uno con su vocación identitaria oficial, iconografía cultural y circuitos georreferenciados:

| Ciudad | Escudo / Logo | Vocación Cultural Oficial | Atractivos & Circuitos Destacados |
| :--- | :---: | :--- | :--- |
| **León** | <img src="./frontend/public/logos/leon.png" width="48" height="48" /> | *Literatura & Poesía* | Ruta Dariana, Real e Insigne Basílica Catedral, Muralismo Histórico |
| **Granada** | <img src="./frontend/public/logos/granada.png" width="48" height="48" /> | *Arquitectura & Diseño* | Arquitectura Colonial, Isletas de Granada, Calle La Calzada |
| **Masaya** | <img src="./frontend/public/logos/masaya.png" width="48" height="48" /> | *Folclore & Artesanía* | Mercado de Artesanías, Cuna del Folclore, Danza de Marimbas, Monimbó |
| **San Juan de Oriente** | <img src="./frontend/public/logos/san-juan-de-oriente.png" width="48" height="48" /> | *Barro Ancestral* | Cerámica Precolombina, Talleres Familiares en Torno, Tradición de Barro |
| **Estelí** | <img src="./frontend/public/logos/esteli.png" width="48" height="48" /> | *Muralismo & Música* | Galería Abierta de Murales, Taller de Guitarras, Reserva Miraflor |
| **Bluefields** | <img src="./frontend/public/logos/bluefields.png" width="48" height="48" /> | *Música & Danza Caribeña* | Tradición del Palo de Mayo (Maypole), Cultura Creole y Miskita, Gastronomía Rondón |
| **Matagalpa** | <img src="./frontend/public/logos/matagalpa.png" width="48" height="48" /> | *Café & Montaña* | Ruta del Café de Altura, Senderos Ecológicos, Chocolate Artesanal |
| **Juigalpa** | <img src="./frontend/public/logos/juigalpa.png" width="48" height="48" /> | *Arqueología & Chontales* | Museo Arqueológico Gregorio Aguilar Barea, Esculturas Amerindias, Ganadería |
| **Managua** | <img src="./frontend/public/logos/managua.png" width="48" height="48" /> | *Epicentro Cultural* | Teatro Nacional Rubén Darío, Puerto Salvador Allende, Centros Culturales |
| **Nagarote** | <img src="./frontend/public/logos/nagarote.png" width="48" height="48" /> | *Municipio Azul & Sabor* | Cuna del Quesillo Tradicional, Paseo de la Paz, Lago Xolotlán |

---

## ✨ Características y Módulos Clave

### 🗺️ 1. Mapa Inmersivo & Cartografía 2D/3D
- **Viewport Maximizado en Desktop y Mobile:** Diseño inmersivo de borde a borde con controles flotantes *glassmorphism*.
- **MapLibre GL con Inclinación de Cámara (3D Pitch):** Navegación espacial fluida entre vistas aéreas ortogonales y perspectivas 3D tridimensionales.
- **Selector de Capas Espaciales:** Alterna en tiempo real entre estilos Satelital, Topográfico, Cultural y Rutas Creativas.
- **Modal de Circuitos Creativos:** Tarjetas interactivas con cálculo de distancias, tiempo estimado, tracks georreferenciados y puntos clave.
- **Micro-Títulos Responsivos:** Banner visual con estilo translúcido adaptativo para dispositivos móviles y cabecera despejada en escritorio.

### 📜 2. Pasaporte de Explorador Cultural (Gamificación)
- **10 Sellos Oficiales de Ciudades:** Cada municipio cuenta con su propio sello virtual (🎭 Masaya, 📜 León, 🏛️ Granada, 🏺 San Juan de Oriente, etc.).
- **Puntos de Experiencia ROOTS:** Sistema de puntaje por visita confirmada y circuito completado (acumulable para canjes y reconocimientos).
- **Medallas y Logros de Explorador:** Sistema de hitos desbloqueables:
  - 🏺 *Maestro Alfarero*: Modelado de barro ancestral en San Juan de Oriente.
  - 📜 *Poeta Dariano*: Recorrido de la Ruta Poética y Catedralicia en León.
  - 🌟 *Embajador de Identidad*: Acumulación de más de 500 puntos de experiencia.
  - 🥁 *Ritmo Caribeño*: Exploración cultural del Palo de Mayo en Bluefields.
  - 🗺️ *Explorador Bicentenario*: 5 circuitos en 3 departamentos diferentes.

### 👤 3. Perfil de Usuario Espacioso y Rediseñado (`/perfil`)
- **Diseño Desktop Panorámico (`1400px`):** Se eliminó la congestión visual expandiendo la interfaz al ancho exacto de la barra superior de navegación.
- **Header con Jerarquía:** Avatar oficial ampliado con anillo de verificación identitario (`lg:w-32 lg:h-32`), insignias de nivel de aventurero y tarjeta destacada de puntos acumulados.
- **6 Pestañas de Gestión Integrales:**
  1. **Pasaporte Cultural:** Tablero de sellos conseguidos y por explorar con puntuación y fechas de expedición.
  2. **Logros & Medallas:** Galería de medallas con barras de progreso en tiempo real y recompensas.
  3. **Eventos Guardados:** Marcadores geolocalizados de ferias y festividades guardadas.
  4. **Mis Circuitos:** Historial de rutas turísticas exploradas y guardadas.
  5. **Emprendimiento:** Panel para solicitar acreditación como negocio/artesano local.
  6. **Ajustes & Tema:** Selector visual interactivo para **Modo Claro**, **Modo Oscuro** y **Sincronización con el Sistema**, junto con selector geográfico por departamento y municipio.

### 🛍️ 4. Directorio y Acreditación de Emprendedores (`/emprendedores`)
- Vitrina comercial categorizada por rubro: *Artesanías en Barro*, *Café & Cacao*, *Cuero & Calzado*, *Gastronomía Tradicional*, *Música & Danza*.
- Ficha comercial con ubicación en mapa, contacto directo, galería de productos y distintivo de *Emprendimiento Verificado*.

### 📅 5. Agenda Cultural Inteligente (`/agenda`)
- Calendario consolidado de ferias del maíz, bailes de negras, topes de santos, festivales de poesía y exposiciones de arte contemporáneo.
- Filtros instantáneos por ciudad, fecha y categoría cultural con opción de guardado directo al perfil del explorador.

### 🎨 6. Identidad Visual & Patrones Precolombinos Procedurales
- **Paleta de Color Identitaria:**
  - 🌲 **Verde Selva Profundo** (`#0F3A2E`): Representa la biodiversidad y reservas naturales de Nicaragua.
  - 🌊 **Turquesa Caribe** (`#00A8A7`): Evoca los mares, lagos y fuentes de agua del país.
  - 🌾 **Ocre & Maíz Dorado** (`#F4A43B`, `#F4D44D`): Símbolo de la raíz precolombina y el grano sagrado.
  - 🍃 **Verde Esperanza** (`#3BA455`): Acento para estados activos y verificaciones.
- **Arte Precolombino SVG:** Generador de patrones geométricos procedurales (mandalas y teselaciones) renderizados en código SVG puro (`PrecolombianPattern.tsx`).
- **Splash Screen Cinematográfica:** Animación de bienvenida que revela el logotipo ROOTS con transiciones elegantes de entrada.

### 🔐 7. Seguridad y Control de Acceso por Roles (RBAC)
- **Supabase Auth + JWT + Bcrypt:** Registro seguro, recuperación y sesiones persistentes con cookies HTTP/SSR.
- **3 Roles de Usuario:**
  - `explorer`: Turista y usuario estándar con pasaporte cultural.
  - `entrepreneur`: MiPyme o artesano local con permisos para gestionar catálogo de productos.
  - `admin`: Administrador territorial con acceso al panel de control `/admin` para gestionar eventos, ciudades y aprobar sellos.

---

## 🏗️ Arquitectura Técnica

El proyecto está configurado como un **Monorepo desacoplado** utilizando *npm workspaces*:

```text
Hackathon/
├── frontend/                          # Next.js 16.3 (Turbopack, App Router)
│   ├── app/                           # Rutas públicas y protegidas
│   │   ├── layout.tsx                 # Root layout, fuentes, ThemeProvider & AuthContext
│   │   ├── page.tsx                   # Página principal: Mapa Inmersivo 2D/3D
│   │   ├── perfil/page.tsx            # Dashboard de Perfil y Pasaporte Cultural
│   │   ├── agenda/page.tsx            # Agenda y Cartelera de Festividades
│   │   ├── circuitos/page.tsx         # Catálogo de Circuitos Creativos
│   │   ├── emprendedores/page.tsx     # Directorio de MiPymes y Artesanos
│   │   ├── ciudades-creativas/        # Páginas dinámicas por municipio (/ciudades-creativas/[slug])
│   │   ├── admin/page.tsx             # Panel de Administración de la Red
│   │   └── login/page.tsx             # Vista de Autenticación y Registro
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                  # AuthModal.tsx (Login/Registro multi-rol)
│   │   │   ├── map/                   # MapaContenedor.tsx, CircuitoSelectorModal.tsx
│   │   │   ├── ui/                    # Navigation.tsx, SplashScreen.tsx, PrecolombianPattern.tsx
│   │   │   └── user/                  # UserProfileDashboard.tsx (Pasaporte, Gamificación, Ajustes)
│   │   ├── context/                   # AuthContext.tsx (Manejo de estado global del usuario)
│   │   ├── data/                      # nicaraguaGeo.ts (Datos cartográficos de 17 departamentos)
│   │   └── lib/                       # supabase.ts (Cliente Supabase SSR/Browser)
│   │
│   └── public/                        # Logotipos oficiales, patrones SVG y Manifest PWA
│
├── backend/                           # Node.js + Express + TypeScript API REST
│   ├── src/
│   │   ├── config/                    # Conexiones a Supabase y MongoDB Atlas
│   │   ├── controllers/               # Controladores de Ubicaciones, Rutas y Auth
│   │   ├── routes/                    # Definición de rutas REST (/api/locations, /api/map-data)
│   │   └── middleware/                # Validadores de Token JWT, CORS y Manejador de Errores
│   │
│   └── scripts/                       # Scripts de migración, seeding y pruebas automáticas
│
├── supabase-master-migration.sql       # Esquema SQL consolidado para Supabase PostgreSQL
└── package.json                       # Scripts unificados del Monorepo
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.3.3 (Turbopack)** | Server Components, App Router, Static Site Generation (SSG) |
| **UI Library** | **React 19.2.4** | Interfaz reactiva y hooks de última generación |
| **Estilos & Diseño** | **Tailwind CSS v4.0** | Sistema de diseño tokenizado, variables CSS dinámicas y Dark Mode |
| **Cartografía Digital** | **MapLibre GL 5.24 + Turf.js** | Renderizado vectorial WebGL 2D/3D con inclinación y capas |
| **Animaciones & Motion** | **GSAP 3.15 + Framer Motion 12 + Lenis** | Transiciones cinemáticas, smooth scroll y microinteracciones |
| **Iconografía** | **Lucide React + React Icons** | Sistema iconográfico unificado y ligero |
| **PWA Engine** | **@ducanh2912/next-pwa** | Service Workers, caché offline, soporte PWA en iOS y Android |
| **Backend Framework** | **Express.js 4.21** | API REST de alto rendimiento sobre Node.js |
| **Lenguaje Base** | **TypeScript 5.7** | Tipado estático de extremo a extremo |
| **Base de Datos Relacional** | **Supabase (PostgreSQL + PostGIS)** | Perfiles, sellos, logros, eventos y consultas geoespaciales |
| **Base de Datos NoSQL** | **MongoDB Atlas** | Almacenamiento flexible de polígonos GeoJSON y rutas turísticas |
| **Seguridad** | **JWT + Bcrypt.js** | Encriptación de contraseñas y tokens firmados de sesión |

---

## 📊 Modelo de Datos (PostgreSQL en Supabase)

El sistema utiliza un esquema relacional normalizado con extensiones geoespaciales:

```mermaid
erDiagram
    PROFILES ||--o{ USER_ACHIEVEMENTS : desbloquea
    PROFILES ||--o{ SAVED_EVENTS : guarda
    PROFILES ||--o{ CITY_STAMPS : colecciona
    PROFILES ||--o| ENTREPRENEURS : administra
    
    PROFILES {
        uuid id PK
        string email
        string name
        string lastname
        string role "explorer | entrepreneur | admin"
        int points "Puntos ROOTS"
        int level "Nivel de Aventurero"
        string city
        string department
        string avatar
    }

    CITY_STAMPS {
        uuid id PK
        uuid user_id FK
        string city_slug
        boolean stamped
        timestamp stamped_at
        int points_reward
    }

    ACHIEVEMENTS {
        string id PK
        string title
        string description
        string icon
        string category
        int points_reward
    }

    USER_ACHIEVEMENTS {
        uuid id PK
        uuid user_id FK
        string achievement_id FK
        int progress
        int total
        boolean unlocked
        timestamp unlocked_at
    }

    SAVED_EVENTS {
        uuid id PK
        uuid user_id FK
        string event_id
        string event_title
        string city
        timestamp created_at
    }

    ENTREPRENEURS {
        uuid id PK
        uuid user_id FK
        string business_name
        string category
        string city
        string status "pending | approved | rejected"
        geometry location
    }
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- **Node.js**: v18.0.0 o superior (Recomendado v20+ LTS)
- **npm** (v9+) o **pnpm**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Hanzaza/Hackathon.git
cd Hackathon
```

### 2. Instalar Dependencias del Monorepo
```bash
# Instala las dependencias de raíz, frontend y backend simultáneamente
npm install
```

### 3. Configurar Variables de Entorno

#### Backend (`backend/.env`):
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Conexión a Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Conexión a MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/roots_db
MONGODB_DB_NAME=roots_db

# Seguridad JWT
JWT_SECRET=tu_secreto_para_firmar_tokens_super_seguro
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-anon-key-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 4. Inicializar la Base de Datos (Supabase)
Ejecuta el script SQL consolidado [`supabase-master-migration.sql`](file:///c:/Users/jonat/OneDrive/Escritorio/Hackathon/supabase-master-migration.sql) en el **SQL Editor** de tu panel de Supabase para crear automáticamente todas las tablas, índices espaciales, funciones y políticas de seguridad (RLS).

### 5. Ejecutar la Aplicación

Puedes ejecutar toda la plataforma con un solo comando desde la raíz:

```bash
# Inicia Frontend (puerto 3000) y Backend (puerto 4000) en simultáneo
npm run dev:all
```

O si deseas correr los servicios individualmente:

```bash
npm run dev:frontend   # Inicia solo Next.js en http://localhost:3000
npm run dev:backend    # Inicia solo la API Express en http://localhost:4000
```

### 6. Compilación de Producción
```bash
# Construye frontend y backend
npm run build

# O solo frontend con Turbopack
npm run build:frontend
```

---

## 🌐 Endpoints de la API REST

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Público | Verificación de salud y estado operativo del servidor |
| `GET` | `/api/locations` | Público | Colección GeoJSON de infraestructura y atractivos turísticos |
| `GET` | `/api/map-data` | Público | Polígonos de Departamentos y Municipios Creativos |
| `POST` | `/api/auth/register` | Público | Registro de nuevos usuarios con asignación de rol |
| `POST` | `/api/auth/login` | Público | Autenticación y expedición de Token JWT |
| `GET` | `/api/circuits` | Público | Listado de Circuitos Creativos georreferenciados |
| `GET` | `/api/events` | Público | Agenda cultural y eventos programados |
| `POST` | `/api/passport/stamp` | Protegido | Registro y validación de sello cultural para el usuario |
| `POST` | `/api/entrepreneurs/apply` | Protegido | Envío de solicitud de acreditación de negocio local |

---

## 📱 Capacidades PWA y Soporte Móvil

ROOTS fue concebido como una **Progressive Web App** nativa:
- 📲 **Instalación Directa:** Añadible a la pantalla de inicio en iOS (Safari -> Compartir -> Añadir a inicio) y Android (Prompt automático de instalación).
- ⚡ **Navegación Táctil Ergonómica:** Barra de navegación fija con respeto a *Safe Area Insets* de dispositivos con notch o isla dinámica.
- 🔄 **Caché Offline:** Los circuitos y sellos visitados recientemente se conservan localmente mediante Service Worker.

---

## ☁️ Arquitectura de Despliegue en Producción (Azure)

La plataforma está desplegada y operando en vivo en **Microsoft Azure (Región Mexico Central)**, cumpliendo con los estándares de rendimiento, resiliencia y seguridad del Hackathon:

### 🌐 Acceso Oficial en Vivo
- **URL Segura (HTTPS):** [https://roots-nicaragua.mexicocentral.cloudapp.azure.com](https://roots-nicaragua.mexicocentral.cloudapp.azure.com)
- **API Healthcheck:** [https://roots-nicaragua.mexicocentral.cloudapp.azure.com/health](https://roots-nicaragua.mexicocentral.cloudapp.azure.com/health)
- **IP Pública Estática:** `158.23.21.55`

```mermaid
graph LR
    User([🌍 Usuario / Navegador]) -->|HTTPS :443 con Certificado SSL| Nginx[Proxy Inverso Nginx]
    User -.->|HTTP :80| Nginx
    Nginx -.->|Redirección 301 Forzada| Nginx
    
    subgraph "Red Interna Aislada (roots_internal_net)"
        Nginx -->|/api/* & /health| Backend[roots_backend :4000]
        Nginx -->|/* (Rutas Web)| Frontend[roots_frontend :3000]
        Backend -->|Persistencia Interna| DB[(roots_db :5432 - Sin puertos públicos)]
        Backend -->|Storage & Auth| Supabase[(Supabase Cloud)]
    end
```

### 📋 Cumplimiento de Entregables del Sprint

| # | Entregable | Implementación Técnica | Estado |
|---|---|---|:---:|
| **1** | **Rendimiento Y Acceso** | Servidor Ubuntu 24.04 LTS en Azure con **4 GB de SWAP** configurada para cero caídas por memoria. Despliegue en contenedores optimizados multi-stage con Next.js standalone y compresión en Nginx. | **✅ Cumplido** |
| **2** | **Seguridad (HTTPS)** | Certificado SSL/TLS oficial emitido por **Let's Encrypt** con renovación automática. Nginx configurado con **HSTS**, cifrado TLSv1.3 y redirección obligatoria de HTTP a HTTPS. | **✅ Cumplido** |
| **3** | **Flujo Automático** | Manejo de errores amigable sin intervención técnica. Pantallas personalizadas e inmersivas para **404 (No encontrado)** y **50X (Error de servidor / timeout)** sin exposición de código ni trazas técnicas. | **✅ Cumplido** |
| **4** | **Integraciones Complejas** | Autenticación robusta con **Tokens JWT**, base de datos relacional PostgreSQL aislada, capas GeoJSON con MongoDB Atlas y sincronización con Supabase Auth/Storage. | **✅ Cumplido** |
| **5** | **Código Vinculado a GitHub** | Sincronización continua de la rama `main` en Azure. Orquestación reproducible mediante `docker-compose.yml`, `azure-setup.sh` y variables de entorno protegidas (`.env` con permisos `chmod 600`). | **✅ Cumplido** |

---

## 👥 Equipo de Desarrollo

<div align="center">
  <table>
    <tr>
      <td align="center" width="300px" style="padding: 24px;">
        <img src="https://github.com/Hanzaza.png" width="130px;" alt="Jonathan Pastora" style="border-radius: 50%; border: 4px solid #00A8A7; box-shadow: 0 10px 30px rgba(0, 168, 167, 0.3);"/><br />
        <br />
        <sub><b style="font-size: 1.15rem;">Jonathan Pastora</b></sub><br />
        <small style="color: #00A8A7; font-weight: 600;">🚀 Full Stack Developer & Lead Architect</small><br />
        <br />
        <a href="https://github.com/Hanzaza"><img src="https://img.shields.io/badge/GitHub-Hanzaza-black?style=for-the-badge&logo=github" /></a>
      </td>
    </tr>
  </table>
</div>

---

## ⚖️ Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

<div align="center">
  <br />
  <img src="./frontend/public/logos/Logo.png" width="48" height="48" alt="Logo" />
  <br />
  <sub><b>ROOTS</b> • Conectando las Raíces Creativas de Nicaragua con el Futuro Digital</sub><br />
  <sub>Desarrollado con pasión para el Hackathon de Ciudades Creativas • 2026</sub>
</div>
