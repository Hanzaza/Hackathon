import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Landmark, 
  Award,
} from 'lucide-react';

interface CreativeCity {
  id: string;
  name: string;
  badge: string;
  slug: string;
  logo: string;
  tagline: string;
  description: string;
  specialties: string[];
  circuits: { name: string; desc: string }[];
  highlight: string;
  theme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    cardBg: string;
    buttonBg: string;
    buttonHover: string;
    accentColor: string;
    gradient: string;
  };
}

const CREATIVE_CITIES: CreativeCity[] = [
  {
    id: 'leon',
    name: 'León',
    badge: 'Ciudad del Aprendizaje UNESCO',
    slug: 'leon',
    logo: '/logos/leon.png',
    tagline: 'Capital Universitaria, Arte Mural y Cuna de Rubén Darío',
    description: 'León vibra con una energía histórica y literaria inigualable. Sus iglesias barrocas, la imponente Insigne y Real Basílica Catedral (Patrimonio de la Humanidad), sus murales revolucionarios y sus talleres artesanales forjan una identidad cultural de talla mundial.',
    specialties: ['Poesía & Literatura', 'Muralismo & Artes Plásticas', 'Gastronomía Tradicional', 'Artesanía Colonial'],
    circuits: [
      { name: 'Circuito Dariano', desc: 'Recorrido por la vida y obra del Príncipe de las Letras Castellanas.' },
      { name: 'Circuito Sutiabeño', desc: 'Herencia indígena, artesanía en madera y tradiciones ancestrales.' },
      { name: 'Ruta de los Murales Históricos', desc: 'Galería abierta de memoria gráfica y revolución.' }
    ],
    highlight: 'Catedral de León & Museo Rubén Darío',
    theme: {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-900',
      border: 'border-amber-200/80',
      cardBg: 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50',
      buttonBg: 'bg-amber-600',
      buttonHover: 'hover:bg-amber-700',
      accentColor: 'text-amber-700',
      gradient: 'from-amber-500 to-orange-600'
    }
  },
  {
    id: 'granada',
    name: 'Granada',
    badge: 'La Gran Sultana del Gran Lago',
    slug: 'granada',
    logo: '/logos/granada.png',
    tagline: 'Arquitectura Colonial, Literatura y Belleza Lacustre',
    description: 'Fundada en 1524, Granada es un tesoro arquitectónico con sus casas señoriales, calles empedradas y el majestuoso Lago Cocibolca. Es epicentro de festivales internacionales de poesía, talleres de imaginería y gastronomía centenaria.',
    specialties: ['Arquitectura Colonial', 'Poesía Internacional', 'Vigorón Tradicional', 'Pintura Primitivista'],
    circuits: [
      { name: 'Circuito La Gran Sultana', desc: 'Paseo peatonal por conventos, iglesias y plazas coloniales.' },
      { name: 'Circuito Isletas y Naturaleza', desc: 'Ruta en lancha explorando la biodiversidad y el archipiélago.' },
      { name: 'Ruta Gastronómica del Vigorón', desc: 'El sabor tradicional en el corazón del Parque Central.' }
    ],
    highlight: 'Convento San Francisco & Las Isletas de Granada',
    theme: {
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-900',
      border: 'border-rose-200/80',
      cardBg: 'bg-gradient-to-br from-rose-50/70 via-white to-red-50/40',
      buttonBg: 'bg-rose-700',
      buttonHover: 'hover:bg-rose-800',
      accentColor: 'text-rose-700',
      gradient: 'from-rose-600 to-red-700'
    }
  },
  {
    id: 'masaya',
    name: 'Masaya',
    badge: 'Cuna del Folklore Nacional',
    slug: 'masaya',
    logo: '/logos/masaya.png',
    tagline: 'Capital del Arte Popular, Marimbas y Tradición Viva',
    description: 'Corazón vibrante de las tradiciones nicaragüenses. Monimbó es símbolo de resistencia y creatividad comunitaria, cuna de los mejores lauderos, artesanos del cuero, hamacas tejidas y las fiestas más extensas y coloridas de Centroamérica.',
    specialties: ['Marimbas & Música Folklórica', 'Hamacas & Fibras Naturales', 'Danza Tradicional', 'Calzado & Cuero'],
    circuits: [
      { name: 'Circuito Manos Creativas de Monimbó', desc: 'Visita interactiva a talleres familiares de artesanía.' },
      { name: 'Ruta de las Máscaras y Agüizotes', desc: 'Tradición mística, teatro callejero y personajes míticos.' },
      { name: 'Paseo del Mercado de las Artesanías', desc: 'Epicentro cultural y compras de piezas autóctonas.' }
    ],
    highlight: 'Mercado de las Artesanías & Fiestas de San Jerónimo',
    theme: {
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-900',
      border: 'border-purple-200/80',
      cardBg: 'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40',
      buttonBg: 'bg-purple-700',
      buttonHover: 'hover:bg-purple-800',
      accentColor: 'text-purple-700',
      gradient: 'from-purple-600 to-pink-600'
    }
  },
  {
    id: 'san-juan-de-oriente',
    name: 'San Juan de Oriente',
    badge: 'Cuna de la Cerámica Precolombina',
    slug: 'san-juan-de-oriente',
    logo: '/logos/san-juan-de-oriente.png',
    tagline: 'Barro Ancestral, Maestría Alfarera y Miradores Mágicos',
    description: 'Un pueblo-taller donde más del 80% de sus familias dominan el arte de moldear el barro con técnicas milenarias. Sus piezas de cerámica bruñida y esculturas zoomorfas combinan la iconografía precolombina con innovadores diseños contemporáneos.',
    specialties: ['Cerámica Precolombina', 'Alfarería Fina', 'Artesanías en Barro', 'Miradores a la Laguna'],
    circuits: [
      { name: 'Circuito de los Maestros del Torno', desc: 'Talleres en vivo donde el barro cobra vida en minutos.' },
      { name: 'Ruta de la Cerámica Bruñida', desc: 'Técnicas de pulido con piedras de río y pigmentos naturales.' },
      { name: 'Sendero Mirador Laguna de Apoyo', desc: 'Paisajes panorámicos desde las alturas del cráter volcánico.' }
    ],
    highlight: 'Talleres Alfareros de la Calle de los Artesanos',
    theme: {
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-900',
      border: 'border-orange-200/80',
      cardBg: 'bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50',
      buttonBg: 'bg-orange-700',
      buttonHover: 'hover:bg-orange-800',
      accentColor: 'text-orange-700',
      gradient: 'from-orange-600 to-amber-700'
    }
  },
  {
    id: 'esteli',
    name: 'Estelí',
    badge: 'El Diamante de las Segovias',
    slug: 'esteli',
    logo: '/logos/esteli.png',
    tagline: 'Murales Heroicos, Industria del Puro y Música Norteña',
    description: 'Enclavada en el norte segoviano, Estelí es una ciudad dinámica con calles llenas de coloridos murales urbanos, una prestigiosa cultura tabacalera galardonada en todo el mundo y las melodiosas notas de las polkas, mazurcas y son nica.',
    specialties: ['Muralismo Callejero', 'Cultura del Puro Tabacalero', 'Música Campesina Norteña', 'Ecoturismo de Montaña'],
    circuits: [
      { name: 'Circuito de los Murales Segovianos', desc: 'Ruta a pie por cientos de expresiones de arte urbano.' },
      { name: 'Ruta del Tabaco de Clase Mundial', desc: 'Fábricas artesanales de puros y plantaciones premium.' },
      { name: 'Circuito Tisey - La Estanzuela', desc: 'Artesanía en piedra viva, cascadas y nebliselva.' }
    ],
    highlight: 'Fábricas de Tabaco & Esculturas de Piedra del Tisey',
    theme: {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-900',
      border: 'border-emerald-200/80',
      cardBg: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40',
      buttonBg: 'bg-emerald-700',
      buttonHover: 'hover:bg-emerald-800',
      accentColor: 'text-emerald-700',
      gradient: 'from-emerald-600 to-teal-700'
    }
  },
  {
    id: 'matagalpa',
    name: 'Matagalpa',
    badge: 'La Perla del Septentrión',
    slug: 'matagalpa',
    logo: '/logos/matagalpa.png',
    tagline: 'Tierra del Café Gourmet, Montañas Vivas y Mazurcas',
    description: 'Ciudad de bruma y montañas verdes, Matagalpa es el santuario del café gourmet de Nicaragua. Su riqueza combina el legado indígena de los flecheros, la música campesina de violines de talalate y haciendas ecológicas en bosques de niebla.',
    specialties: ['Café Gourmet de Altura', 'Música de Mazurcas & Polkas', 'Gastronomía Norteña', 'Ecoturismo Sostenible'],
    circuits: [
      { name: 'Circuito del Café y la Nebliselva', desc: 'Cata de café de especialidad y recorridos por fincas históricas.' },
      { name: 'Ruta de los Flecheros Matagalpas', desc: 'Historia ancestral de resistencia y cultura de montaña.' },
      { name: 'Sendero de las Flores y el Cacao', desc: 'Chocolatería artesanal y flora de montaña.' }
    ],
    highlight: 'Museo Nacional del Café & Reserva Selva Negra',
    theme: {
      badgeBg: 'bg-lime-100',
      badgeText: 'text-lime-900',
      border: 'border-lime-200/80',
      cardBg: 'bg-gradient-to-br from-lime-50/70 via-white to-emerald-50/40',
      buttonBg: 'bg-lime-800',
      buttonHover: 'hover:bg-lime-900',
      accentColor: 'text-lime-800',
      gradient: 'from-lime-700 to-emerald-800'
    }
  },
  {
    id: 'bluefields',
    name: 'Bluefields',
    badge: 'Capital Multiétnica del Caribe Sur',
    slug: 'bluefields',
    logo: '/logos/bluefields.png',
    tagline: 'Cultura Caribeña, Palo de Mayo y Tradición Costeña',
    description: 'Punto de encuentro de pueblos Creoles, Miskitos, Ramas, Garífunas y Mestizos. Bluefields deslumbra con la alegría de su Palo de Mayo (Maypole), sus casas de madera sobre pilotes, su música soca/calypso y su gastronomía con leche de coco.',
    specialties: ['Maypole & Baile Caribeño', 'Gastronomía Costeña (Rondón)', 'Artesanías en Palo Rosa', 'Cultura Multiétnica'],
    circuits: [
      { name: 'Circuito de la Bahía y Casas Creole', desc: 'Paseo arquitectónico caribeño y tradiciones afrodescendientes.' },
      { name: 'Ruta del Palo de Mayo', desc: 'Talleres de danza y festividades de bienvenida a la lluvia.' },
      { name: 'Circuito Sabores del Caribe', desc: 'Experiencia culinaria: Rondón, pan de coco y pati tradicional.' }
    ],
    highlight: 'Paseo Costeño de Bluefields & Fiesta del Maypole',
    theme: {
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-900',
      border: 'border-cyan-200/80',
      cardBg: 'bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/40',
      buttonBg: 'bg-cyan-700',
      buttonHover: 'hover:bg-cyan-800',
      accentColor: 'text-cyan-700',
      gradient: 'from-cyan-600 to-blue-700'
    }
  },
  {
    id: 'juigalpa',
    name: 'Juigalpa',
    badge: 'Tierra de Caracoles y Sabanas Chontaleñas',
    slug: 'juigalpa',
    logo: '/logos/juigalpa.png',
    tagline: 'Arqueología Amerindia, Cultura Taurina y Cordillera',
    description: 'En el corazón de Chontales, Juigalpa destaca por su impresionante patrimonio arqueológico de estatuaria precolombina, su profunda tradición ganadera y taurina, y la belleza escénica de la Cordillera de Amerrisque.',
    specialties: ['Arqueología Amerindia', 'Cultura Taurina & Hípica', 'Gastronomía Láctea', 'Paisajismo de Amerrisque'],
    circuits: [
      { name: 'Circuito Arqueológico Amerrisque', desc: 'Museo Gregorio Aguilar Barea con los mayores monolitos del país.' },
      { name: 'Ruta de la Tradición Taurina', desc: 'Corridas tradicionales, hípicos y música de filarmónicos.' },
      { name: 'Sendero Mirador Palo Solo', desc: 'Vista panorámica sobre los valles y sabanas de Chontales.' }
    ],
    highlight: 'Museo Arqueológico Gregorio Aguilar Barea',
    theme: {
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-900',
      border: 'border-yellow-200/80',
      cardBg: 'bg-gradient-to-br from-yellow-50/70 via-white to-amber-50/40',
      buttonBg: 'bg-yellow-700',
      buttonHover: 'hover:bg-yellow-800',
      accentColor: 'text-yellow-800',
      gradient: 'from-yellow-600 to-amber-700'
    }
  },
  {
    id: 'nagarote',
    name: 'Nagarote',
    badge: 'Municipio Azul y Limpio',
    slug: 'nagarote',
    logo: '/logos/nagarote.png',
    tagline: 'Cuna del Quesillo, Playas del Pacífico y Paseo de la Paz',
    description: 'Reconocido nacionalmente por su limpieza ejemplar, Nagarote es el hogar indiscutible del quesillo tradicional nicaragüense. Su territorio une la calidez de sus parques y plazas con espectaculares playas de surf en el océano Pacífico.',
    specialties: ['Quesillo Tradicional con Tiste', 'Playas de Surf (Miramar)', 'Artesanías en Conchas', 'Urbanismo Verde'],
    circuits: [
      { name: 'Circuito Gastronómico del Quesillo', desc: 'Ruta del quesillo en trenza con crema fresca y chicha/tiste.' },
      { name: 'Ruta de las Olas y Playas', desc: 'Surf y pesca deportiva en Miramar y Puerto Sandino.' },
      { name: 'Paseo de la Paz y los Parques', desc: 'Arquitectura vernácula y espacios públicos premiados.' }
    ],
    highlight: 'Paseo de la Paz & Quesilleras Tradicionales',
    theme: {
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-900',
      border: 'border-sky-200/80',
      cardBg: 'bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40',
      buttonBg: 'bg-sky-700',
      buttonHover: 'hover:bg-sky-800',
      accentColor: 'text-sky-700',
      gradient: 'from-sky-600 to-indigo-700'
    }
  },
  {
    id: 'managua',
    name: 'Managua',
    badge: 'Capital Creativa e Innovación Urbana',
    slug: 'managua',
    logo: '/logos/managua.png',
    tagline: 'Paisajismo Lacustre, Vanguardia y Centros Culturales',
    description: 'Managua fusiona el dinamismo de la capital con el patrimonio histórico frente al Lago Xolotlán. Sus teatros, museos, el histórico Palacio Nacional y sus paseos peatonales la convierten en el gran escenario cultural y artístico del país.',
    specialties: ['Teatro Nacional & Bellas Artes', 'Paseo Costanero Xolotlán', 'Música y Danza Contemporánea', 'Festivales Gastronómicos'],
    circuits: [
      { name: 'Circuito Patrimonial Plaza de la Revolución', desc: 'Catedral Antigua, Palacio de la Cultura y Museo de la Música.' },
      { name: 'Ruta del Paseo Xolotlán y Lago', desc: 'Casas museo, réplicas históricas y parques temáticos lacustres.' },
      { name: 'Circuito de la Laguna de Tiscapa', desc: 'Miradores urbanos, canopy y memoria del General Sandino.' }
    ],
    highlight: 'Teatro Nacional Rubén Darío & Palacio de la Cultura',
    theme: {
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-900',
      border: 'border-indigo-200/80',
      cardBg: 'bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/40',
      buttonBg: 'bg-indigo-700',
      buttonHover: 'hover:bg-indigo-800',
      accentColor: 'text-indigo-700',
      gradient: 'from-indigo-600 to-violet-700'
    }
  },
];

