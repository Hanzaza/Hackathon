import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://zgjzwnbtfmkixqmnmxkw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function seedSupabaseDirectly() {
  console.log('🚀 Sembrando datos directamente en Supabase:', supabaseUrl);

  // 1. Departamentos
  const departmentsData = [
    { name: 'León', slug: 'leon', code: 'LE', description: 'Capital del Aprendizaje UNESCO, cuna de Rubén Darío, ciudad universitaria y epicentro del arte y la literatura.', is_creative_region: true, status: 'active' },
    { name: 'Masaya', slug: 'masaya', code: 'MY', description: 'Cuna del Folclore Nacional, artesanías en barro, hamacas, marimba y tradición ancestral de Monimbó.', is_creative_region: true, status: 'active' },
    { name: 'Granada', slug: 'granada', code: 'GR', description: 'La Gran Sultana, diseño colonial, arquitectura patrimonial, poesía internacional y tradición del lago.', is_creative_region: true, status: 'active' },
    { name: 'Estelí', slug: 'esteli', code: 'ES', description: 'El Diamante de las Segovias, capital del muralismo nicaragüense, música norteña y tradición tabacalera.', is_creative_region: true, status: 'active' },
    { name: 'Matagalpa', slug: 'matagalpa', code: 'MT', description: 'La Perla del Septentrión, café de especialidad, sones campesinos, naturaleza y tradiciones indígenas.', is_creative_region: true, status: 'active' },
    { name: 'Managua', slug: 'managua', code: 'MN', description: 'Capital de la República, vibrante centro de artes escénicas, diseño contemporáneo e innovación urbana.', is_creative_region: true, status: 'active' },
    { name: 'Chontales', slug: 'chontales', code: 'CT', description: 'Tierra de serranías, arqueología precolombina, cultura ganadera y tradición oral de Juigalpa.', is_creative_region: true, status: 'active' },
    { name: 'Costa Caribe Sur (RACCS)', slug: 'costa-caribe-sur', code: 'RACCS', description: 'Cultura caribeña multiétnica, danza del Palo de Mayo, música garífuna y creole de Bluefields.', is_creative_region: true, status: 'active' },
    { name: 'Chinandega', slug: 'chinandega', code: 'CH', description: 'Tierra de volcanes, agricultura fértil, gastronomía marina y tradiciones religiosas coloniales.', is_creative_region: false, status: 'active' },
    { name: 'Carazo', slug: 'carazo', code: 'CZ', description: 'Cuna del Güegüense (Patrimonio Oral e Inmaterial de la Humanidad UNESCO) y tradiciones ecuestres.', is_creative_region: false, status: 'active' },
    { name: 'Rivas', slug: 'rivas', code: 'RI', description: 'Puerta del sur, rica en historias caciquiles, vientos lacustres y artesanías de la costa.', is_creative_region: false, status: 'active' },
    { name: 'Nueva Segovia', slug: 'nueva-segovia', code: 'NS', description: 'Montañas de pinares, café de altura, artesanías de tusa y riqueza histórica revolucionaria.', is_creative_region: false, status: 'active' },
    { name: 'Madriz', slug: 'madriz', code: 'MD', description: 'Hogar del Cañón de Somoto, rosquillas tradicionales de fama mundial y artesanías de henequén.', is_creative_region: false, status: 'active' },
    { name: 'Jinotega', slug: 'jinotega', code: 'JI', description: 'Ciudad de las Brumas, música de polkas y mazurcas campesinas, lagos de Apanás y bosque nuboso.', is_creative_region: false, status: 'active' },
    { name: 'Boaco', slug: 'boaco', code: 'BO', description: 'La Ciudad de Dos Pisos, tradición de bailes de moros y cristianos y quesos artesanales.', is_creative_region: false, status: 'active' },
    { name: 'Río San Juan', slug: 'rio-san-juan', code: 'RSJ', description: 'Ruta fluvial histórica, arte primitivista de Solentiname y exuberante biodiversidad.', is_creative_region: false, status: 'active' },
    { name: 'Costa Caribe Norte (RACCN)', slug: 'costa-caribe-norte', code: 'RACCN', description: 'Tierras ancestrales Miskitas, Mayangnas, artesanías de tuno y lengua materna viva.', is_creative_region: false, status: 'active' },
  ];

  console.log('Insertando departamentos en Supabase...');
  for (const dept of departmentsData) {
    const { data, error } = await supabase.from('departments').upsert(dept, { onConflict: 'slug' }).select();
    if (error) console.error(`❌ Error en depto ${dept.name}:`, error.message);
    else console.log(`✅ Depto: ${dept.name}`);
  }

  // 2. Obtener departamentos para vincular municipios
  const { data: dbDepts } = await supabase.from('departments').select('id, name, slug');
  const getDeptId = (name: string) => dbDepts?.find(d => d.name.toLowerCase().includes(name.toLowerCase()))?.id;

  const municipalitiesData = [
    {
      name: 'León',
      slug: 'leon',
      department_id: getDeptId('León'),
      subtitle: 'Capital del Aprendizaje y Ciudad Creativa Literaria',
      description: 'Ciudad universitaria, hogar de la Insigne Catedral de León y mausoleo de Rubén Darío.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop',
      lat: 12.4350,
      lng: -86.8782,
      status: 'active',
    },
    {
      name: 'Masaya',
      slug: 'masaya',
      department_id: getDeptId('Masaya'),
      subtitle: 'Cuna del Folclore y Artesanía Nacional',
      description: 'Capital de las artesanías en barro, máscaras de cedazo, hamacas tejidas e indumentaria tradicional.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300&auto=format&fit=crop',
      lat: 11.9744,
      lng: -86.0942,
      status: 'active',
    },
    {
      name: 'San Juan de Oriente',
      slug: 'san-juan-de-oriente',
      department_id: getDeptId('Masaya'),
      subtitle: 'Cuna de la Cerámica Precolombina y Contemporánea',
      description: 'Pueblo de artesanos donde cada casa es un taller de alfarería con técnicas heredadas de generaciones.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop',
      lat: 11.9064,
      lng: -86.0750,
      status: 'active',
    },
    {
      name: 'Granada',
      slug: 'granada',
      department_id: getDeptId('Granada'),
      subtitle: 'La Gran Sultana y Ciudad Creativa del Diseño Colonial',
      description: 'Ciudad patrimonial con calles empedradas, iglesias barrocas y riqueza gastronómica del vigorón.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop',
      lat: 11.9299,
      lng: -85.9560,
      status: 'active',
    },
    {
      name: 'Estelí',
      slug: 'esteli',
      department_id: getDeptId('Estelí'),
      subtitle: 'Diamante de las Segovias y Capital del Muralismo',
      description: 'Ciudad de murales históricos en cada esquina, son nica, poesía y excelencia artesanal.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300&auto=format&fit=crop',
      lat: 13.0919,
      lng: -86.3538,
      status: 'active',
    },
    {
      name: 'Matagalpa',
      slug: 'matagalpa',
      department_id: getDeptId('Matagalpa'),
      subtitle: 'Perla del Septentrión y Ciudad Creativa de la Música Campesina',
      description: 'Tierras altas cafetaleras, polkas y mazurcas, chocolate artesanal y leyendas del norte.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop',
      lat: 12.9256,
      lng: -85.9178,
      status: 'active',
    },
    {
      name: 'Bluefields',
      slug: 'bluefields',
      department_id: getDeptId('Costa Caribe Sur'),
      subtitle: 'Capital Multicultural del Caribe Nicaragüense',
      description: 'Riqueza rítmica del Palo de Mayo, gastronomía de rondón y confluencia de 6 pueblos originarios.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop',
      lat: 12.0137,
      lng: -83.7635,
      status: 'active',
    },
    {
      name: 'Juigalpa',
      slug: 'juigalpa',
      department_id: getDeptId('Chontales'),
      subtitle: 'Tierra de Serranías, Poesía y Arqueología Chontaleña',
      description: 'Centro de la cultura taurina tradicional, museo arqueológico Gregorio Aguilar Barea y literatura de montaña.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop',
      lat: 12.1063,
      lng: -85.3645,
      status: 'active',
    },
    {
      name: 'Nagarote',
      slug: 'nagarote',
      department_id: getDeptId('León'),
      subtitle: 'Municipio Azul y Cuna del Quesillo Tradicional',
      description: 'Ciudad más limpia de Nicaragua, famosa por sus quesillos trenzados y vistas hacia el Lago Xolotlán.',
      is_creative: true,
      municipality_type: 'creativa',
      hero_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&auto=format&fit=crop',
      logo_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop',
      lat: 12.2664,
      lng: -86.5647,
      status: 'active',
    },
  ];

  console.log('\nInsertando municipios en Supabase...');
  for (const mun of municipalitiesData) {
    const { data, error } = await supabase.from('municipalities').upsert(mun, { onConflict: 'slug' }).select();
    if (error) console.error(`❌ Error en municipio ${mun.name}:`, error.message);
    else console.log(`✅ Municipio: ${mun.name}`);
  }

  // 3. Crear Circuito Creativo (Ruta Dariana)
  const { data: dbLeon } = await supabase.from('municipalities').select('id').eq('slug', 'leon').single();
  if (dbLeon) {
    const routeData = {
      municipality_id: dbLeon.id,
      name: 'Ruta Creativa de los Leones & Rubén Darío',
      slug: 'ruta-dariana-leon',
      description: 'Circuito cultural interactivo por los hitos históricos del modernismo literario y talleres artesanales de León.',
      theme: 'Literatura & Patrimonio',
      difficulty: 'Fácil',
      estimated_duration: 120,
      points_award: 200,
      badge_name: 'Caballero Dariano',
      badge_icon: 'BookOpen',
      route_color: '#9333ea',
      is_visible_in_map: true,
      status: 'published',
    };

    const { data: routeRes, error: rErr } = await supabase.from('creative_routes').upsert(routeData, { onConflict: 'slug' }).select().single();
    if (rErr) console.error('❌ Error en Ruta:', rErr.message);
    else {
      console.log(`✅ Ruta Creativa: ${routeRes.name}`);

      // 4. Paradas de la Ruta (Hitos Principales vs Secundarios)
      const placesData: Record<string, any>[] = [
        {
          route_id: routeRes.id,
          municipality_id: dbLeon.id,
          name: 'Insigne Catedral de León (Patrimonio de la Humanidad UNESCO)',
          slug: 'catedral-de-leon',
          description: 'La basílica más grande de Centroamérica. Mausoleo de Rubén Darío custodiado por el león doliente.',
          category: 'Patrimonio UNESCO',
          icon_name: 'Landmark',
          image_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
          audio_guide_url: 'https://cdn.roots.ni/audios/catedral-leon-guia.mp3',
          vr_360_url: 'https://cdn.roots.ni/vr360/catedral-leon.html',
          is_primary_route_point: true,
          walk_time: 'Punto de inicio',
          points_reward: 100,
          lat: 12.4350,
          lng: -86.8782,
          order_num: 1,
          status: 'active',
        },
        {
          route_id: routeRes.id,
          municipality_id: dbLeon.id,
          name: 'Museo Archivo Rubén Darío',
          slug: 'museo-ruben-dario',
          description: 'Casa solariega colonial donde Darío vivió su infancia. Manuscritos originales y pertenencias del Príncipe de las Letras.',
          category: 'Museo Literario',
          icon_name: 'BookOpen',
          image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop',
          audio_guide_url: 'https://cdn.roots.ni/audios/museo-dario.mp3',
          vr_360_url: null,
          is_primary_route_point: true,
          walk_time: '4 min a pie',
          points_reward: 80,
          lat: 12.4372,
          lng: -86.8795,
          order_num: 2,
          status: 'active',
        },
        {
          route_id: routeRes.id,
          municipality_id: dbLeon.id,
          name: 'Teatro Municipal José de la Cruz Mena',
          slug: 'teatro-jose-de-la-cruz-mena',
          description: 'Templo neoclásico de las artes escénicas de Nicaragua, sede de óperas, recitales poéticos y danza clásica.',
          category: 'Artes Escénicas',
          icon_name: 'Sparkles',
          image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
          audio_guide_url: null,
          vr_360_url: null,
          is_primary_route_point: true,
          walk_time: '3 min a pie',
          points_reward: 70,
          lat: 12.4361,
          lng: -86.8770,
          order_num: 3,
          status: 'active',
        },
        {
          route_id: routeRes.id,
          municipality_id: dbLeon.id,
          name: 'Taller de Cerámica y Barro Negro Sutiaba',
          slug: 'taller-barro-sutiaba',
          description: 'Taller artesanal familiar con demostraciones en vivo de torneado en barro y técnicas ancestrales de Sutiaba.',
          category: 'Taller Artesanal',
          icon_name: 'Store',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
          audio_guide_url: null,
          vr_360_url: null,
          is_primary_route_point: false, // Punto Secundario Comercial / Cultural
          walk_time: '12 min a pie',
          points_reward: 50,
          lat: 12.4285,
          lng: -86.8890,
          order_num: 4,
          status: 'active',
        },
        {
          route_id: routeRes.id,
          municipality_id: dbLeon.id,
          name: 'Café & Dulcería Tradicional El Solar Leonés',
          slug: 'dulceria-solar-leones',
          description: 'Emprendimiento gastronómico con más de 40 años sirviendo cajetas de leche, bienmesabe y café orgánico.',
          category: 'Gastronomía Tradicional',
          icon_name: 'Utensils',
          image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop',
          audio_guide_url: null,
          vr_360_url: null,
          is_primary_route_point: false, // Punto Secundario
          walk_time: '2 min a pie',
          points_reward: 40,
          lat: 12.4338,
          lng: -86.8775,
          order_num: 5,
          status: 'active',
        },
      ];

      for (const p of placesData) {
        const { error: pErr } = await supabase.from('route_places').upsert(p as any, { onConflict: 'slug' });
        if (pErr) console.error(`❌ Error parada ${p.name}:`, pErr.message);
        else console.log(`✅ Parada: ${p.name} (Principal: ${p.is_primary_route_point})`);
      }
    }
  }

  // 3.1 Crear Circuito Creativo San Juan de Oriente (Tierra Viva)
  const { data: dbSJO } = await supabase.from('municipalities').select('id').eq('slug', 'san-juan-de-oriente').single();
  if (dbSJO) {
    const routeSJO = {
      municipality_id: dbSJO.id,
      name: 'Circuito Creativo “Tierra Viva”',
      slug: 'circuito-tierra-viva-san-juan-de-oriente',
      description: 'Recorrido que celebra la tradición alfarera y la riqueza artesanal de San Juan de Oriente como museo abierto, integrando talleres vivenciales, murales, gastronomía ancestral y miradores.',
      theme: 'Artesanía & Cerámica Ancestral',
      difficulty: 'Fácil',
      estimated_duration: 150,
      points_award: 250,
      badge_name: 'Maestro del Barro Vivo',
      badge_icon: 'Sparkles',
      route_color: '#ea580c',
      is_visible_in_map: true,
      status: 'published',
    };

    const { data: routeResSJO, error: rErrSJO } = await supabase.from('creative_routes').upsert(routeSJO, { onConflict: 'slug' }).select().single();
    if (rErrSJO) console.error('❌ Error en Ruta SJO:', rErrSJO.message);
    else {
      console.log(`✅ Ruta Creativa: ${routeResSJO.name}`);

      const placesSJO: Record<string, any>[] = [
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Plaza San Juan de los Platos',
          slug: 'plaza-san-juan-de-los-platos',
          description: 'Punto de partida del circuito con su anfiteatro y tiendas de artesanías, donde se encuentra el mupis con el mapa guiado del recorrido.',
          category: 'Plaza & Orientación Turística',
          icon_name: 'Landmark',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: 'Punto de inicio',
          address: 'Plaza Central de San Juan de Oriente',
          points_reward: 50,
          lat: 11.9056,
          lng: -86.0758,
          order_num: 1,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Taller Escuela del Maestro Valentín López',
          slug: 'taller-escuela-valentin-lopez',
          description: 'Espacio de aprendizaje donde los visitantes conocen de cerca el proceso de transformación de la arcilla, desde su preparación hasta la creación de piezas únicas.',
          category: 'Taller Escuela & Alfarería',
          icon_name: 'Store',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '3 min a pie',
          address: 'Del Parque Central 1c al este, San Juan de Oriente',
          points_reward: 60,
          lat: 11.9062,
          lng: -86.0751,
          order_num: 2,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Senderos Místicos (Murales Culturales)',
          slug: 'senderos-misticos-murales',
          description: 'Murales de interés cultural en calles y callejones que narran la cosmovisión, mitología y tradición alfarera comunitaria.',
          category: 'Muralismo & Arte Urbano',
          icon_name: 'Sparkles',
          image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '2 min a pie',
          address: 'Calles principales del casco histórico',
          points_reward: 40,
          lat: 11.9051,
          lng: -86.0762,
          order_num: 3,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Taller Urraca del Maestro Alfredo Espinoza',
          slug: 'taller-urraca-alfredo-espinoza',
          description: 'Centro de producción y encuentro cultural con demostraciones en vivo y talleres vivenciales para estudiantes y visitantes.',
          category: 'Taller Vivencial & Producción',
          icon_name: 'Store',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '4 min a pie',
          address: 'Barrio Buena Vista, San Juan de Oriente',
          points_reward: 50,
          lat: 11.9048,
          lng: -86.0748,
          order_num: 4,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Alfarería GUERRERO',
          slug: 'alfareria-guerrero-sjo',
          description: 'Taller alfarero tradicional para observar la elaboración, participar en experiencias prácticas de torno y adquirir piezas representativas.',
          category: 'Alfarería Tradicional',
          icon_name: 'Store',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '3 min a pie',
          address: 'Costado Norte de la Parroquia San Juan Bautista',
          points_reward: 50,
          lat: 11.9068,
          lng: -86.0765,
          order_num: 5,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Taller Ecos Precolombinos (Memorial Maestro Gregorio Bracamontes)',
          slug: 'taller-ecos-precolombinos-gregorio-bracamontes',
          description: 'Espacio que honra la memoria y el legado artístico de uno de los grandes referentes de la cerámica tradicional y precolombina.',
          category: 'Memorial & Patrimonio',
          icon_name: 'Landmark',
          image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '3 min a pie',
          address: 'Avenida de los Maestros Alfareros',
          points_reward: 60,
          lat: 11.9042,
          lng: -86.0755,
          order_num: 6,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Chicha Buja Doña Loña',
          slug: 'chicha-buja-dona-lona',
          description: 'Rescate de la preparación artesanal de la chicha bruja de maíz fermentado, presentaciones de la danza de los Chinegros y muestra de murales.',
          category: 'Gastronomía Tradicional & Danza',
          icon_name: 'Utensils',
          image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '2 min a pie',
          address: 'Calle del Calvario, San Juan de Oriente',
          points_reward: 50,
          lat: 11.9059,
          lng: -86.0742,
          order_num: 7,
          status: 'active',
        },
        {
          route_id: routeResSJO.id,
          municipality_id: dbSJO.id,
          name: 'Mirador De Gran Belleza Escénica “Sendero El Caballito”',
          slug: 'mirador-sendero-el-caballito',
          description: 'Sendero rodeado de paisajes verdes y vistas panorámicas que permiten apreciar la riqueza ambiental de la zona, invitando a la contemplación y el descanso.',
          category: 'Mirador & Naturaleza',
          icon_name: 'Compass',
          image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
          is_primary_route_point: true,
          walk_time: '8 min a pie',
          address: 'Sector Mirador a la Laguna, San Juan de Oriente',
          points_reward: 70,
          lat: 11.9080,
          lng: -86.0715,
          order_num: 8,
          status: 'active',
        },
      ];

      for (const p of placesSJO) {
        const { error: pErr } = await supabase.from('route_places').upsert(p as any, { onConflict: 'slug' });
        if (pErr) console.error(`❌ Error parada SJO ${p.name}:`, pErr.message);
        else console.log(`✅ Parada SJO: ${p.name}`);
      }
    }
  }

  // 5. Logros de Gamificación
  const achievements = [
    { name: 'Primeros Pasos Creativos', slug: 'primeros-pasos', description: 'Visita y escanea tu primer hito cultural en cualquier ciudad.', achievement_type: 'visita', icon: 'Compass', points_reward: 50, required_count: 1 },
    { name: 'Explorador de Circuitos', slug: 'explorador-circuitos', description: 'Completa un circuito creativo completo con todos sus hitos.', achievement_type: 'ruta', icon: 'Award', points_reward: 200, required_count: 1 },
    { name: 'Mecenas de la Tradición', slug: 'mecenas-tradicion', description: 'Visita y apoya 3 locales de emprendedores o talleres secundarios.', achievement_type: 'puntos_secundarios', icon: 'Store', points_reward: 150, required_count: 3 },
    { name: 'Embajador Visual de Nicaragua', slug: 'embajador-visual', description: 'Comparte 5 fotografías de monumentos o artesanías en la plataforma.', achievement_type: 'foto', icon: 'Camera', points_reward: 100, required_count: 5 },
    { name: 'Crítico Cultural de Honor', slug: 'critico-cultural', description: 'Escribe 3 reseñas detalladas sobre experiencias en ciudades creativas.', achievement_type: 'resena', icon: 'Star', points_reward: 75, required_count: 3 },
  ];

  for (const ach of achievements) {
    const { error } = await supabase.from('achievements').upsert(ach, { onConflict: 'slug' });
    if (error) console.error(`❌ Error logro ${ach.name}:`, error.message);
    else console.log(`✅ Logro: ${ach.name}`);
  }

  console.log('\n🎉 ¡Sembrado directo en Supabase completado con éxito!');
}

seedSupabaseDirectly();
