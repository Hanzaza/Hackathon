export interface FeaturedEntrepreneur {
  id: string;
  name: string;
  slug: string;
  founder: string;
  founderRole: string;
  city: string;
  citySlug: string;
  category: 'Artesanía & Barro' | 'Café & Cacao' | 'Gastronomía Tradicional' | 'Calzado & Cuero' | 'Arte & Muralismo' | 'Moda & Textil' | 'Ecoturismo & Experiencias';
  tagline: string;
  description: string;
  imageUrl: string;
  founderAvatar: string;
  rating: number;
  reviewsCount: number;
  yearEstablished: number;
  specialties: string[];
  whatsapp: string;
  instagram: string;
  mapCoordinates: { lat: number; lng: number };
  isVerified: boolean;
  awardBadge?: string;
  quickQuote: string;
}

export interface InspiringStory {
  id: string;
  authorName: string;
  businessName: string;
  city: string;
  citySlug: string;
  category: string;
  avatarUrl: string;
  heroImageUrl: string;
  highlightQuote: string;
  themeTag: 'Superación' | 'Tradición Familiar' | 'Innovación Joven' | 'Liderazgo Femenino' | 'Impacto Comunitario';
  badgeColor: string;
  listenTime: string;
  fullStory: {
    start: string;
    turningPoint: string;
    goldenAdvice: string;
    impactMetric: string;
  };
}

export interface EntrepreneurAdvicePillar {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  description: string;
  actionTip: string;
}