export default function CircuitosPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans pt-6 lg:pt-24 pb-36">
      
      {/* ================= 1. HERO DE BIENVENIDA A LAS CIUDADES CREATIVAS ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-slate-50 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 text-purple-900 text-xs font-black uppercase tracking-wider mb-6 shadow-sm border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>Red Nacional de Ciudades Creativas de Nicaragua</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] mb-6">
            Circuitos Culturales y{' '}
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Ciudades Creativas
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed mb-10">
            Bienvenido al recorrido oficial por las <strong>10 Ciudades Creativas de Nicaragua</strong>. Cada territorio resguarda una identidad viva, circuitos turísticos inmersivos, tradiciones centenarias y una red de artesanos y creadores listos para compartir su talento con vos.
          </p>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto mb-10">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-purple-700">10</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Ciudades Creativas</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-indigo-700">+35</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Circuitos Temáticos</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">100%</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Patrimonio Vivo</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-rose-700">+500</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Emprendedores Locales</span>
            </div>
          </div>

          {/* Barra de salto rápido por ciudades */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Explorar ciudad:</span>
            {CREATIVE_CITIES.map((city) => (
              <a
                key={city.id}
                href={`#ciudad-${city.id}`}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-purple-600 hover:text-white border border-slate-200/90 text-xs font-bold text-slate-700 transition-all shadow-sm active:scale-95"
              >
                {city.name}
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 2. LAS 10 SECCIONES DEDICADAS A CADA CIUDAD CREATIVA ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12 sm:space-y-16">
        {CREATIVE_CITIES.map((city, index) => {
          return (
            <section
              key={city.id}
              id={`ciudad-${city.id}`}
              className={`relative scroll-mt-28 rounded-[2.5rem] border ${city.theme.border} ${city.theme.cardBg} p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden`}
            >
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-gradient-to-br opacity-10 pointer-events-none blur-2xl" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LADO IZQUIERDO: LOGO, BRANDING E IDENTIDAD VISUAL */}
                <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-white shadow-sm">
                  
                  {/* Número de ciudad */}
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Ciudad #{index + 1}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${city.theme.badgeBg} ${city.theme.badgeText}`}>
                      {city.badge}
                    </span>
                  </div>

                  {/* Logo Grande y Destacado */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 my-3 drop-shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-300">
                    <Image
                      src={city.logo}
                      alt={`Logo de ${city.name}`}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-contain"
                    />
                  </div>

                  {/* Título y Tagline */}
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    {city.name}
                  </h3>
                  <p className={`text-xs font-bold ${city.theme.accentColor} mt-1 mb-4 leading-tight`}>
                    {city.tagline}
                  </p>

                  {/* Especialidades culturales */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                    {city.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-[10.5px] font-bold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Destacado principal */}
                  <div className="w-full mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                    <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{city.highlight}</span>
                  </div>
                </div>

                {/* LADO DERECHO: RESUMEN, CIRCUITOS CREATIVOS Y BOTÓN DE VISITA */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                  
                  {/* Encabezado descriptivo */}
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                      <Compass className="w-4 h-4 text-purple-600" />
                      <span>Identidad Territorial & Circuitos</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
                      Descubrí el encanto creativo de {city.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {city.description}
                    </p>
                  </div>

                  {/* Lista de Circuitos Creativos */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Circuitos Creativos Destacados:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {city.circuits.map((circ, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs hover:bg-white transition-colors flex flex-col justify-between"
                        >
                          <span className="text-xs font-black text-slate-900 mb-1 leading-tight">
                            {circ.name}
                          </span>
                          <span className="text-[11px] text-slate-500 leading-tight">
                            {circ.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones y Botón de Navegación a la Página de la Ciudad */}
                  <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Página oficial de la Ciudad Creativa</span>
                    </div>

                    <Link
                      href={`/ciudades-creativas/${city.slug}`}
                      className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl ${city.theme.buttonBg} ${city.theme.buttonHover} active:scale-95 text-white font-black text-xs shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 group cursor-pointer`}
                    >
                      <span>Visitar {city.name} Creativa</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* ================= 3. SECCIÓN DE CIERRE E INVITACIÓN AL MAPA 3D ================= */}
      <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              ¿Querés explorar las 10 ciudades en el Mapa Interactivo?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto mb-6">
              Navegá por los puntos de interés cultural, infraestructura y circuitos geolocalizados en nuestra vista inmersiva 2D/3D con MapLibre GL.
            </p>
            <Link
              href="/ciudades-creativas"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#5ce1b4] text-slate-950 font-black text-xs hover:bg-[#4dd2a6] active:scale-95 transition-all shadow-lg"
            >
              <span>Abrir Mapa Interactivo →</span>
            </Link>
          </div>
        </div>
      </div>

    </main>
  );
}
