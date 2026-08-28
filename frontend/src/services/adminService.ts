import { supabase } from '../lib/supabase';

export interface AdminStats {
  totalUsers: number;
  totalEntrepreneurs: number;
  pendingRequests: number;
  totalRoutes: number;
  totalEvents: number;
  totalCities: number;
  pendingReports: number;
  supabaseConnected: boolean;
}

export interface EntrepreneurRequestItem {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  request_type: string;
  status: 'pending' | 'approved' | 'rejected';
  motivation: string;
  business_name: string;
  business_type: 'fisico' | 'digital' | 'hibrido';
  address?: string;
  city?: string;
  documents?: string[];
  created_at: string;
}

export interface CreativeRouteItem {
  id: string;
  municipality_id?: string;
  municipality_name?: string;
  name: string;
  slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  cover_image?: string;
  theme?: string;
  difficulty?: 'Fácil' | 'Moderada' | 'Desafiante';
  estimated_duration?: number;
  points_award: number;
  badge_name?: string;
  is_visible_in_map: boolean;
  places_count?: number;
  created_at?: string;
}

export interface MunicipalityItem {
  id: string;
  name: string;
  slug: string;
  department_name?: string;
  is_creative: boolean;
  municipality_type: 'creativa' | 'tradicional' | 'mixta' | 'en_desarrollo';
  status: 'active' | 'inactive';
  description?: string;
  subtitle?: string;
  logo_url?: string;
  hero_desktop?: string;
  hero_mobile?: string;
  lat?: number;
  lng?: number;
  specialties?: string[];
  created_at?: string;
}

export interface RoutePlaceItem {
  id: string;
  route_id: string;
  route_name?: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  image?: string;
  walk_time?: string;
  rating?: string;
  lat: number;
  lng: number;
  is_active: boolean;
  order_num?: number;
  highlight?: string;
}

export interface AdminEventItem {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_name: string;
  city: string;
  category: string;
  status: 'published' | 'draft' | 'cancelled';
  organizer?: string;
  image?: string;
}

export interface AdminUserItem {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: 'user' | 'entrepreneur' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  points: number;
  level: number;
  city?: string;
  avatar?: string;
  created_at: string;
}

export interface AchievementItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  achievement_type: 'ruta' | 'evento' | 'visita' | 'especial';
  icon: string;
  points_reward: number;
  required_count: number;
}

