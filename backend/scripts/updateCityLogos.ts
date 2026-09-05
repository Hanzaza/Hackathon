import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://zgjzwnbtfmkixqmnmxkw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const LOGO_MAP: Record<string, { logo: string; name: string; deptSlug: string; subtitle: string; desc: string; lat: number; lng: number }> = {
  'bluefields': {
    logo: '/logos/logo1.png',
    name: 'Bluefields',
    deptSlug: 'costa-caribe-sur',
    subtitle: 'Capital Multicultural del Caribe Nicaragüense',
    desc: 'Riqueza rítmica del Palo de Mayo, gastronomía de rondón y confluencia de 6 pueblos originarios.',
    lat: 12.0137,
    lng: -83.7635
  },
  'masaya': {
    logo: '/logos/logo2.png',
    name: 'Masaya',
    deptSlug: 'masaya',
    subtitle: 'Cuna del Folclore Nacional y Capital de la Artesanía',
    desc: 'Tierra de marimbas de arco, danzas tradicionales, hamacas y maestría artesanal de Monimbó.',
    lat: 11.9744,
    lng: -86.0942
  },
  'san-juan-de-oriente': {
    logo: '/logos/logo3.png',
    name: 'San Juan de Oriente',
    deptSlug: 'masaya',
    subtitle: 'Cuna de la Cerámica Precolombina y Contemporánea',
    desc: 'Pueblo de artesanos donde cada casa es un taller de alfarería con técnicas heredadas de generaciones.',
    lat: 11.9064,
    lng: -86.0750
  },
  'leon': {
    logo: '/logos/logo4.png',
    name: 'León',
    deptSlug: 'leon',
    subtitle: 'Ciudad del Aprendizaje UNESCO y Cuna de Rubén Darío',
    desc: 'Centro de cultura, arte, memoria histórica, vanguardia universitaria y la imponente Catedral Patrimonio Mundial.',
    lat: 12.4379,
    lng: -86.8780
  },
  'granada': {
    logo: '/logos/logo5.png',
    name: 'Granada',
    deptSlug: 'granada',
    subtitle: 'La Gran Sultana y Ciudad Creativa del Diseño Colonial',
    desc: 'Ciudad patrimonial con calles empedradas, iglesias barrocas y riqueza gastronómica del vigorón.',
    lat: 11.9299,
    lng: -85.9560
  },
  'esteli': {
    logo: '/logos/logo6.png',
    name: 'Estelí',
    deptSlug: 'esteli',
    subtitle: 'Ciudad Creativa de las Artes, Música Segoviana y Muralismo',
    desc: 'Ciudad de murales históricos en cada esquina, son nica, poesía y excelencia artesanal.',
    lat: 13.0919,
    lng: -86.3538
  },
  'juigalpa': {
    logo: '/logos/logo7.png',
    name: 'Juigalpa',
    deptSlug: 'chontales',
    subtitle: 'Tierra de Serranías, Poesía y Arqueología Chontaleña',
    desc: 'Centro de la cultura taurina tradicional, museo arqueológico Gregorio Aguilar Barea y literatura de montaña.',
    lat: 12.1063,
    lng: -85.3645
  },
  'managua': {
    logo: '/logos/logo8.png',
    name: 'Managua',
    deptSlug: 'managua',
    subtitle: 'Capital Creativa: Paisajismo Lacustre, Museos y Vanguardia Cultural',
    desc: 'Epicentro artístico, universitario y de innovación urbana a orillas del Lago Xolotlán.',
    lat: 12.1364,
    lng: -86.2514
  },
  'matagalpa': {
    logo: '/logos/logo9.png',
    name: 'Matagalpa',
    deptSlug: 'matagalpa',
    subtitle: 'Perla del Septentrión y Ciudad Creativa de la Música Campesina',
    desc: 'Tierras altas cafetaleras, polkas y mazurcas, chocolate artesanal y leyendas del norte.',
    lat: 12.9256,
    lng: -85.9178
  },
  'nagarote': {
    logo: '/logos/logo10.png',
    name: 'Nagarote',
    deptSlug: 'leon',
    subtitle: 'Municipio Azul y Cuna del Quesillo Tradicional',
    desc: 'Ciudad más limpia de Nicaragua, famosa por sus quesillos trenzados y vistas hacia el Lago Xolotlán.',
    lat: 12.2664,
    lng: -86.5647
  },
};

async function syncAllLogos() {
  console.log('🔄 Sincronizando 10 Ciudades Creativas y sus logos (logo1 a logo10)...');

  const { data: departments } = await supabase.from('departments').select('id, slug, name');
  const deptMap: Record<string, string> = {};
  if (departments) {
    departments.forEach(d => {
      deptMap[d.slug] = d.id;
      deptMap[d.name.toLowerCase()] = d.id;
    });
  }

  for (const [slug, info] of Object.entries(LOGO_MAP)) {
    const deptId = deptMap[info.deptSlug] || deptMap[info.deptSlug.replace('-', ' ')] || null;

    const payload = {
      name: info.name,
      slug: slug,
      department_id: deptId,
      subtitle: info.subtitle,
      description: info.desc,
      is_creative: true,
      municipality_type: 'creativa',
      logo_url: info.logo,
      lat: info.lat,
      lng: info.lng,
      status: 'active'
    };

    const { data, error } = await supabase
      .from('municipalities')
      .upsert(payload, { onConflict: 'slug' })
      .select('id, name, slug, logo_url');

    if (error) {
      console.error(`❌ Error en ${slug}:`, error.message);
    } else {
      console.log(`✅ ${info.name} sincronizado con logo ${info.logo}:`, data);
    }
  }

  console.log('✨ Sincronización completada exitosamente.');
}

syncAllLogos()
  .catch(console.error)
  .finally(() => process.exit(0));