export const FEATURED_ENTREPRENEURS: FeaturedEntrepreneur[] = [
  {
    id: 'ceramica-mendoza-sjo',
    name: 'Taller & Galería Cerámica Mendoza',
    slug: 'ceramica-mendoza-sjo',
    founder: 'Dora & Luis Mendoza',
    founderRole: 'Maestros Alfareros de 3ra Generación',
    city: 'San Juan de Oriente',
    citySlug: 'san-juan-de-oriente',
    category: 'Artesanía & Barro',
    tagline: 'Esculturas precolombinas y jarrones esmaltados a mano con tintes minerales naturales.',
    description: 'Nacido en el seno de una familia alfarera ancestral de San Juan de Oriente, este taller ha transformado el barro local en piezas de colección internacional, fusionando la mitología náhuatl con el diseño contemporáneo.',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 148,
    yearEstablished: 2012,
    specialties: ['Torno Tradicional', 'Bruñido a Mano', 'Pinturas Naturales', 'Clases de Alfarería'],
    whatsapp: '+50588880001',
    instagram: '@ceramicamendoza.ni',
    mapCoordinates: { lat: 11.9056, lng: -86.0784 },
    isVerified: true,
    awardBadge: 'Premio Nacional a la Excelencia Artesanal',
    quickQuote: 'El barro te enseña paciencia: cuando una pieza se quiebra, la vuelves a moldear con más sabiduría.',
  },
  {
    id: 'cafe-la-cumbre-matagalpa',
    name: 'Café & Tostaduría La Cumbre',
    slug: 'cafe-la-cumbre-matagalpa',
    founder: 'Elena Rostrán & Marcos Gómez',
    founderRole: 'Catadores Q-Grader y Caficultores',
    city: 'Matagalpa',
    citySlug: 'matagalpa',
    category: 'Café & Cacao',
    tagline: 'Micro-lotes de café de altura cosechado bajo sombra en las brumas del Macizo de Peñas Blancas.',
    description: 'Elena y Marcos iniciaron tostando 5 libras semanales en un fogón de leña. Hoy procesan cafés especiales con procesos Honey y Naturales que han llegado a cafeterías de especialidad en 4 países.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 230,
    yearEstablished: 2018,
    specialties: ['Café de Especialidad 88+ pts', 'Proceso Geisha Natural', 'Catas Guiadas', 'Venta en Grano y Molido'],
    whatsapp: '+50588880002',
    instagram: '@cafelacumbre.ni',
    mapCoordinates: { lat: 12.9256, lng: -85.9178 },
    isVerified: true,
    awardBadge: 'Taza de la Excelencia Top 5',
    quickQuote: 'El verdadero valor no está en vender más barato, sino en contar la historia de amor detrás de cada grano.',
  },
  {
    id: 'hamacas-monimbo-masaya',
    name: 'Tejidos y Hamacas El Sol de Monimbó',
    slug: 'hamacas-monimbo-masaya',
    founder: 'Silvia Pavón & Don Silvio',
    founderRole: 'Tejedores de Telar de Madera',
    city: 'Masaya',
    citySlug: 'masaya',
    category: 'Calzado & Cuero',
    tagline: 'Hamacas matrimoniales tejidas hilo a hilo en algodón suave con flecos y maderas preciosas.',
    description: 'Ubicados en el legendario barrio indígena de Monimbó, esta familia preserva la técnica ancestral del urdido a dos agujas. Cada hamaca toma hasta dos semanas de trabajo minucioso y dedicación total.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 185,
    yearEstablished: 2005,
    specialties: ['Hamacas de Macramé', 'Sillas Colgantes', 'Cojines Bordados', 'Envíos Nacionales'],
    whatsapp: '+50588880003',
    instagram: '@hamacasmonimbo.ni',
    mapCoordinates: { lat: 11.9744, lng: -86.0942 },
    isVerified: true,
    awardBadge: 'Patrimonio Vivo de Masaya',
    quickQuote: 'Tejer una hamaca es tejer abrazos y memorias que durarán décadas en el hogar de quien la lleva.',
  },
  {
    id: 'murales-esteli-arte',
    name: 'Colectivo & Galería Pinceles del Diamante',
    slug: 'murales-esteli-arte',
    founder: 'Carlos Rizo & Maynor Valdivia',
    founderRole: 'Artistas Visuales y Talleristas',
    city: 'Estelí',
    citySlug: 'esteli',
    category: 'Arte & Muralismo',
    tagline: 'Pinturas al óleo, acuarelas y tours guiados por la capital muralista de Nicaragua.',
    description: 'Jóvenes artistas norteños que transformaron paredes urbanas en lienzos de identidad y memoria. Crearon una galería independiente donde imparten talleres gratuitos a niños y jóvenes de barrios vulnerables.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 92,
    yearEstablished: 2020,
    specialties: ['Obras de Autor', 'Muralismo Comunitario', 'Retratos en Acuarela', 'Souvenirs de Arte'],
    whatsapp: '+50588880004',
    instagram: '@pincelesdeldiamante.ni',
    mapCoordinates: { lat: 13.0919, lng: -86.3539 },
    isVerified: true,
    awardBadge: 'Reconocimiento Creatividad Juvenil 2024',
    quickQuote: 'Nos decían que del arte no se podía vivir; hoy alimentamos a nuestras familias y llenamos de color al país.',
  },
  {
    id: 'quesillos-don-chepe-nagarote',
    name: 'Quesillos Tradicionales Don Chepe',
    slug: 'quesillos-don-chepe-nagarote',
    founder: 'Doña Amparo & Familia Morales',
    founderRole: 'Maestras Quesilleras',
    city: 'Nagarote',
    citySlug: 'nagarote',
    category: 'Gastronomía Tradicional',
    tagline: 'Quesillo de trenza caliente con crema fresca de campo, cebollita en vinagre de guineo y tiste helado.',
    description: 'Una parada obligatoria en la ruta hacia Occidente. Con más de 30 años de tradición lechera, Don Chepe mantiene el punto exacto de la cuajada estirada y la crema pura de finca.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 340,
    yearEstablished: 1994,
    specialties: ['Quesillo en Hoja de Chigüilote', 'Tiste Casero con Cacao', 'Cosa de Horno', 'Crema de Campo'],
    whatsapp: '+50588880005',
    instagram: '@quesillosdonchepe.ni',
    mapCoordinates: { lat: 12.2664, lng: -86.5647 },
    isVerified: true,
    awardBadge: 'Orgullo Gastronómico Nacional',
    quickQuote: 'El secreto está en servir cada quesillo con la misma sonrisa y cariño con que atiendes a tu propia familia.',
  },
  {
    id: 'chocolates-mombacho-granada',
    name: 'Chocolatería Artesanal Mombacho Cacao',
    slug: 'chocolates-mombacho-granada',
    founder: 'Alejandro Chamorro & Claudia Ruiz',
    founderRole: 'Chocolatiers & Diseñadores',
    city: 'Granada',
    citySlug: 'granada',
    category: 'Café & Cacao',
    tagline: 'Barras de chocolate fino de aroma bean-to-bar con inclusiones de café maragogipe y cardamomo.',
    description: 'En el centro colonial de Granada, Mombacho Cacao trabaja directamente con cooperativas de agricultores de Río San Juan y Matagalpa, rescatando genéticas criollas de cacao fino de aroma.',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 215,
    yearEstablished: 2017,
    specialties: ['Barras 70% & 85% Cacao Puro', 'Bombones de Fruta de la Pasión', 'Tours de Cacao', 'Bebidas de Cacao Ancestral'],
    whatsapp: '+50588880006',
    instagram: '@mombachocacao.ni',
    mapCoordinates: { lat: 11.9299, lng: -85.9560 },
    isVerified: true,
    awardBadge: 'Medalla de Oro International Chocolate Awards',
    quickQuote: 'El cacao es el oro de nuestros antepasados. Reivindicarlo es honrar nuestra identidad más profunda.',
  },
  {
    id: 'textil-caribeno-bluefields',
    name: 'Diseños & Telas Afro-Caribeñas Downs',
    slug: 'textil-caribeno-bluefields',
    founder: 'Yamileth Downs & Colectivo de Costureras',
    founderRole: 'Diseñadora de Moda Caribeña',
    city: 'Bluefields',
    citySlug: 'bluefields',
    category: 'Moda & Textil',
    tagline: 'Prendas coloridas y accesorios confeccionados con estampados afrodescendientes y fibras naturales.',
    description: 'Uniendo los vibrantes colores del Caribe nicaragüense con cortes contemporáneos y turbantes tradicionales. Un proyecto que empodera a mujeres jefas de hogar en el barrio Cotton Tree de Bluefields.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 76,
    yearEstablished: 2021,
    specialties: ['Vestidos Afro-Roots', 'Turbantes Estilizados', 'Bolsos de Fibras de Coco', 'Prendas a Medida'],
    whatsapp: '+50588880007',
    instagram: '@downsdesigns.bluefields',
    mapCoordinates: { lat: 12.0137, lng: -83.7635 },
    isVerified: true,
    awardBadge: 'Innovación Textil Regional 2023',
    quickQuote: 'La belleza de nuestra cultura afrocaribeña merece brillar en cada vitrina de Nicaragua y el mundo.',
  },
  {
    id: 'dulceria-solar-leones',
    name: 'Dulcería & Repostería El Solar Dariano',
    slug: 'dulceria-solar-leones',
    founder: 'Javier Castillo & Doña Mercedes',
    founderRole: 'Custodios de la Dulcería Tradicional',
    city: 'León',
    citySlug: 'leon',
    category: 'Gastronomía Tradicional',
    tagline: 'Cajetas de leche, almíbares de temporada, bienmesabe y leche de burra en casona de tejas centenarias.',
    description: 'Frente al barrio El Calvario en León, el Solar Dariano recrea las recetas coloniales que deleitaron a Rubén Darío. Elaboran todo en peroles de cobre a fuego lento de leña de nancite.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80',
    founderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 162,
    yearEstablished: 1999,
    specialties: ['Cajeta de Coco Rosada', 'Bienmesabe Leonés', 'Almíbar de Semana Santa', 'Cajas de Regalo Típicas'],
    whatsapp: '+50588880008',
    instagram: '@elsolardariano.ni',
    mapCoordinates: { lat: 12.4345, lng: -86.8770 },
    isVerified: true,
    awardBadge: 'Sabor Tradicional Leonés',
    quickQuote: 'La dulzura de nuestra tierra une a las familias. Emprender es mantener vivos los recuerdos de la abuela.',
  },
];