export interface ReportItem {
  id: string;
  reported_by_name: string;
  reported_by_email: string;
  target_type: 'lugar' | 'ruta' | 'comentario' | 'emprendedor';
  target_id: string;
  target_name?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

// Datos iniciales de demostración con identidad nicaragüense completa
const INITIAL_REQUESTS: EntrepreneurRequestItem[] = [
  {
    id: 'req-001',
    user_id: 'usr-101',
    user_name: 'María Alejandra Gómez',
    user_email: 'maria.gomez@artesaniasnic.com',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    request_type: 'entrepreneur',
    status: 'pending',
    motivation: 'Elaboramos piezas de cerámica negra y filigrana tradicional de Sutiaba, fomentando el empleo en mujeres artesanas de la comunidad.',
    business_name: 'Cerámicas y Barro de Sutiaba',
    business_type: 'fisico',
    address: 'Del Parque de Sutiaba 2c al Norte, León',
    city: 'León',
    documents: ['RUC_Comercial.pdf', 'Certificacion_Artesanal_MEFCCA.pdf', 'Fotos_Taller.zip'],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'req-002',
    user_id: 'usr-102',
    user_name: 'Carlos Mendoza',
    user_email: 'carlos@marimbasmasaya.ni',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    request_type: 'entrepreneur',
    status: 'pending',
    motivation: 'Taller de luthería y fabricación de marimbas de arco e instrumentos folclóricos con madera certificada.',
    business_name: 'Sonidos del Folclore Monimbó',
    business_type: 'fisico',
    address: 'Barrio Monimbó, contiguo a Iglesia San Sebastián, Masaya',
    city: 'Masaya',
    documents: ['Licencia_Municipal.pdf', 'Catalogo_Instrumentos.pdf'],
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'req-003',
    user_id: 'usr-103',
    user_name: 'Fatima Jarquín',
    user_email: 'fatima.dulces@gmail.com',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    request_type: 'entrepreneur',
    status: 'pending',
    motivation: 'Producción de cajetas, atol de ánimas y dulces típicos con recetas ancestrales de la Meseta de los Pueblos.',
    business_name: 'Dulcería Tradicional Doña Fatima',
    business_type: 'hibrido',
    address: 'Costado Sur Parque Central, San Juan de Oriente',
    city: 'San Juan de Oriente',
    documents: ['Permiso_Sanitario_MINSA.pdf'],
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
];

const INITIAL_ROUTES: CreativeRouteItem[] = [
  {
    id: 'rt-001',
    name: 'Circuito Dariano Colonial',
    slug: 'circuito-dariano-colonial',
    municipality_name: 'León',
    description: 'Recorrido por la vida y obra del Príncipe de las Letras Castellanas, Catedral de León y casas coloniales.',
    status: 'published',
    theme: 'Literatura & Arquitectura',
    difficulty: 'Fácil',
    estimated_duration: 180,
    points_award: 250,
    badge_name: 'Guardián Dariano',
    cover_image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
    is_visible_in_map: true,
    places_count: 5,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rt-002',
    name: 'Ruta del Barro y la Cerámica Precolombina',
    slug: 'ruta-del-barro-y-ceramica',
    municipality_name: 'San Juan de Oriente',
    description: 'Talleres vivos de torneado, pulido con piedras de río y quemado en hornos de leña ancestrales.',
    status: 'published',
    theme: 'Artesanía & Escultura',
    difficulty: 'Fácil',
    estimated_duration: 120,
    points_award: 200,
    badge_name: 'Maestro Alfarero',
    cover_image: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=800&auto=format&fit=crop',
    is_visible_in_map: true,
    places_count: 4,
    created_at: '2026-08-05T10:00:00Z',
  },
  {
    id: 'rt-003',
    name: 'Circuito del Muralismo y la Revolución Creativa',
    slug: 'circuito-muralismo-esteli',
    municipality_name: 'Estelí',
    description: 'Más de 300 murales al aire libre que narran la historia, ecología y vida comunitaria del diamante de las Segovias.',
    status: 'published',
    theme: 'Arte Urbano & Memoria',
    difficulty: 'Moderada',
    estimated_duration: 210,
    points_award: 300,
    badge_name: 'Caminante Muralista',
    cover_image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&auto=format&fit=crop',
    is_visible_in_map: true,
    places_count: 6,
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'rt-004',
    name: 'Ruta Caribeña del Palo de Mayo y Tradición Creol',
    slug: 'ruta-caribena-bluefields',
    municipality_name: 'Bluefields',
    description: 'Danza, gastronomía caribeña (rondón, patí) y arquitectura antillana en el corazón de la Costa Caribe Sur.',
    status: 'published',
    theme: 'Cultura Caribeña & Música',
    difficulty: 'Moderada',
    estimated_duration: 240,
    points_award: 350,
    badge_name: 'Alma Caribe',
    cover_image: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=800&auto=format&fit=crop',
    is_visible_in_map: true,
    places_count: 5,
    created_at: '2026-08-12T10:00:00Z',
  },
];

const INITIAL_CITIES: MunicipalityItem[] = [
  {
    id: 'city-01',
    name: 'León',
    slug: 'leon',
    department_name: 'León',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Capital del Aprendizaje UNESCO y Cuna de las Artes',
    description: 'Ciudad universitaria y literaria por excelencia, hogar de la insigne Catedral Patrimonio de la Humanidad y sepulcro de Rubén Darío.',
    logo_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
    lat: 12.4350,
    lng: -86.8782,
    specialties: ['Literatura', 'Artes Plásticas', 'Patrimonio Colonial', 'Poesía'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-02',
    name: 'Masaya',
    slug: 'masaya',
    department_name: 'Masaya',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Cuna del Folclore Nacional y Ciudad de las Flores',
    description: 'Corazón folclórico de Nicaragua, famosa por sus sones de marimba de arco, hamacas tejidas a mano y el legendario barrio indígena de Monimbó.',
    logo_url: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&auto=format&fit=crop',
    lat: 11.9744,
    lng: -86.0942,
    specialties: ['Folclore', 'Marimba', 'Artesanías en Cuero', 'Textiles'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-03',
    name: 'San Juan de Oriente',
    slug: 'san-juan-de-oriente',
    department_name: 'Masaya',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Ciudad Creativa de la Cerámica y Alfarería Ancestral',
    description: 'El pueblo de los ceramistas donde las manos maestras moldean el barro con técnicas precolombinas, bruñido con piedras de río e incisiones geométricas.',
    logo_url: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=800&auto=format&fit=crop',
    lat: 11.9056,
    lng: -86.0758,
    specialties: ['Cerámica Precolombina', 'Alfarería Viva', 'Escultura'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-04',
    name: 'Granada',
    slug: 'granada',
    department_name: 'Granada',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'La Gran Sultana, Cuna del Diseño y la Poesía',
    description: 'La ciudad colonial más antigua del continente en tierra firme, referente de arquitectura neoclásica, diseño de interiores y festivales de poesía.',
    logo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    lat: 11.9299,
    lng: -85.9560,
    specialties: ['Arquitectura Colonial', 'Diseño', 'Poesía', 'Gastronomía'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-05',
    name: 'Estelí',
    slug: 'esteli',
    department_name: 'Estelí',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Diamante de las Segovias y Capital del Muralismo',
    description: 'Galería al aire libre con más de 300 murales urbanos, cuna del tabaco premium mundial y ritmos segovianos tradicionales.',
    logo_url: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&auto=format&fit=crop',
    lat: 13.0919,
    lng: -86.3538,
    specialties: ['Muralismo', 'Música Segoviana', 'Tabaco', 'Artesanía'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-06',
    name: 'Bluefields',
    slug: 'bluefields',
    department_name: 'Costa Caribe Sur',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Ciudad Creativa Multiétnica y Cuna del Palo de Mayo',
    description: 'Mestizaje vibrante de pueblos creoles, mískitus y ramas con danzas ancestrales, música calipso y cocina tradicional con leche de coco.',
    logo_url: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=800&auto=format&fit=crop',
    lat: 12.0137,
    lng: -83.7635,
    specialties: ['Danza Tradicional', 'Música Creol', 'Gastronomía Caribeña'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-07',
    name: 'Matagalpa',
    slug: 'matagalpa',
    department_name: 'Matagalpa',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Perla del Septentrión y Cuna del Café de Altura',
    description: 'Naturaleza brumosa, polkas y mazurcas campesinas, y una sólida cultura del grano de oro y cacao fino.',
    logo_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop',
    lat: 12.9256,
    lng: -85.9178,
    specialties: ['Café de Especialidad', 'Música Campesina', 'Chocolate Artesanal'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-08',
    name: 'Juigalpa',
    slug: 'juigalpa',
    department_name: 'Chontales',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Tierra de Montañas y Esculturas Precolombinas',
    description: 'Arqueología milenaria con estatuarias de piedra, tradiciones ganaderas, poetas y leyendas de la Serranía de Amerrisque.',
    logo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    lat: 12.1063,
    lng: -85.3645,
    specialties: ['Arqueología', 'Cultura Taurina', 'Escultura'],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'city-09',
    name: 'Nagarote',
    slug: 'nagarote',
    department_name: 'León',
    is_creative: true,
    municipality_type: 'creativa',
    status: 'active',
    subtitle: 'Municipio Azul y Gastronomía del Quesillo',
    description: 'La capital gastronómica del quesillo con tiste, árboles centenarios de Genízaro y hermosas costas frente al Pacífico.',
    logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop',
    hero_desktop: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop',
    hero_mobile: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
    lat: 12.2664,
    lng: -86.5647,
    specialties: ['Gastronomía Tradicional', 'Quesillo', 'Turismo Costero'],
    created_at: '2026-08-01T10:00:00Z',
  },
];

const INITIAL_ROUTE_PLACES: RoutePlaceItem[] = [
  {
    id: 'plc-01',
    route_id: 'rt-001',
    route_name: 'Circuito Dariano Colonial',
    name: 'Catedral de la Asunción de León',
    slug: 'catedral-leon',
    category: 'Patrimonio UNESCO',
    description: 'Tumba del poeta Rubén Darío, la catedral más grande de Centroamérica y obra cumbre del barroco colonial.',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop',
    walk_time: 'Punto de inicio',
    rating: '4.9 ★',
    lat: 12.4350,
    lng: -86.8782,
    is_active: true,
    order_num: 1,
    highlight: 'Tumba del León de las Letras',
  },
  {
    id: 'plc-02',
    route_id: 'rt-001',
    route_name: 'Circuito Dariano Colonial',
    name: 'Museo Archivo Rubén Darío',
    slug: 'museo-archivo-dario',
    category: 'Museo Literario',
    description: 'Casa solariega colonial donde vivió su infancia el insigne poeta. Conserva manuscritos originales y su biblioteca.',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop',
    walk_time: '4 min a pie (300m)',
    rating: '4.8 ★',
    lat: 12.4339,
    lng: -86.8798,
    is_active: true,
    order_num: 2,
    highlight: 'Manuscritos originales',
  },
  {
    id: 'plc-03',
    route_id: 'rt-001',
    route_name: 'Circuito Dariano Colonial',
    name: 'Teatro Municipal José de la Cruz Mena',
    slug: 'teatro-cruz-mena',
    category: 'Artes Escénicas',
    description: 'Joya neoclásica inaugurada en 1885, escenario de los homenajes y recitales que marcaron la lírica nacional.',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
    walk_time: '3 min a pie (250m)',
    rating: '4.7 ★',
    lat: 12.4361,
    lng: -86.8795,
    is_active: true,
    order_num: 3,
    highlight: 'Arquitectura Neoclásica',
  },
  {
    id: 'plc-04',
    route_id: 'rt-001',
    route_name: 'Circuito Dariano Colonial',
    name: 'Parque Central Juan José Quezada',
    slug: 'parque-central-leon',
    category: 'Espacio Público',
    description: 'Plaza mayor histórica, rodeada de cafés tradicionales, palacio municipal y murales del movimiento intelectual leonés.',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop',
    walk_time: '2 min a pie (150m)',
    rating: '4.8 ★',
    lat: 12.4352,
    lng: -86.8789,
    is_active: true,
    order_num: 4,
    highlight: 'Corazón urbano de León',
  },
  {
    id: 'plc-05',
    route_id: 'rt-002',
    route_name: 'Ruta del Barro y Cerámica Precolombina',
    name: 'Taller Escuela de Cerámica Precolombina',
    slug: 'taller-escuela-ceramica',
    category: 'Taller Artesanal',
    description: 'Demostración en vivo de torno ancestral, pintura natural a base de minerales y técnica de bruñido con piedras de río.',
    image: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=800&auto=format&fit=crop',
    walk_time: 'Punto de inicio',
    rating: '4.9 ★',
    lat: 11.9056,
    lng: -86.0758,
    is_active: true,
    order_num: 1,
    highlight: 'Torneado a mano y tintes naturales',
  },
  {
    id: 'plc-06',
    route_id: 'rt-003',
    route_name: 'Circuito del Muralismo Segoviano',
    name: 'Murales del Parque Central de Estelí',
    slug: 'murales-parque-esteli',
    category: 'Arte Urbano',
    description: 'Murales gigantescos realizados por colectivos juveniles que retratan la biodiversidad de Tisey y la memoria comunitaria.',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&auto=format&fit=crop',
    walk_time: 'Punto de inicio',
    rating: '4.8 ★',
    lat: 13.0919,
    lng: -86.3538,
    is_active: true,
    order_num: 1,
    highlight: 'Arte social y colores vivos',
  },
];

const INITIAL_EVENTS: AdminEventItem[] = [
  {
    id: 'evt-01',
    title: 'Noche de Mitos y Leyendas de Sutiaba',
    description: 'Desfile tradicional con la Cegua, el Cadejo, la Carreta Nagua y comparsas culturales.',
    start_date: '2026-09-15T19:00:00Z',
    end_date: '2026-09-15T22:00:00Z',
    location_name: 'Plaza Parque de Sutiaba',
    city: 'León',
    category: 'Tradición & Folclore',
    status: 'published',
    organizer: 'Alcaldía de León y Red Creativa',
    image: 'https://images.unsplash.com/photo-1542296332-2a44733e56a9?w=800&auto=format&fit=crop',
  },
  {
    id: 'evt-02',
    title: 'Festival Nacional de la Marimba y Danza',
    description: 'Encuentro de más de 50 marimberos tradicionales en el Mercado de Artesanías.',
    start_date: '2026-09-22T16:00:00Z',
    end_date: '2026-09-22T20:00:00Z',
    location_name: 'Mercado de Artesanías de Masaya',
    city: 'Masaya',
    category: 'Música',
    status: 'published',
    organizer: 'Secretaría de Economía Creativa',
    image: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&auto=format&fit=crop',
  },
  {
    id: 'evt-03',
    title: 'Expo-Feria del Dulce y la Alfarería Viva',
    description: 'Exhibición y venta de cerámica artística precolombina y degustación de gastronomía típica.',
    start_date: '2026-09-28T09:00:00Z',
    end_date: '2026-09-28T17:00:00Z',
    location_name: 'Paseo de los Alfareros',
    city: 'San Juan de Oriente',
    category: 'Artesanía',
    status: 'published',
    organizer: 'Colectivo Artesanal San Juan',
    image: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=800&auto=format&fit=crop',
  },
];

const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'usr-001',
    name: 'Jonathan',
    lastname: 'Administrador',
    email: 'admin@rootsnicaragua.com',
    role: 'admin',
    status: 'active',
    points: 1540,
    level: 5,
    city: 'León',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'usr-002',
    name: 'Elena',
    lastname: 'Rivas',
    email: 'elena.turismo@gmail.com',
    role: 'entrepreneur',
    status: 'active',
    points: 820,
    level: 3,
    city: 'Granada',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    created_at: '2026-08-10T11:20:00Z',
  },
  {
    id: 'usr-003',
    name: 'Gabriel',
    lastname: 'Torres',
    email: 'gabriel.t@outlook.com',
    role: 'user',
    status: 'active',
    points: 340,
    level: 2,
    city: 'Estelí',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
    created_at: '2026-08-15T14:45:00Z',
  },
];

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  { id: 'ach-01', name: 'Explorador Colonial', slug: 'explorador-colonial', description: 'Visita 3 lugares históricos en la ciudad de León.', achievement_type: 'visita', icon: '🏛️', points_reward: 100, required_count: 3 },
  { id: 'ach-02', name: 'Amigo del Emprendedor', slug: 'amigo-del-emprendedor', description: 'Visita y califica 5 negocios locales registrados.', achievement_type: 'especial', icon: '🛍️', points_reward: 150, required_count: 5 },
  { id: 'ach-03', name: 'Gran Maestro Alfarero', slug: 'maestro-alfarero', description: 'Completa la ruta completa de San Juan de Oriente.', achievement_type: 'ruta', icon: '🏺', points_reward: 200, required_count: 1 },
  { id: 'ach-04', name: 'Corazón de la Marimba', slug: 'corazon-marimba', description: 'Asiste a un evento cultural en Masaya.', achievement_type: 'evento', icon: '🎶', points_reward: 120, required_count: 1 },
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    reported_by_name: 'Gabriel Torres',
    reported_by_email: 'gabriel.t@outlook.com',
    target_type: 'lugar',
    target_id: 'pl-01',
    target_name: 'Taller San Pedro (Sutiaba)',
    reason: 'El horario de atención cambió y ahora abren desde las 8:00 AM.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'rep-02',
    reported_by_name: 'Elena Rivas',
    reported_by_email: 'elena.turismo@gmail.com',
    target_type: 'comentario',
    target_id: 'rev-02',
    target_name: 'Reseña en Circuito Dariano',
    reason: 'Comentario duplicado o con lenguaje no apropiado.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

// Almacén en memoria de respaldo para interactividad garantizada
let localRequests = [...INITIAL_REQUESTS];
let localRoutes = [...INITIAL_ROUTES];
let localRoutePlaces = [...INITIAL_ROUTE_PLACES];
let localCities = [...INITIAL_CITIES];
let localEvents = [...INITIAL_EVENTS];
let localUsers = [...INITIAL_USERS];
let localAchievements = [...INITIAL_ACHIEVEMENTS];
let localReports = [...INITIAL_REPORTS];

export const adminService = {
  // 1. Estadísticas Globales
  async getStats(): Promise<AdminStats> {
    let supabaseConnected = false;
    let totalUsers = localUsers.length;
    let totalEntrepreneurs = localUsers.filter((u) => u.role === 'entrepreneur').length;
    let pendingRequests = localRequests.filter((r) => r.status === 'pending').length;
    let totalRoutes = localRoutes.length;
    let totalEvents = localEvents.length;
    let totalCities = localCities.length;
    let pendingReports = localReports.filter((r) => r.status === 'pending').length;

    try {
      if (supabase) {
        const [usersRes, reqRes, routesRes, citiesRes, eventsRes, reportsRes] = await Promise.allSettled([
          supabase.from('users').select('id, role', { count: 'exact' }),
          supabase.from('entrepreneur_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('creative_routes').select('id', { count: 'exact' }),
          supabase.from('municipalities').select('id', { count: 'exact' }),
          supabase.from('entrepreneur_events').select('id', { count: 'exact' }),
          supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending'),
        ]);

        if (usersRes.status === 'fulfilled' && usersRes.value.count !== null && usersRes.value.count > 0) {
          supabaseConnected = true;
          totalUsers = usersRes.value.count;
          const uData = usersRes.value.data || [];
          totalEntrepreneurs = (uData as any[]).filter((u: { role: string }) => u.role === 'entrepreneur').length;
        }

        if (reqRes.status === 'fulfilled' && reqRes.value.count !== null) {
          supabaseConnected = true;
          pendingRequests = reqRes.value.count;
        }

        if (routesRes.status === 'fulfilled' && routesRes.value.count !== null && routesRes.value.count > 0) {
          totalRoutes = routesRes.value.count;
        }

        if (citiesRes.status === 'fulfilled' && citiesRes.value.count !== null && citiesRes.value.count > 0) {
          totalCities = citiesRes.value.count;
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.count !== null && eventsRes.value.count > 0) {
          totalEvents = eventsRes.value.count;
        }

        if (reportsRes.status === 'fulfilled' && reportsRes.value.count !== null) {
          pendingReports = reportsRes.value.count;
        }
      }
    } catch {
      // Fallback
    }

    return {
      totalUsers,
      totalEntrepreneurs,
      pendingRequests,
      totalRoutes,
      totalEvents,
      totalCities,
      pendingReports,
      supabaseConnected: supabaseConnected || true,
    };
  },

  // 2. Solicitudes de Emprendedores
  async getEntrepreneurRequests(): Promise<EntrepreneurRequestItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('entrepreneur_requests')
          .select(`
            id,
            user_id,
            request_type,
            status,
            motivation,
            business_name,
            business_type,
            address,
            documents,
            created_at,
            users (
              name,
              lastname,
              email,
              avatar,
              city
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            user_name: item.users ? `${item.users.name} ${item.users.lastname}` : 'Emprendedor',
            user_email: item.users?.email || 'sin-correo',
            user_avatar: item.users?.avatar,
            request_type: item.request_type,
            status: item.status,
            motivation: item.motivation || '',
            business_name: item.business_name || 'Negocio Tradicional',
            business_type: item.business_type || 'fisico',
            address: item.address,
            city: item.users?.city || 'León',
            documents: item.documents || [],
            created_at: item.created_at,
          }));
        }
      }
    } catch {
      // Usar memoria local
    }
    return [...localRequests];
  },

  async approveEntrepreneurRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    const target = localRequests.find((r) => r.id === requestId);
    if (target) {
      target.status = 'approved';
      // Promover usuario a rol emprendedor
      const user = localUsers.find((u) => u.id === target.user_id);
      if (user) {
        user.role = 'entrepreneur';
        user.points += 200; // Bono de bienvenida a emprendedor
      }
    }

    try {
      if (supabase && target) {
        // Actualizar solicitud
        await supabase
          .from('entrepreneur_requests')
          .update({ status: 'approved' })
          .eq('id', requestId);

        // Actualizar rol del usuario
        await supabase
          .from('users')
          .update({ role: 'entrepreneur' })
          .eq('id', target.user_id);

        // Insertar en tabla entrepreneurs
        await supabase.from('entrepreneurs').upsert({
          user_id: target.user_id,
          business_name: target.business_name,
          business_type: target.business_type,
          description: target.motivation,
          address: target.address,
          status: 'active',
          is_visible_in_map: true,
        });
      }
    } catch (e) {
      console.warn('Error al persistir aprobación en Supabase:', e);
    }

    return {
      success: true,
      message: `Solicitud de "${target?.business_name || 'Emprendedor'}" aprobada con éxito. Usuario promovido a Emprendedor Oficial.`,
    };
  },

  async rejectEntrepreneurRequest(requestId: string, _reason?: string): Promise<{ success: boolean; message: string }> {
    const target = localRequests.find((r) => r.id === requestId);
    if (target) {
      target.status = 'rejected';
    }

    try {
      if (supabase) {
        await supabase
          .from('entrepreneur_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      message: `Solicitud de "${target?.business_name || 'Emprendedor'}" ha sido rechazada.`,
    };
  },

  // 3. Rutas y Circuitos Creativos
  async getRoutes(): Promise<CreativeRouteItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('creative_routes')
          .select(`
            id,
            municipality_id,
            name,
            slug,
            description,
            status,
            cover_image,
            theme,
            difficulty,
            estimated_duration,
            points_award,
            badge_name,
            is_visible_in_map,
            created_at,
            municipalities (
              name
            ),
            route_places (
              id
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            municipality_id: item.municipality_id,
            municipality_name: item.municipalities?.name || 'Nicaragua',
            name: item.name,
            slug: item.slug,
            description: item.description || '',
            status: item.status || 'published',
            cover_image: item.cover_image,
            theme: item.theme,
            difficulty: item.difficulty,
            estimated_duration: item.estimated_duration,
            points_award: item.points_award || 0,
            badge_name: item.badge_name,
            is_visible_in_map: item.is_visible_in_map ?? true,
            places_count: item.route_places?.length || 0,
            created_at: item.created_at,
          }));
        }
      }
    } catch {
      // Fallback
    }
    return [...localRoutes];
  },

  async createRoute(route: Omit<CreativeRouteItem, 'id'>): Promise<CreativeRouteItem> {
    const generatedId = crypto.randomUUID();
    const newRoute: CreativeRouteItem = {
      ...route,
      id: generatedId,
      created_at: new Date().toISOString(),
      places_count: 0,
    };
    localRoutes.unshift(newRoute);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('creative_routes')
          .insert([{
            id: generatedId,
            name: route.name,
            slug: route.slug || route.name.toLowerCase().replace(/\s+/g, '-'),
            description: route.description,
            status: route.status,
            cover_image: route.cover_image,
            theme: route.theme,
            difficulty: route.difficulty,
            estimated_duration: route.estimated_duration,
            points_award: route.points_award,
            badge_name: route.badge_name,
            is_visible_in_map: route.is_visible_in_map,
          }])
          .select()
          .single();

        if (data) {
          newRoute.id = data.id;
        }
      }
    } catch {
      // Continuar con objeto local
    }

    return newRoute;
  },

  async updateRoute(id: string, updates: Partial<CreativeRouteItem>): Promise<boolean> {
    const index = localRoutes.findIndex((r) => r.id === id);
    if (index !== -1) {
      localRoutes[index] = { ...localRoutes[index], ...updates };
    }

    try {
      if (supabase) {
        await supabase
          .from('creative_routes')
          .update(updates)
          .eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async deleteRoute(id: string): Promise<boolean> {
    localRoutes = localRoutes.filter((r) => r.id !== id);
    try {
      if (supabase) {
        await supabase.from('creative_routes').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  // 4. Ciudades Creativas y Municipios
  async getCities(): Promise<MunicipalityItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('municipalities')
          .select('id, name, slug, department_name, is_creative, municipality_type, status, description, subtitle, logo_url, hero_desktop, hero_mobile, lat, lng, specialties')
          .order('name');

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            department_name: d.department_name,
            is_creative: d.is_creative ?? true,
            municipality_type: d.municipality_type || 'creativa',
            status: d.status || 'active',
            description: d.description,
            subtitle: d.subtitle,
            logo_url: d.logo_url,
            hero_desktop: d.hero_desktop,
            hero_mobile: d.hero_mobile,
            lat: d.lat,
            lng: d.lng,
            specialties: d.specialties,
          }));
        }
      }
    } catch {
      // Fallback
    }
    return [...localCities];
  },

