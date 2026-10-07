import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../frontend/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zgjzwnbtfmkixqmnmxkw.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncLeon() {
  console.log('--- Verificando Municipio León ---');
  let { data: mun, error: mErr } = await supabase
    .from('municipalities')
    .select('id, name, slug')
    .eq('slug', 'leon')
    .single();

  if (mErr || !mun) {
    console.log('Creando municipio León...');
    const { data: newMun, error: insMunErr } = await supabase
      .from('municipalities')
      .insert({
        name: 'León',
        slug: 'leon',
        subtitle: 'Capital del Aprendizaje UNESCO y Ciudad Universitaria',
        description: 'Cuna de la literatura modernista y de Rubén Darío.',
        is_creative: true,
        municipality_type: 'creativa',
        lat: 12.4350,
        lng: -86.8782,
        status: 'active'
      })
      .select()
      .single();
    if (insMunErr) {
      console.error('Error creando municipio León:', insMunErr);
      return;
    }
    mun = newMun;
  }
  console.log('Municipio León ID:', mun.id);

  console.log('\n--- Verificando Circuito Creativo de León ---');
  let { data: route, error: rErr } = await supabase
    .from('creative_routes')
    .select('id, name, slug')
    .eq('slug', 'ruta-dariana-leon')
    .single();

  if (rErr || !route) {
    console.log('Creando Circuito Creativo Rubén Darío...');
    const { data: newRoute, error: insRouteErr } = await supabase
      .from('creative_routes')
      .insert({
        municipality_id: mun.id,
        name: 'Circuito Creativo Rubén Darío',
        slug: 'ruta-dariana-leon',
        description: 'Circuito cultural por los hitos y espacios de memoria viva del Príncipe de las Letras Castellanas en León.',
        theme: 'Literatura & Patrimonio',
        difficulty: 'Fácil',
        estimated_duration: 120,
        points_award: 200,
        badge_name: 'Caballero Dariano',
        badge_icon: 'BookOpen',
        route_color: '#9333ea',
        is_visible_in_map: true,
        status: 'published'
      })
      .select()
      .single();

    if (insRouteErr) {
      console.error('Error creando ruta:', insRouteErr);
      return;
    }
    route = newRoute;
  }
  console.log('Ruta ID:', route.id, '| Nombre:', route.name);

  // Listado de los 10 sitios provistos por el usuario
  const places = [
    {
      name: 'Casa Museo Archivo Rubén Darío',
      slug: 'casa-museo-archivo-ruben-dario',
      category: 'Museo Literario',
      icon_name: 'BookOpen',
      description: 'Es la casa donde el «Príncipe de las Letras Castellanas» vivió durante su infancia y conserva manuscritos, primeras ediciones de sus libros y objetos personales.',
      address: 'De la Iglesia San Francisco 1c al oeste, León',
      walk_time: '5 min a pie',
      points_reward: 80,
      lat: 12.4339,
      lng: -86.8798,
      order_num: 1,
      image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop',
      audio_guide_url: 'https://cdn.roots.ni/audios/museo-dario.mp3',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Los Motivos del Lobo (Escultura)',
      slug: 'los-motivos-del-lobo-escultura',
      category: 'Escultura & Monumento',
      icon_name: 'Sparkles',
      description: 'Símbolo de la herencia literaria del poeta Rubén Darío, como un mensaje universal de convivencia y compasión, que invita a los visitantes a descubrir la riqueza cultural y espiritual que define la identidad nicaragüense.',
      address: 'Costado norte del Parque Central, León',
      walk_time: '2 min a pie',
      points_reward: 50,
      lat: 12.4368,
      lng: -86.8785,
      order_num: 2,
      image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Centro Cultural Rubén Darío',
      slug: 'centro-cultural-ruben-dario-leon',
      category: 'Centro Cultural',
      icon_name: 'Landmark',
      description: 'Espacio moderno inaugurado para la promoción del arte y la literatura, cuenta con biblioteca municipal, salón de robótica, áreas verdes, quiosco y aulas, ofreciendo un entorno ideal para la lectura y la tecnología.',
      address: 'Costado oeste de la Alcaldía de León',
      walk_time: '4 min a pie',
      points_reward: 60,
      lat: 12.4358,
      lng: -86.8810,
      order_num: 3,
      image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Teatro Municipal José de la Cruz Mena',
      slug: 'teatro-municipal-jose-de-la-cruz-mena',
      category: 'Artes Escénicas',
      icon_name: 'Sparkles',
      description: 'Es el escenario principal para las artes escénicas, conciertos y eventos literarios que mantienen viva la rica herencia intelectual de la ciudad creativa de León, se realizan actividades mensuales, abierto al público en general.',
      address: 'Costado norte de la Catedral de León',
      walk_time: '3 min a pie',
      points_reward: 70,
      lat: 12.4361,
      lng: -86.8795,
      order_num: 4,
      image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Parque de los Poetas',
      slug: 'parque-de-los-poetas-leon',
      category: 'Parque & Patrimonio',
      icon_name: 'Compass',
      description: 'Espacio histórico y cultural situado a dos cuadras de la Catedral, donde se rinde homenaje al «Príncipe de las Letras Castellanas» con una estatua central, rodeado por bustos de poetas leoneses, en un entorno de estilo colonial con jardines, que también ofrece gastronomía popular de la ciudad.',
      address: 'A dos cuadras al oeste de la Catedral de León',
      walk_time: '3 min a pie',
      points_reward: 50,
      lat: 12.4342,
      lng: -86.8805,
      order_num: 5,
      image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Vallas Informativas UNAN León',
      slug: 'vallas-informativas-unan-leon',
      category: 'Exposición & Academia',
      icon_name: 'BookOpen',
      description: 'La exposición pictórica permanente de Rubén Darío en la UNAN-León consta de 14 vallas informativas, ubicadas en el jardín interior del edificio central, muestra la vida y obra del poeta, destacando su legado y su relación histórica con la institución. En este sitio se encuentran docentes a disposición de los visitantes para realizar un recorrido.',
      address: 'Edificio Central UNAN-León, jardín interior',
      walk_time: '2 min a pie',
      points_reward: 50,
      lat: 12.4355,
      lng: -86.8778,
      order_num: 6,
      image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Basílica Catedral León, Tumba de Rubén Darío',
      slug: 'basilica-catedral-leon-tumba-dario',
      category: 'Patrimonio de la Humanidad UNESCO',
      icon_name: 'Landmark',
      description: 'Espacio de interés que recibe a visitantes por su estilo ecléctico, que mezcla barroco y neoclásico, donde se alberga la tumba del poeta Rubén Darío, situada al pie de la estatua de San Pablo, marcada por un león doliente esculpido por Jorge Navas Cordonero.',
      address: 'Parque Central Juan José Quezada, León',
      walk_time: 'Punto de inicio',
      points_reward: 100,
      lat: 12.4350,
      lng: -86.8782,
      order_num: 7,
      image_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
      audio_guide_url: 'https://cdn.roots.ni/audios/catedral-leon-guia.mp3',
      vr_360_url: 'https://cdn.roots.ni/vr360/catedral-leon.html',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Escuela de Bellas Artes Mariana Sanson Arguello',
      slug: 'escuela-bellas-artes-mariana-sanson',
      category: 'Centro de Formación Artística',
      icon_name: 'Sparkles',
      description: 'Destacado centro de formación artística, enfocado en el desarrollo técnico y creativo de niños, jóvenes y adultos. Ofrece clases en disciplinas como pintura, ballet, música (piano, violín, canto), teatro y percusión, con cafetería literaria.',
      address: 'Costado este del Parque San Francisco, León',
      walk_time: '4 min a pie',
      points_reward: 60,
      lat: 12.4365,
      lng: -86.8765,
      order_num: 8,
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Plazoleta Rubén Darío',
      slug: 'plazoleta-ruben-dario-leon',
      category: 'Plazoleta & Escultura',
      icon_name: 'Compass',
      description: 'Destaca por una escultura de 7 metros de altura del «Príncipe de las Letras Castellanas», creada por el escultor Sócrates Martínez, inspirada en su faceta diplomática. Escenario de actividades culturales los fines de semana.',
      address: 'Avenida Rubén Darío, León',
      walk_time: '6 min a pie',
      points_reward: 50,
      lat: 12.4330,
      lng: -86.8820,
      order_num: 9,
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    },
    {
      name: 'Parque Centenario de la Dignidad Rubén Darío',
      slug: 'parque-centenario-dignidad-dario',
      category: 'Monumento & Espacio Público',
      icon_name: 'Landmark',
      description: 'Espacio de referencia en la Ciudad Creativa de León, ubicado en la entrada sur (Carretera León-Managua), con imponente pórtico neoclásico, cuatro leones esculpidos, fuentes decorativas, jardines de buganvilias y placa-retrato del insigne poeta.',
      address: 'Entrada Sur de León (Carretera León-Managua)',
      walk_time: '15 min en vehículo / transporte',
      points_reward: 70,
      lat: 12.4225,
      lng: -86.8700,
      order_num: 10,
      image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
      is_primary_route_point: true,
      status: 'active'
    }
  ];

  console.log('\n--- Sincronizando Sitios / Paradas ---');
  for (const p of places) {
    // Comprobar si ya existe por slug
    const { data: existing } = await supabase
      .from('route_places')
      .select('id, name, slug')
      .eq('slug', p.slug)
      .single();

    if (existing) {
      console.log(`ℹ️ [YA EXISTE]: ${p.name} (ID: ${existing.id})`);
    } else {
      console.log(`➕ [NUEVO SITIO]: Insertando ${p.name}...`);
      const { error: insErr } = await supabase
        .from('route_places')
        .insert({
          municipality_id: mun.id,
          route_id: route.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          category: p.category,
          icon_name: p.icon_name,
          address: p.address,
          walk_time: p.walk_time,
          points_reward: p.points_reward,
          lat: p.lat,
          lng: p.lng,
          order_num: p.order_num,
          image_url: p.image_url,
          audio_guide_url: p.audio_guide_url || null,
          vr_360_url: p.vr_360_url || null,
          is_primary_route_point: p.is_primary_route_point,
          status: p.status
        });

      if (insErr) console.error(`❌ Error insertando ${p.name}:`, insErr.message);
      else console.log(`✅ [INSERTADO CON ÉXITO]: ${p.name}`);
    }
  }

  console.log('\n🎉 Sincronización del Circuito Creativo de León finalizada.');
}

syncLeon().catch(console.error);