export const INSPIRING_STORIES: InspiringStory[] = [
  {
    id: 'historia-dora-mendoza',
    authorName: 'Dora Mendoza',
    businessName: 'Taller de Cerámica Mendoza',
    city: 'San Juan de Oriente',
    citySlug: 'san-juan-de-oriente',
    category: 'Artesanía en Barro',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80',
    highlightQuote: 'Cuando el primer horno se apagó y perdimos toda la producción, lloré tres días. Pero el barro me enseñó que se vuelve a amasar con más fe.',
    themeTag: 'Superación',
    badgeColor: 'bg-amber-500 text-white',
    listenTime: '4 min de lectura / audio',
    fullStory: {
      start: 'Comencé a los 19 años con un torno de madera que me heredó mi abuelo. No teníamos dinero para esmaltes industriales ni local comercial; vendíamos a la orilla del camino bajo el sol.',
      turningPoint: 'En el 2018 las ventas cayeron a cero y un invierno lluvioso destruyó nuestro horno de barro. Pensé en cerrar y migrar. Sin embargo, mis vecinas artesanas me prestaron arcilla y entre todos levantamos un nuevo horno de leña. Decidí abrir una cuenta de redes sociales y crear diseños que mezclaban motivos chorotegas con formas minimalistas. En 6 meses recibimos nuestro primer pedido desde Europa.',
      goldenAdvice: 'Para los que están empezando hoy con dudas y poco dinero: No esperen tener el taller perfecto para arrancar. Su mayor capital es la historia que llevan en sus manos. Si tu producto tiene verdad y alma, la gente lo siente y te apoyará.',
      impactMetric: 'Hoy empleamos a 9 artesanos jóvenes de San Juan de Oriente y exportamos a 3 continentes.',
    },
  },
  {
    id: 'historia-marcos-elena',
    authorName: 'Elena Rostrán y Marcos Gómez',
    businessName: 'Café La Cumbre',
    city: 'Matagalpa',
    citySlug: 'matagalpa',
    category: 'Caficultura de Especialidad',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    highlightQuote: 'Nos decían: "¿Quién va a pagar por un café empacado si en la pulpería es barato?". Hoy demostramos que la calidad nicaragüense no tiene techo.',
    themeTag: 'Innovación Joven',
    badgeColor: 'bg-emerald-600 text-white',
    listenTime: '5 min de lectura / audio',
    fullStory: {
      start: 'Teníamos una pequeña parcela heredada y ningún conocimiento de marketing. Tostábamos en un comal y empacábamos en bolsas transparentes con etiquetas escritas a mano.',
      turningPoint: 'Muchos intermediarios nos pagaban una miseria por el quintal de café en cereza. Nos endeudamos con un microcrédito para certificarnos como catadores y comprar una selladora de calor. Pasamos noches enteras estudiando curvas de tueste y perfiles sensoriales. Cuando enviamos muestras a un concurso nacional y ganamos medalla de plata, todo cambió.',
      goldenAdvice: 'No compitas por precio; compite por excelencia, por transparencia y por servicio. La gente no compra solo café, compra el esfuerzo de las familias campesinas que madrugan en la montaña. Cree en lo tuyo.',
      impactMetric: 'Compramos a precio justo a 18 pequeños caficultores asociados y abrimos nuestra primera tostaduría escuela.',
    },
  },
  {
    id: 'historia-silvia-pavon',
    authorName: 'Silvia Pavón',
    businessName: 'Hamacas El Sol de Monimbó',
    city: 'Masaya',
    citySlug: 'masaya',
    category: 'Tejido Tradicional de Monimbó',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&auto=format&fit=crop&q=80',
    highlightQuote: 'En Monimbó el trabajo es sagrado. Ser mujer y liderar un taller de 15 tejedores fue un reto gigante, pero la constancia vence cualquier duda.',
    themeTag: 'Liderazgo Femenino',
    badgeColor: 'bg-rose-600 text-white',
    listenTime: '3 min de lectura / audio',
    fullStory: {
      start: 'Aprendí a urdir a los 8 años sentada en el suelo del taller de mi abuela. Cuando me quedé como jefa de hogar con dos hijos pequeños, el telar fue mi único refugio y mi salvación.',
      turningPoint: 'Los clientes tradicionales dejaron de llegar a la tienda física y las deudas con proveedores de hilo de algodón se acumularon. Me uní a los programas de Economía Creativa del MEFCCA y aprendí a calcular costos reales y a fotografiar las hamacas con luz natural. Diseñamos modelos colgantes para apartamentos urbanos y el negocio revivió.',
      goldenAdvice: 'A las mujeres emprendedoras que tienen miedo: La valentía no es la ausencia de miedo, es dar el paso con el corazón latiendo fuerte. Confíen en sus manos, capacítense sin pena y apóyense entre compañeras.',
      impactMetric: '15 madres de familia monimboseñas tienen un ingreso digno y seguro gracias al taller.',
    },
  },
  {
    id: 'historia-carlos-rizo',
    authorName: 'Carlos Rizo',
    businessName: 'Pinceles del Diamante',
    city: 'Estelí',
    citySlug: 'esteli',
    category: 'Artes Visuales & Muralismo',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    highlightQuote: 'Cada mural terminado en un callejón olvidado le devuelve la dignidad a un barrio entero. El arte cura y también construye empresas.',
    themeTag: 'Impacto Comunitario',
    badgeColor: 'bg-indigo-600 text-white',
    listenTime: '4 min de lectura / audio',
    fullStory: {
      start: 'Salí de la secundaria con un block de dibujo y la insistencia de mi familia para que buscara un "trabajo de verdad". Pintaba rótulos comerciales por 100 córdobas para comprar pinturas acrílicas.',
      turningPoint: 'Nos juntamos 4 jóvenes y pedimos permiso a la municipalidad para pintar un muro deteriorado con la historia de los obreros del tabaco de Estelí. La foto se viralizó y los dueños de hoteles y restaurantes empezaron a contratarnos para decorar sus fachadas y crear galerías vivas. Formalizamos nuestra cooperativa cultural.',
      goldenAdvice: 'Si tienes un talento artístico, trátalo con profesionalismo desde el día uno: cumple tus plazos, haz contratos claros y ponle precio digno a tus horas de creación. Tu talento vale.',
      impactMetric: 'Más de 45 murales emblemáticos pintados y 60 jóvenes becados en talleres de pintura comunitaria.',
    },
  },
  {
    id: 'historia-yamileth-downs',
    authorName: 'Yamileth Downs',
    businessName: 'Diseños Afro-Caribeños Downs',
    city: 'Bluefields',
    citySlug: 'bluefields',
    category: 'Diseño Textil & Moda Afro',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
    highlightQuote: 'Nuestros patrones textiles no son solo ropa: son la voz de nuestros ancestros que cruzaron el mar y sembraron esperanza en esta costa.',
    themeTag: 'Tradición Familiar',
    badgeColor: 'bg-cyan-700 text-white',
    listenTime: '4 min de lectura / audio',
    fullStory: {
      start: 'Crecí viendo a mi tía coser trajes para el festival de Mayo Ya en Bluefields. Siempre soñé con que esa alegría y fuerza visual se pudiera vestir todos los días del año, en la oficina y en las calles.',
      turningPoint: 'El costo del flete para traer telas y enviar prendas a Managua era muy alto. Tuvimos que aprender a optimizar patrones para cero desperdicio y asociarnos con otras 5 costureras locales. Al participar en Nicaragua Diseña, logramos una ovación de pie y contratos para distribuir en tiendas de diseño de todo el país.',
      goldenAdvice: 'No escondas lo que te hace diferente ni intentes copiar lo que se hace afuera. Tu singularidad geográfica y cultural es tu mayor ventaja en el mercado. Sé orgullosamente auténtico.',
      impactMetric: 'Un colectivo de 8 costureras y artesanas costeñas con presencia en plataformas nacionales de moda.',
    },
  },
];

