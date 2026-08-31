import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;

async function migrateAndSeed() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to PostgreSQL database via Direct URL...');
    await client.connect();
    console.log('✅ Connected successfully to PostgreSQL.');

    // 1. Ejecutar el esquema SQL maestro
    console.log('Applying master database schema...');
    const schemaSql = fs.readFileSync(
      path.join(__dirname, '../supabase-schema.sql'),
      'utf8'
    );
    await client.query(schemaSql);
    console.log('✅ Master schema created/updated successfully.');

    // 2. Sembrar Departamentos de Nicaragua
    console.log('Seeding 15 Departments + 2 Autonomous Regions...');
    const departments = [
      { name: 'León', slug: 'leon', code: 'LE', is_creative: true, desc: 'Primera capital de la revolución, cuna de la literatura universal y del aprendizaje UNESCO.' },
      { name: 'Masaya', slug: 'masaya', code: 'MY', is_creative: true, desc: 'Cuna del Folclore Nacional, artesanías en barro, hamacas y tradición de Monimbó.' },
      { name: 'Granada', slug: 'granada', code: 'GR', is_creative: true, desc: 'La Gran Sultana, diseño colonial, arquitectura patrimonial y festivales de poesía.' },
      { name: 'Estelí', slug: 'esteli', code: 'ES', is_creative: true, desc: 'Diamante de las Segovias, capital del muralismo, tabaco premium y música norteña.' },
      { name: 'Matagalpa', slug: 'matagalpa', code: 'MT', is_creative: true, desc: 'Perla del Septentrión, café de altura, cacao fino y sones de polka y mazurca.' },
      { name: 'Costa Caribe Sur (RACCS)', slug: 'costa-caribe-sur', code: 'RACCS', is_creative: true, desc: 'Cuna del Palo de Mayo, cultura creole, mískita y tradiciones caribeñas.' },
      { name: 'Chontales', slug: 'chontales', code: 'CT', is_creative: true, desc: 'Tierra de monturas, estatuaria precolombina de Amerrisque y tradición ganadera.' },
      { name: 'Managua', slug: 'managua', code: 'MN', is_creative: true, desc: 'Capital de la República, centro cultural, museos y teatros nacionales.' },
      { name: 'Chinandega', slug: 'chinandega', code: 'CH', is_creative: false, desc: 'Tierra de volcanes, costas del Pacífico y gastronomía de mariscos.' },
      { name: 'Carazo', slug: 'carazo', code: 'CZ', is_creative: false, desc: 'Tierra del Güegüense, bailes de toros y cuna de San Sebastián.' },
      { name: 'Rivas', slug: 'rivas', code: 'RI', is_creative: false, desc: 'Santuario de playas, surf mundial y el místico oasis de Ometepe.' },
      { name: 'Boaco', slug: 'boaco', code: 'BO', is_creative: false, desc: 'Ciudad de dos pisos, quesos artesanales y leyendas de montaña.' },
      { name: 'Jinotega', slug: 'jinotega', code: 'JI', is_creative: false, desc: 'Ciudad de las Brumas, cafetales de altura y reserva de biosfera Bosawás.' },
      { name: 'Madriz', slug: 'madriz', code: 'MD', is_creative: false, desc: 'Geoparque Somoto, rosquillas tradicionales de Somoto y cañones naturales.' },
      { name: 'Nueva Segovia', slug: 'nueva-segovia', code: 'NS', is_creative: false, desc: 'Pinares, artesanía en barro de Mozonte y rutas históricas del norte.' },
      { name: 'Río San Juan', slug: 'rio-san-juan', code: 'RSJ', is_creative: false, desc: 'Pintura primitivista de Solentiname, fortaleza El Castillo y ecoturismo fluvial.' },
      { name: 'Costa Caribe Norte (RACCN)', slug: 'costa-caribe-norte', code: 'RACCN', is_creative: false, desc: 'Pueblos originarios Mískitus, Mayangnas y riqueza forestal milenaria.' },
    ];

    for (const dept of departments) {
      await client.query(`
        INSERT INTO public.departments (id, name, slug, code, description, is_creative_region, status)
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, 'active')
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          code = EXCLUDED.code,
          description = EXCLUDED.description,
          is_creative_region = EXCLUDED.is_creative_region;
      `, [dept.name, dept.slug, dept.code, dept.desc, dept.is_creative]);
    }
    console.log('✅ Departments seeded.');

    // 3. Sembrar Municipios / Ciudades Creativas y Tradicionales
    console.log('Seeding Municipalities / Creative Cities...');
    const leonDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'leon'")).rows[0]?.id;
    const masayaDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'masaya'")).rows[0]?.id;
    const granadaDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'granada'")).rows[0]?.id;
    const esteliDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'esteli'")).rows[0]?.id;
    const matagalpaDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'matagalpa'")).rows[0]?.id;
    const caribeSurDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'costa-caribe-sur'")).rows[0]?.id;
    const chontalesDept = (await client.query("SELECT id FROM public.departments WHERE slug = 'chontales'")).rows[0]?.id;

    const cities = [
      { deptId: leonDept, name: 'León', slug: 'leon', subtitle: 'Capital del Aprendizaje UNESCO y Cuna de las Artes', is_creative: true, type: 'creativa', lat: 12.4350, lng: -86.8782 },
      { deptId: leonDept, name: 'Nagarote', slug: 'nagarote', subtitle: 'Municipio Azul y Capital del Quesillo Tradicional', is_creative: true, type: 'creativa', lat: 12.2664, lng: -86.5647 },
      { deptId: masayaDept, name: 'Masaya', slug: 'masaya', subtitle: 'Cuna del Folclore Nacional y Ciudad de las Flores', is_creative: true, type: 'creativa', lat: 11.9744, lng: -86.0942 },
      { deptId: masayaDept, name: 'San Juan de Oriente', slug: 'san-juan-de-oriente', subtitle: 'Ciudad de la Cerámica y Alfarería Ancestral', is_creative: true, type: 'creativa', lat: 11.9056, lng: -86.0758 },
      { deptId: masayaDept, name: 'Catarina', slug: 'catarina', subtitle: 'Jardines, Viveros y Mirador a la Laguna', is_creative: true, type: 'creativa', lat: 11.9125, lng: -86.0734 },
      { deptId: granadaDept, name: 'Granada', slug: 'granada', subtitle: 'La Gran Sultana, Cuna del Diseño y la Poesía', is_creative: true, type: 'creativa', lat: 11.9299, lng: -85.9560 },
      { deptId: esteliDept, name: 'Estelí', slug: 'esteli', subtitle: 'Diamante de las Segovias y Capital del Muralismo', is_creative: true, type: 'creativa', lat: 13.0919, lng: -86.3538 },
      { deptId: matagalpaDept, name: 'Matagalpa', slug: 'matagalpa', subtitle: 'Perla del Septentrión y Cuna del Café de Altura', is_creative: true, type: 'creativa', lat: 12.9256, lng: -85.9178 },
      { deptId: caribeSurDept, name: 'Bluefields', slug: 'bluefields', subtitle: 'Ciudad Creativa Multiétnica y Cuna del Palo de Mayo', is_creative: true, type: 'creativa', lat: 12.0137, lng: -83.7635 },
      { deptId: chontalesDept, name: 'Juigalpa', slug: 'juigalpa', subtitle: 'Tierra de Montañas y Esculturas Precolombinas', is_creative: true, type: 'creativa', lat: 12.1063, lng: -85.3645 },
    ];

    for (const city of cities) {
      if (city.deptId) {
        await client.query(`
          INSERT INTO public.municipalities (id, department_id, name, slug, subtitle, is_creative, municipality_type, lat, lng, status)
          VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, 'active')
          ON CONFLICT (slug) DO UPDATE SET
            department_id = EXCLUDED.department_id,
            name = EXCLUDED.name,
            subtitle = EXCLUDED.subtitle,
            is_creative = EXCLUDED.is_creative,
            municipality_type = EXCLUDED.municipality_type,
            lat = EXCLUDED.lat,
            lng = EXCLUDED.lng;
        `, [city.deptId, city.name, city.slug, city.subtitle, city.is_creative, city.type, city.lat, city.lng]);
      }
    }
    console.log('✅ Municipalities seeded.');

    // 4. Sembrar Circuitos Creativos (Ruta Dariana, Cerámica, Muralismo, Palo de Mayo)
    console.log('Seeding Creative Routes / Circuits...');
    const leonCity = (await client.query("SELECT id FROM public.municipalities WHERE slug = 'leon'")).rows[0]?.id;
    const sanJuanCity = (await client.query("SELECT id FROM public.municipalities WHERE slug = 'san-juan-de-oriente'")).rows[0]?.id;
    const esteliCity = (await client.query("SELECT id FROM public.municipalities WHERE slug = 'esteli'")).rows[0]?.id;
    const bluefieldsCity = (await client.query("SELECT id FROM public.municipalities WHERE slug = 'bluefields'")).rows[0]?.id;

    if (leonCity) {
      const routeRes = await client.query(`
        INSERT INTO public.creative_routes (id, municipality_id, name, slug, description, theme, difficulty, estimated_duration, points_award, badge_name, cover_image, status, is_visible_in_map)
        VALUES (gen_random_uuid()::text, $1, 'Circuito Dariano Colonial', 'circuito-dariano-colonial', 'Recorrido por la vida y obra del Príncipe de las Letras Castellanas, Catedral de León y casas solariegas.', 'Literatura & Arquitectura', 'Fácil', 180, 250, 'Guardián Dariano', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop', 'published', true)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          points_award = EXCLUDED.points_award
        RETURNING id;
      `, [leonCity]);

      const darianoRouteId = routeRes.rows[0]?.id;

      // Sembrar Lugares del Circuito Dariano (Principales vs Secundarios)
      if (darianoRouteId) {
        const leonPlaces = [
          {
            name: 'Insigne Catedral de León (Patrimonio UNESCO)',
            slug: 'catedral-leon-unesco',
            desc: 'Tumba del poeta universal Rubén Darío, custodio del león doliente y la mayor catedral de Centroamérica.',
            category: 'Patrimonio UNESCO',
            is_primary: true, // HITO PRINCIPAL
            lat: 12.4350,
            lng: -86.8782,
            walk_time: 'Punto de inicio',
            image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
            order: 1,
            points: 100,
          },
          {
            name: 'Museo Archivo Rubén Darío',
            slug: 'museo-archivo-ruben-dario',
            desc: 'Casa colonial de cuatro corredores donde vivió su infancia el poeta. Conserva manuscritos y su biblioteca.',
            category: 'Museo Literario',
            is_primary: true, // HITO PRINCIPAL
            lat: 12.4339,
            lng: -86.8798,
            walk_time: '4 min a pie',
            image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop',
            order: 2,
            points: 80,
          },
          {
            name: 'Teatro Municipal José de la Cruz Mena',
            slug: 'teatro-jose-de-la-cruz-mena',
            desc: 'Joya arquitectónica de 1885 donde se honró la memoria de Darío y de la música clásica leonesa.',
            category: 'Artes Escénicas',
            is_primary: true, // HITO PRINCIPAL
            lat: 12.4361,
            lng: -86.8795,
            walk_time: '3 min a pie',
            image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            order: 3,
            points: 70,
          },
          {
            name: 'Taller de Cerámica y Barro Negro Sutiaba',
            slug: 'taller-ceramica-sutiaba',
            desc: 'Emprendimiento tradicional en el corazón del barrio indígena que preserva el barro negro y la alfarería.',
            category: 'Taller Artesanal',
            is_primary: false, // PUNTO SECUNDARIO CULTURAL / COMERCIAL
            lat: 12.4310,
            lng: -86.8905,
            walk_time: '12 min a pie',
            image: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=800&auto=format&fit=crop',
            order: 4,
            points: 50,
          },
          {
            name: 'Café & Dulcería Tradicional El Solar Leonés',
            slug: 'cafe-solar-leones',
            desc: 'Gastronomía leonesa, buñuelos de yuca y raspados tradicionales en una casona de tejas centenarias.',
            category: 'Gastronomía Tradicional',
            is_primary: false, // PUNTO SECUNDARIO CULTURAL / COMERCIAL
            lat: 12.4345,
            lng: -86.8770,
            walk_time: '2 min a pie',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
            order: 5,
            points: 40,
          },
        ];

        for (const p of leonPlaces) {
          await client.query(`
            INSERT INTO public.route_places (
              id, municipality_id, route_id, name, slug, description, category, is_primary_route_point,
              lat, lng, walk_time, image_url, order_num, points_reward, status
            )
            VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'active')
            ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              is_primary_route_point = EXCLUDED.is_primary_route_point,
              points_reward = EXCLUDED.points_reward,
              description = EXCLUDED.description;
          `, [
            leonCity, darianoRouteId, p.name, p.slug, p.desc, p.category, p.is_primary,
            p.lat, p.lng, p.walk_time, p.image, p.order, p.points
          ]);
        }
      }
    }

    // 5. Sembrar Logros de Gamificación
    console.log('Seeding Gamification Achievements...');
    const achievements = [
      { name: 'Guardián Dariano', slug: 'guardian-dariano', desc: 'Completa la Ruta Dariana Colonial en la ciudad de León.', type: 'ruta', icon: '📜', points: 250, count: 1 },
      { name: 'Explorador de Tradiciones', slug: 'explorador-tradiciones', desc: 'Visita 3 locales o talleres secundarios de la red creativa.', type: 'puntos_secundarios', icon: '🏺', points: 150, count: 3 },
      { name: 'Embajador Visual', slug: 'embajador-visual', desc: 'Comparte 5 fotografías verificadas de tus visitas a la red.', type: 'foto', icon: '📸', points: 200, count: 5 },
      { name: 'Voz Comunitaria', slug: 'voz-comunitaria', desc: 'Escribe 3 reseñas detalladas sobre tu experiencia cultural.', type: 'resena', icon: '⭐', points: 120, count: 3 },
      { name: 'Alma de la Marimba', slug: 'alma-marimba', desc: 'Asiste a un evento cultural en vivo en Masaya.', type: 'evento', icon: '🎶', points: 180, count: 1 },
    ];

    for (const ach of achievements) {
      await client.query(`
        INSERT INTO public.achievements (id, name, slug, description, achievement_type, icon, points_reward, required_count)
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          points_reward = EXCLUDED.points_reward;
      `, [ach.name, ach.slug, ach.desc, ach.type, ach.icon, ach.points, ach.count]);
    }
    console.log('✅ Achievements seeded.');

    // 6. Sembrar Eventos Culturales
    console.log('Seeding Cultural Events across Creative Cities...');
    const eventSeeds = [
      {
        citySlug: 'leon',
        deptSlug: 'leon',
        title: 'Noche de Mitos, Leyendas y Poesía de Sutiaba',
        desc: 'Desfile tradicional de comparsas de la Cegua, el Cadejo, Gigantonas y recital poético en el barrio indígena.',
        category: 'Tradición & Folclore',
        location: 'Plaza Parque de Sutiaba, León',
        daysAhead: 3,
        durationHours: 4,
        points: 150,
        image: 'https://images.unsplash.com/photo-1542296332-2a44733e56a9?w=1200&h=800&fit=crop&auto=format'
      },
      {
        citySlug: 'masaya',
        deptSlug: 'masaya',
        title: 'Festival Nacional de la Marimba y los Agüizotes',
        desc: 'Encuentro de más de 50 marimbistas tradicionales de Monimbó, feria de artesanías en barro y dulces típicos.',
        category: 'Música & Danza',
        location: 'Mercado de Artesanías de Masaya',
        daysAhead: 7,
        durationHours: 5,
        points: 180,
        image: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=1200&h=800&fit=crop&auto=format'
      },
      {
        citySlug: 'san-juan-de-oriente',
        deptSlug: 'masaya',
        title: 'Expo-Taller de Cerámica Viva Precolombina',
        desc: 'Demostración magistral de torneado en barro y pulido con piedra de ágata por maestros artesanos certificados.',
        category: 'Artesanía & Tradición',
        location: 'Taller Escuela Central de Cerámica, San Juan de Oriente',
        daysAhead: 10,
        durationHours: 3,
        points: 120,
        image: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=1200&h=800&fit=crop&auto=format'
      },
      {
        citySlug: 'granada',
        deptSlug: 'granada',
        title: 'Feria Gastronómica del Vigorón y Café de Altura',
        desc: 'Degustación colonial en hojas de chahuite, música de cuerda en vivo y recorridos patrimoniales por la Gran Sultana.',
        category: 'Gastronomía Tradicional',
        location: 'Plaza de la Independencia, Granada',
        daysAhead: 14,
        durationHours: 6,
        points: 100,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop&auto=format'
      },
      {
        citySlug: 'esteli',
        deptSlug: 'esteli',
        title: 'Ruta Nocturna del Muralismo y Poesía Urbana',
        desc: 'Recorrido guiado por murales históricos con iluminación artística y presentaciones de música norteña y mazurcas.',
        category: 'Arte Urbano',
        location: 'Parque Central 16 de Julio, Estelí',
        daysAhead: 18,
        durationHours: 4,
        points: 160,
        image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&h=800&fit=crop&auto=format'
      },
      {
        citySlug: 'bluefields',
        deptSlug: 'costa-caribe-sur',
        title: 'Gala Cultural Palo de Mayo y Ritmos Caribeños',
        desc: 'Celebración multiétnica con comparsas creole, danza garífuna y gastronomía costeña (Rondón y Pan de Coco).',
        category: 'Danza & Música',
        location: 'Parque Central Reyes, Bluefields',
        daysAhead: 25,
        durationHours: 7,
        points: 200,
        image: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=1200&h=800&fit=crop&auto=format'
      }
    ];

    for (const ev of eventSeeds) {
      const munRow = (await client.query("SELECT id FROM public.municipalities WHERE slug = $1", [ev.citySlug])).rows[0];
      const deptRow = (await client.query("SELECT id FROM public.departments WHERE slug = $1", [ev.deptSlug])).rows[0];
      
      if (munRow && deptRow) {
        await client.query(`
          INSERT INTO public.entrepreneur_events (
            id, municipality_id, department_id, title, description, category, start_date, end_date, location_name, points_reward, image_url, status
          )
          VALUES (
            gen_random_uuid()::text, $1, $2, $3, $4, $5,
            now() + ($6 || ' days')::interval,
            now() + ($6 || ' days')::interval + ($7 || ' hours')::interval,
            $8, $9, $10, 'published'
          )
          ON CONFLICT DO NOTHING;
        `, [
          munRow.id,
          deptRow.id,
          ev.title,
          ev.desc,
          ev.category,
          ev.daysAhead.toString(),
          ev.durationHours.toString(),
          ev.location,
          ev.points,
          ev.image
        ]);
      }
    }
    console.log('✅ Cultural events seeded.');

    console.log('🎉 Migration and Seed completed successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    await client.end();
  }
}

migrateAndSeed();
