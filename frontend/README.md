# 🌿 ROOTS • Frontend Progressive Web App (PWA)

Aplicación web progresiva multiplataforma desarrollada con **Next.js 16 (Turbopack, App Router)**, **React 19** y **Tailwind CSS v4** para la **Red Nacional de Ciudades Creativas de Nicaragua**.

---

## 🚀 Tecnologías Principales

- **Framework Web**: [Next.js 16.3.3](https://nextjs.org/) con compilador de alto rendimiento **Turbopack**.
- **Biblioteca UI**: [React 19.2.4](https://react.dev/).
- **Estilos & Diseño**: [Tailwind CSS v4.0](https://tailwindcss.com/) con tokens de diseño adaptativos (Modo Claro / Modo Oscuro).
- **Motor Cartográfico**: [MapLibre GL 5.24](https://maplibre.org/) para renderizado 2D/3D con aceleración WebGL y cálculo espacial con [@turf/turf](https://turfjs.org/).
- **PWA**: [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa) con soporte de Service Worker, instalación en iOS y Android, y modo offline.
- **Autenticación & Base de Datos**: [@supabase/supabase-js](https://supabase.com/docs) y `@supabase/ssr` para autenticación por roles (RBAC) y persistencia.
- **Animaciones & Interactividad**: [Framer Motion 12](https://www.framer.com/motion/), [GSAP 3.15](https://gsap.com/) y [Lenis Smooth Scroll](https://lenis.darkroom.engineering/).
- **Iconografía**: [Lucide React](https://lucide.dev/) y [React Icons](https://react-icons.github.io/react-icons/).

---

## 📁 Estructura del Frontend (`frontend/`)

```text
frontend/
├── app/                               # Rutas oficiales bajo Next.js App Router
│   ├── layout.tsx                     # Layout global: ThemeProvider, AuthContext, Navbar, Footer
│   ├── globals.css                    # Directivas Tailwind v4, fuentes y animaciones
│   ├── page.tsx                       # Página Principal: Mapa Interactivo 2D/3D
│   ├── perfil/page.tsx                # Perfil del Usuario & Pasaporte Cultural
│   ├── agenda/page.tsx                # Calendario y Cartelera de Eventos Culturales
│   ├── circuitos/page.tsx             # Catálogo y detalle de Circuitos Creativos
│   ├── emprendedores/page.tsx         # Directorio de MiPymes y Talleres Artesanales
│   ├── ciudades-creativas/            # Rutas dinámicas por municipio (/ciudades-creativas/[slug])
│   ├── admin/page.tsx                 # Panel de Administración de la Red
│   └── login/page.tsx                 # Formulario de Acceso y Registro
│
├── src/
│   ├── components/
│   │   ├── auth/                      # AuthModal.tsx (Modal de inicio de sesión y registro)
│   │   ├── map/                       # MapaContenedor.tsx, CircuitoSelectorModal.tsx
│   │   ├── ui/                        # Navigation.tsx, SplashScreen.tsx, PrecolombianPattern.tsx
│   │   └── user/                      # UserProfileDashboard.tsx (Pasaporte, Medallas, Configuración)
│   │
│   ├── context/                       # AuthContext.tsx (Estado global de sesión y perfil)
│   ├── data/                          # nicaraguaGeo.ts (Datos geoespaciales y departamentos)
│   ├── lib/                           # supabase.ts (Cliente cliente/servidor de Supabase)
│   └── services/                      # apiClient.ts (Conector HTTP con la API Express)
│
├── public/                            # Recursos estáticos
│   ├── logos/                         # Logotipos oficiales de ROOTS y de las 10 Ciudades Creativas
│   ├── patterns/                      # Conceptos y assets de patrones precolombinos en SVG
│   └── manifest.json                  # Manifiesto de PWA para instalación móvil
│
├── next.config.ts                     # Configuración de Next.js y PWA
└── package.json                       # Dependencias y scripts del frontend
```

---

## 🎨 Identidad Visual y Paleta Cromática

La aplicación implementa una paleta de colores culturalmente representativa de Nicaragua:

| Color | Hex | Significado y Aplicación |
| :--- | :--- | :--- |
| **Verde Selva** | `#0F3A2E` | Fondos principales, cabeceras institucionales y botones primarios |
| **Turquesa Caribe** | `#00A8A7` | Acentos de marca, anillos de avatar, halo de mapa y enlaces activos |
| **Maíz & Ocre** | `#F4A43B` | Medallas de gamificación, puntos acumulados y badges de nivel |
| **Dorado Solar** | `#F4D44D` | Circuitos destacados, íconos de destello y reconocimientos |
| **Verde Esperanza** | `#3BA455` | Indicadores de verificación, estado activo y sellos conseguidos |
| **Arena Suave** | `#F5EFE6` | Fondo principal en Modo Claro para óptima legibilidad |
| **Noche Volcánica** | `#0A1217` | Fondo principal inmersivo en Modo Oscuro |

---

## 📱 Vistas Principales Desarrolladas

### 1. Mapa Interactivo 2D/3D (`/`)
- Interfaz inmersiva de borde a borde optimizada para pantallas grandes y teléfonos móviles.
- Inclinación 3D (pitch) con controles de zoom, rotación y selector de capas (Satelital, Topográfica, Rutas y Puntos).
- Selector modal para desplegar itinerarios culturales como la *Ruta Dariana*, *Ruta de Barro Ancestral* o *Ruta del Café*.

### 2. Dashboard de Perfil & Pasaporte Cultural (`/perfil`)
- Contenedor panorámico desktop de `1400px` (`w-[min(94vw,1400px)]`) alineado a la barra de navegación.
- **Colección de 10 Sellos de Ciudades Creativas**: León, Masaya, Granada, San Juan de Oriente, Estelí, Bluefields, Matagalpa, Juigalpa, Managua y Nagarote.
- **Sistema de Puntos y Medallas**: Progreso visual de logros (*Maestro Alfarero*, *Poeta Dariano*, *Embajador de Identidad*, etc.).
- **Selector de Temas**: Cambio instantáneo entre **Modo Claro**, **Modo Oscuro** y sincronización automática con el sistema operativo.
- **6 Pestañas Integradas**: Pasaporte, Medallas, Eventos Guardados, Mis Circuitos, Emprendimiento y Ajustes.

### 3. Directorio de Emprendedores (`/emprendedores`)
- Catálogo de negocios locales, artesanos y gastronomía tradicional clasificados por rubro y municipio.
- Formulario de solicitud de acreditación para obtener la insignia oficial de *Emprendedor Verificado*.

### 4. Agenda Cultural (`/agenda`)
- Cartelera de festividades tradicionales, ferias y festivales con búsqueda en tiempo real y opción de guardado.

### 5. Panel Administrativo (`/admin`)
- Panel de control protegido para supervisores de la Red Nacional de Ciudades Creativas.

---

## ⚙️ Configuración y Ejecución Local

### 1. Variables de Entorno (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-anon-key-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 2. Comandos Disponibles
```bash
# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Compilar para producción con Turbopack
npm run build

# Iniciar servidor en modo producción
npm run start

# Ejecutar análisis estático de código (ESLint)
npm run lint
```
