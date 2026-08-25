<div align="center">

  <img src="./frontend/public/logos/Logo.png" alt="Roots Logo" width="120" height="120" style="border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />

  # 🌿 ROOTS
  ### **Plataforma Digital de Movilidad y Turismo Cultural para la Red Nacional de Ciudades Creativas de Nicaragua**

  [![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-5.24-2C3E50?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

  <p align="center">
    <a href="#el-reto">El Reto</a> •
    <a href="#nuestra-solución">Nuestra Solución</a> •
    <a href="#características-principales">Características</a> •
    <a href="#arquitectura-y-tecnologías">Arquitectura</a> •
    <a href="#equipo-de-desarrollo">Equipo</a> •
    <a href="#guía-de-instalación">Instalación</a> •
    <a href="#despliegue">Despliegue</a>
  </p>

</div>

---

## 🎯 El Reto

En Nicaragua, la **Red Nacional de Ciudades Creativas** (León, Managua, Granada, Masaya, Estelí, San Juan de Oriente, Matagalpa, Juigalpa, Bluefields, Nagarote) alberga un invaluable patrimonio cultural, gastronómico, artesanal y arquitectónico.

Sin embargo, existe una **marcada desconexión tecnológica** entre esta rica oferta y los canales digitales del turismo moderno:
- 🗺️ **Falta de herramientas espaciales interactivas:** Los visitantes no disponen de mapas dinámicos en 2D/3D con circuitos geolocalizados, puntos de interés cultural e información verificada.
- 🛍️ **Visibilidad limitada para MiPymes y artesanos:** Los creadores locales carecen de canales digitales accesibles para exponer sus productos y articularse proactivamente con ferias y eventos.
- 📅 **Dispersión de agendas culturales:** La información de eventos y festividades tradicionales se encuentra fragmentada y sin sincronización en tiempo real.

---

## 💡 Nuestra Solución: *Roots*

**Roots** es un ecosistema digital desacoplado (PWA + API REST) que transforma la manera en que locales y turistas exploran las Ciudades Creativas de Nicaragua, articulando la identidad territorial con la economía naranja.

```mermaid
graph TD
    A[Turistas & Visitantes] -->|Exploran en PWA| B[Roots Frontend: Next.js 16]
    C[Emprendedores & MiPymes] -->|Exponen su catálogo| B
    B -->|API Client HTTP| D[Roots Backend: Express + TS]
    D -->|Consultas Espaciales| E[(Supabase / PostgreSQL PostGIS)]
    D -->|GeoJSON & Catálogo| F[(MongoDB Atlas)]
    B -->|MapLibre GL & 3D Pitch| G[Mapas Interactivos]
```

---

## ✨ Características Principales

<table>
  <tr>
    <td width="50%">
      <h3>🗺️ 1. Mapa Inmersivo & Circuitos SVG</h3>
      <ul>
        <li>Navegación espacial por departamento con micro-mapas SVG vectoriales interactivos.</li>
        <li>Vistas en 2D/3D con MapLibre GL, inclinación de cámara, selector de estilos y control de capas.</li>
        <li>Carrusel deslizante con snap táctil para los Circuitos Creativos (Dariano, Sutiabeño, etc.).</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📅 2. Agenda Cultural Inteligente</h3>
      <ul>
        <li>Búsqueda instantánea y filtros dinámicos por ciudad y categoría (Música, Tradición, Arte).</li>
        <li>Fichas detalladas de eventos con fecha, hora, ubicación y tags visuales.</li>
        <li>Sincronización para planificación de itinerarios turísticos en tiempo real.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🛍️ 3. Ecosistema de Emprendedores</h3>
      <ul>
        <li>Directorio geolocalizado de artesanos, gastronomía típica y emprendimientos creativos.</li>
        <li>Carruseles de galerías con imágenes optimizadas y descarga directa de la Guía del Emprendedor.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📱 4. Experiencia PWA Multiplataforma</h3>
      <ul>
        <li>Instalable en dispositivos móviles (iOS y Android) y escritorio.</li>
        <li>Navegación táctil ergonómica con barra de navegación nativa y safe areas.</li>
        <li>Animaciones cinemáticas suaves con GSAP ScrollTrigger y Lenis Smooth Scroll.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ Arquitectura y Tecnologías

El proyecto sigue las mejores prácticas de la industria, estructurado como un **Monorepo desacoplado** con separación estricta entre Frontend y Backend:

```text
Hackathon/
├── frontend/                  # Next.js 16 (App Router) + Tailwind CSS v4
│   ├── app/                   # Enrutamiento y vistas (Home, Mapa, Circuitos, Agenda)
│   ├── src/
│   │   ├── components/        # Componentes UI reutilizables y mapas SVG
│   │   └── services/          # Cliente HTTP centralizado (apiClient.ts)
│   └── public/                # Assets gráficos, logos y datos GeoJSON
│
├── backend/                   # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── controllers/       # LocationsController, MapDataController, HealthController
│   │   ├── routes/            # Endpoints REST (/api/locations, /api/map-data, /health)
│   │   ├── services/          # Conectores Supabase (PostGIS) y MongoDB Atlas
│   │   └── middleware/        # Manejador global de errores y CORS
│   └── prisma/                # Esquemas y scripts de migración/seed
│
└── package.json               # Monorepo con npm workspaces y scripts unificados
```

### 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, MapLibre GL, GSAP, Framer Motion, Lenis Scroll, Lucide Icons, Next-PWA |
| **Backend** | Node.js, Express.js, TypeScript, TSX, CORS, Dotenv |
| **Bases de Datos** | Supabase (PostgreSQL + PostGIS), MongoDB Atlas, Prisma ORM |
| **Tooling & Calidad** | ESLint 9, JSCPD (detección de duplicación), Node Metrics Engine |

---

## 👥 Equipo de Desarrollo

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://github.com/identicons/user1.png" width="100px;" alt="Jonathan González" style="border-radius:50%;"/><br />
        <sub><b>Jonathan González</b></sub><br />
        <small>🚀 Full Stack & Architecture Lead</small><br />
        <a href="https://github.com/Hanzaza"><img src="https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github" /></a>
      </td>
      <td align="center" width="25%">
        <img src="https://github.com/identicons/user2.png" width="100px;" alt="Team Member 2" style="border-radius:50%;"/><br />
        <sub><b>Frontend Developer</b></sub><br />
        <small>🎨 UI/UX & Interactive Design</small><br />
        <a href="#"><img src="https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github" /></a>
      </td>
      <td align="center" width="25%">
        <img src="https://github.com/identicons/user3.png" width="100px;" alt="Team Member 3" style="border-radius:50%;"/><br />
        <sub><b>Backend Developer</b></sub><br />
        <small>⚙️ Cloud & API Services</small><br />
        <a href="#"><img src="https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github" /></a>
      </td>
      <td align="center" width="25%">
        <img src="https://github.com/identicons/user4.png" width="100px;" alt="Team Member 4" style="border-radius:50%;"/><br />
        <sub><b>GIS & Data Specialist</b></sub><br />
        <small>📍 Spatial Data & Cartography</small><br />
        <a href="#"><img src="https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github" /></a>
      </td>
    </tr>
  </table>
</div>

> 💡 *Nota: Puedes personalizar las fotos, nombres, roles y enlaces a perfiles de GitHub/LinkedIn del equipo editando esta sección en el README.*

---

## 🚀 Guía de Instalación y Ejecución

### Prerrequisitos
- **Node.js**: v18.0.0 o superior (Recomendado Node 20 LTS o 22)
- **npm** (v9+) o **pnpm** / **yarn**

### 1. Clonar el repositorio
```bash
git clone https://github.com/Hanzaza/Hackathon.git
cd Hackathon
```

### 2. Configurar Variables de Entorno

**En el Backend (`backend/.env`):**
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-supabase-anon-key

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/stateless_db
MONGODB_DB_NAME=stateless_db
```

**En el Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-supabase-anon-key
```

### 3. Instalar Dependencias y Ejecutar

Desde la **raíz del proyecto**, puedes ejecutar todo con un solo comando:

```bash
# Iniciar Frontend (puerto 3000) y Backend (puerto 4000) en paralelo
npm run dev:all

# O iniciar individualmente:
npm run dev:frontend    # Solo Interfaz Web en http://localhost:3000
npm run dev:backend     # Solo API Server en http://localhost:4000
```

---

## 🌐 Endpoints Principales de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Healthcheck y estado de disponibilidad del servidor |
| `GET` | `/api/locations` | GeoJSON de infraestructura y puntos georreferenciados (MongoDB) |
| `GET` | `/api/map-data` | GeoJSON de Departamentos y Municipios Creativos (Supabase) |

---

## 🚢 Despliegue en Producción

Gracias a la arquitectura desacoplada, cada parte puede desplegarse de manera independiente:

- **Frontend:** Desplegable en [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/) o [Cloudflare Pages] vinculando la carpeta `frontend/`.
- **Backend:** Desplegable en [Render](https://render.com/), [Railway](https://railway.app/), [Fly.io](https://fly.io/) o contenedores Docker vinculando la carpeta `backend/`.

---

<div align="center">
  <sub>Desarrollado con ❤️ para el Hackathon de Ciudades Creativas de Nicaragua • 2026</sub>
</div>