export const ADVICE_PILLARS: EntrepreneurAdvicePillar[] = [
  {
    id: 1,
    number: '01',
    title: 'Empieza con lo que tienes a mano',
    subtitle: 'La acción vence a la parálisis por perfección',
    iconName: 'Sparkles',
    color: 'from-amber-500 to-orange-500',
    description: 'No necesitas un local gigante ni equipos de última generación para dar el primer paso. Valida tu producto con tus primeros 10 clientes reales y reinvierte cada córdoba con disciplina.',
    actionTip: 'Pregúntate hoy: ¿Cuál es el paso más pequeño que puedo dar en las próximas 24 horas para mostrar mi producto?',
  },
  {
    id: 2,
    number: '02',
    title: 'Tu identidad cultural es tu superpoder',
    subtitle: 'Lo auténtico no se puede falsificar',
    iconName: 'Compass',
    color: 'from-emerald-500 to-teal-600',
    description: 'En un mundo saturado de productos genéricos, las tradiciones, recetas de la abuela, técnicas de barro o bordado de nuestras Ciudades Creativas tienen un valor incalculable para el consumidor consciente.',
    actionTip: 'Escribe en 2 oraciones la historia y origen de tu receta o técnica artesanal para ponerla en tu empaque o perfil.',
  },
  {
    id: 3,
    number: '03',
    title: 'Colabora, la red te hace invencible',
    subtitle: 'En la Economía Creativa crecemos juntos',
    iconName: 'Users',
    color: 'from-blue-500 to-indigo-600',
    description: 'El artesano que hace la taza necesita al caficultor que cultiva el grano y al diseñador que crea el empaque. En la Red de Ciudades Creativas, la alianza entre negocios multiplica las ventas de todos.',
    actionTip: 'Busca a otro emprendedor de tu ciudad este mes y propón un combo o promoción conjunta.',
  },
  {
    id: 4,
    number: '04',
    title: 'Capacítate sin parar y pierde el miedo a los números',
    subtitle: 'La creatividad necesita estructura',
    iconName: 'BookOpen',
    color: 'from-purple-500 to-pink-600',
    description: 'Aprende a calcular tus costos reales, a separar las finanzas personales de las del negocio y a aprovechar las capacitaciones gratuitas del MEFCCA, INATEC y la Secretaría de Economía Creativa.',
    actionTip: 'Descarga la Guía Oficial del Emprendedor disponible en esta página y revisa la plantilla de costos.',
  },
  {
    id: 5,
    number: '05',
    title: 'Digitaliza tu presencia y muéstrate en el mapa',
    subtitle: 'Si no te encuentran en el celular, no existes',
    iconName: 'MapPin',
    color: 'from-rose-500 to-red-600',
    description: 'Los turistas y locales buscan experiencias auténticas en sus teléfonos. Activa tu WhatsApp Business, sube fotos con buena luz de tus productos y mantén tu ubicación actualizada en los circuitos creativos.',
    actionTip: 'Solicita tu acreditación en nuestra plataforma para que tu negocio aparezca con pin verificado en el Mapa Inmersivo.',
  },
  {
    id: 6,
    number: '06',
    title: 'La resiliencia es el secreto de los grandes',
    subtitle: 'Los días difíciles son lecciones disfrazadas',
    iconName: 'HeartHandshake',
    color: 'from-teal-500 to-cyan-600',
    description: 'Todos los emprendedores veteranos tuvieron días en que no vendieron nada o en que las cosas salieron mal. Lo que separa al que triunfa del que se rinde es la capacidad de levantarse al día siguiente con amor renovado.',
    actionTip: 'Cuando sientas desánimo, vuelve a leer los testimonios de este portal y recuerda por qué empezaste este sueño.',
  },
];