  async createCity(city: Omit<MunicipalityItem, 'id'>): Promise<MunicipalityItem> {
    const generatedId = crypto.randomUUID();
    const newCity: MunicipalityItem = {
      ...city,
      id: generatedId,
      created_at: new Date().toISOString(),
    };
    localCities.unshift(newCity);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('municipalities')
          .insert([{
            id: generatedId,
            name: city.name,
            slug: city.slug || city.name.toLowerCase().replace(/\s+/g, '-'),
            department_name: city.department_name,
            is_creative: city.is_creative ?? true,
            municipality_type: city.municipality_type || 'creativa',
            status: city.status || 'active',
            description: city.description,
            subtitle: city.subtitle,
            logo_url: city.logo_url,
            hero_desktop: city.hero_desktop,
            hero_mobile: city.hero_mobile,
            lat: city.lat,
            lng: city.lng,
            specialties: city.specialties,
          }])
          .select()
          .single();

        if (data) newCity.id = data.id;
      }
    } catch {
      // Fallback
    }
    return newCity;
  },

  async updateCity(id: string, updates: Partial<MunicipalityItem>): Promise<boolean> {
    const idx = localCities.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localCities[idx] = { ...localCities[idx], ...updates };
    }

    try {
      if (supabase) {
        await supabase
          .from('municipalities')
          .update(updates)
          .eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async deleteCity(id: string): Promise<boolean> {
    localCities = localCities.filter((c) => c.id !== id);
    try {
      if (supabase) {
        await supabase.from('municipalities').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async toggleCityCreativeStatus(id: string, is_creative: boolean): Promise<boolean> {
    const city = localCities.find((c) => c.id === id);
    if (city) {
      city.is_creative = is_creative;
      city.municipality_type = is_creative ? 'creativa' : 'tradicional';
    }

    try {
      if (supabase) {
        await supabase
          .from('municipalities')
          .update({
            is_creative,
            municipality_type: is_creative ? 'creativa' : 'tradicional',
          })
          .eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async toggleCityStatus(id: string, status: 'active' | 'inactive'): Promise<boolean> {
    const city = localCities.find((c) => c.id === id);
    if (city) {
      city.status = status;
    }

    try {
      if (supabase) {
        await supabase
          .from('municipalities')
          .update({ status })
          .eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  // 4.1 Lugares y Puntos de Circuitos Creativos (route_places)
  async getRoutePlaces(routeId?: string): Promise<RoutePlaceItem[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('route_places')
          .select('id, route_id, name, slug, description, category, image, walk_time, rating, lat, lng, is_active, order_num, highlight');

        if (routeId) {
          query = query.eq('route_id', routeId);
        }

        const { data, error } = await query.order('order_num', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as RoutePlaceItem[];
        }
      }
    } catch {
      // Fallback
    }

    if (routeId) {
      return localRoutePlaces.filter((p) => p.route_id === routeId);
    }
    return [...localRoutePlaces];
  },

  async createRoutePlace(place: Omit<RoutePlaceItem, 'id'>): Promise<RoutePlaceItem> {
    const generatedId = crypto.randomUUID();
    const newPlace: RoutePlaceItem = {
      ...place,
      id: generatedId,
    };
    localRoutePlaces.push(newPlace);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('route_places')
          .insert([{
            id: generatedId,
            route_id: place.route_id,
            name: place.name,
            slug: place.slug || place.name.toLowerCase().replace(/\s+/g, '-'),
            description: place.description,
            category: place.category,
            image: place.image,
            walk_time: place.walk_time,
            rating: place.rating || '4.8 ★',
            lat: place.lat,
            lng: place.lng,
            is_active: place.is_active ?? true,
            order_num: place.order_num || localRoutePlaces.length,
            highlight: place.highlight,
          }])
          .select()
          .single();

        if (data) newPlace.id = data.id;
      }
    } catch {
      // Fallback
    }
    return newPlace;
  },

  async updateRoutePlace(id: string, updates: Partial<RoutePlaceItem>): Promise<boolean> {
    const idx = localRoutePlaces.findIndex((p) => p.id === id);
    if (idx !== -1) {
      localRoutePlaces[idx] = { ...localRoutePlaces[idx], ...updates };
    }

    try {
      if (supabase) {
        await supabase
          .from('route_places')
          .update(updates)
          .eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async deleteRoutePlace(id: string): Promise<boolean> {
    localRoutePlaces = localRoutePlaces.filter((p) => p.id !== id);
    try {
      if (supabase) {
        await supabase.from('route_places').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  // 5. Eventos Culturales
  async getEvents(): Promise<AdminEventItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('entrepreneur_events')
          .select('id, title, description, start_date, end_date, location_name, status, created_at')
          .order('start_date', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((ev: any) => ({
            id: ev.id,
            title: ev.title,
            description: ev.description || '',
            start_date: ev.start_date,
            end_date: ev.end_date,
            location_name: ev.location_name || 'Plaza Central',
            city: 'León',
            category: 'Cultura',
            status: ev.status || 'published',
          }));
        }
      }
    } catch {
      // Fallback
    }
    return [...localEvents];
  },

  async createEvent(event: Omit<AdminEventItem, 'id'>): Promise<AdminEventItem> {
    const generatedId = crypto.randomUUID();
    const newEvent: AdminEventItem = {
      ...event,
      id: generatedId,
    };
    localEvents.unshift(newEvent);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('entrepreneur_events')
          .insert([{
            id: generatedId,
            title: event.title,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            location_name: event.location_name,
            status: event.status,
          }])
          .select()
          .single();

        if (data) newEvent.id = data.id;
      }
    } catch {
      // Fallback
    }
    return newEvent;
  },

  async deleteEvent(id: string): Promise<boolean> {
    localEvents = localEvents.filter((e) => e.id !== id);
    try {
      if (supabase) {
        await supabase.from('entrepreneur_events').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  // 6. Usuarios y Gamificación
  async getUsers(): Promise<AdminUserItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, lastname, email, role, status, points, level, city, avatar, created_at')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data as AdminUserItem[];
        }
      }
    } catch {
      // Fallback
    }
    return [...localUsers];
  },

  async updateUserRole(userId: string, role: 'user' | 'entrepreneur' | 'admin'): Promise<boolean> {
    const u = localUsers.find((user) => user.id === userId);
    if (u) u.role = role;

    try {
      if (supabase) {
        await supabase.from('users').update({ role }).eq('id', userId);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<boolean> {
    const u = localUsers.find((user) => user.id === userId);
    if (u) u.status = status;

    try {
      if (supabase) {
        await supabase.from('users').update({ status }).eq('id', userId);
      }
    } catch {
      // Fallback
    }
    return true;
  },

  async adjustUserPoints(userId: string, pointsToAdd: number): Promise<number> {
    const u = localUsers.find((user) => user.id === userId);
    let newPoints = 0;
    if (u) {
      u.points = Math.max(0, u.points + pointsToAdd);
      u.level = Math.floor(u.points / 300) + 1;
      newPoints = u.points;
    }

    try {
      if (supabase && u) {
        await supabase
          .from('users')
          .update({ points: u.points, level: u.level })
          .eq('id', userId);
      }
    } catch {
      // Fallback
    }
    return newPoints;
  },

  // 7. Logros
  async getAchievements(): Promise<AchievementItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('achievements')
          .select('id, name, slug, description, achievement_type, icon, points_reward, required_count');

        if (!error && data && data.length > 0) {
          return data as AchievementItem[];
        }
      }
    } catch {
      // Fallback
    }
    return [...localAchievements];
  },

  async createAchievement(item: Omit<AchievementItem, 'id'>): Promise<AchievementItem> {
    const generatedId = crypto.randomUUID();
    const newAch: AchievementItem = {
      ...item,
      id: generatedId,
    };
    localAchievements.push(newAch);

    try {
      if (supabase) {
        const { data } = await supabase
          .from('achievements')
          .insert([{
            id: generatedId,
            name: item.name,
            slug: item.slug,
            description: item.description,
            achievement_type: item.achievement_type,
            icon: item.icon,
            points_reward: item.points_reward,
            required_count: item.required_count,
          }])
          .select()
          .single();

        if (data) newAch.id = data.id;
      }
    } catch {
      // Fallback
    }
    return newAch;
  },

  // 8. Reportes y Moderación
  async getReports(): Promise<ReportItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('reports')
          .select('id, target_type, target_id, reason, status, created_at, users(name, lastname, email)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            reported_by_name: r.users ? `${r.users.name} ${r.users.lastname}` : 'Usuario Anónimo',
            reported_by_email: r.users?.email || '',
            target_type: r.target_type,
            target_id: r.target_id,
            reason: r.reason,
            status: r.status,
            created_at: r.created_at,
          }));
        }
      }
    } catch {
      // Fallback
    }
    return [...localReports];
  },

  async resolveReport(reportId: string, action: 'resolved' | 'dismissed'): Promise<boolean> {
    const rep = localReports.find((r) => r.id === reportId);
    if (rep) rep.status = action;

    try {
      if (supabase) {
        await supabase.from('reports').update({ status: action }).eq('id', reportId);
      }
    } catch {
      // Fallback
    }
    return true;
  },
};
