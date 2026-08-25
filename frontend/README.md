# Roots - Movilidad Sostenible y Ciudades Creativas

Este proyecto es una Progressive Web App (PWA) multiplataforma desarrollada con Next.js, diseñada para cerrar la brecha entre la rica oferta comercial y cultural de las Ciudades Creativas de Nicaragua y los canales digitales del turismo moderno. Utiliza Supabase para la gestión de datos y Prisma como ORM para la base de datos, proporcionando una solución robusta y escalable.

## Problema que busca resolver

Actualmente, existe una significativa desconexión tecnológica entre la oferta comercial y cultural de las Ciudades Creativas de Nicaragua y los canales digitales utilizados por el turismo moderno. Esta brecha en la digitalización de la información limita el crecimiento económico local, ya que los turistas carecen de herramientas interactivas para planificar sus recorridos, y los emprendedores locales (MiPymes, artesanos) no tienen sistemas eficientes que les otorguen visibilidad y los vinculen proactivamente con oportunidades comerciales y eventos afines a su rubro.

## Solución Propuesta: "Roots"

"Roots" centraliza la oferta turística y exalta los orígenes, tradiciones y la cultura nicaragüense a través de dos pilares tecnológicos principales:

1.  **Mapa Inmersivo Interactivo:** Permite a los usuarios navegar espacialmente por las rutas y denominaciones de cada ciudad creativa, geolocalizando puntos de interés, emprendimientos y eventos.
2.  **Sistema de Perfiles y Notificaciones Inteligentes:** Alerta de manera exclusiva a los emprendedores sobre ferias, talleres y exposiciones donde su negocio tiene potencial de participación y venta, optimizando su visibilidad y oportunidades comerciales.

## Principales Beneficiarios

El impacto de "Roots" se extiende a dos segmentos clave:

*   **Turistas (nacionales e internacionales):** Acceden a un ecosistema digital inmersivo para explorar visualmente todas las denominaciones, conocer las rutas creativas, geolocalizar puntos de interés y planificar su visita en función de la agenda operativa de cada ciudad.
*   **Sector Comercial (MiPymes, artesanos y emprendedores):** Obtienen una plataforma de alta visibilidad para exponer sus productos ante un mercado global. El sistema de notificaciones exclusivas les permite aprovechar oportunidades de negocio perfiladas específicamente para su tipo de actividad, fortaleciendo su participación en el ecosistema cultural y económico.

## Relación con la Ciudad Creativa o el Territorio

"Roots" funciona como una infraestructura digital escalable para toda la Red Nacional de Ciudades Creativas de Nicaragua. Iniciando el desarrollo desde León, la plataforma busca estandarizar la promoción de los 10 territorios, preservando y digitalizando sus "raíces" culturales. La PWA integra circuitos, denominaciones y actividades económicas específicas de cada zona en un ecosistema tecnológico unificado, impulsando la economía naranja del país mediante herramientas de geolocalización inmersiva y vinculación comercial estratégica.

## Tecnología

El proyecto está construido con:
*   **Next.js:** Framework de React para el desarrollo de aplicaciones web full-stack.
*   **Supabase:** Plataforma de código abierto para bases de datos y autenticación, actuando como backend.
*   **Prisma:** ORM (Object-Relational Mapper) para la interacción con la base de datos, proporcionando una capa de abstracción para un desarrollo más eficiente.

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Hanzaza/Hackathon.git
    cd stateless-mobility
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o si usas yarn
    # yarn install
    # o si usas pnpm
    # pnpm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto basándote en `supabase-env.example`. Necesitarás las credenciales de Supabase (URL y clave API).

4.  **Configurar la base de datos (Opcional):**
    Si necesitas inicializar o migrar la base de datos, puedes usar Prisma:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

## Ejecución

Para iniciar la aplicación en modo de desarrollo:

```bash
npm run dev
# o
# yarn dev
# o
# pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).
