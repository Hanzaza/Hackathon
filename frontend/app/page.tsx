'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NicaraguaSVG from '@/components/map/NicaraguaSVG';
import CityMobileStacking from '@/components/ui/city-mobile-stacking';
import CiudadesCreativasHero from '@/components/ui/CiudadesCreativasHero';

export default function HomePage() {
  const router = useRouter();

  const handleMapClick = (target?: string) => {
    if (target && !target.startsWith('NI')) {
      router.push(`/ciudades-creativas/${target}`);
    } else {
      router.push('/ciudades-creativas');
    }
  };

  return (
    // Fondo blanco limpio y nítido para la pantalla de inicio
    <main className="min-h-screen bg-white text-slate-900 font-sans pb-32">
      
      {/* 1. SECCIÓN HERO: CIUDADES CREATIVAS */}
      <CiudadesCreativasHero />

      {/* 2. SECCIÓN: MAPA NACIONAL (VISTA PREVIA INTERACTIVA CON REDIRECCIÓN) */}
      <section id="mapa-interactivo" className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 sm:pt-20 scroll-mt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[#007F7E] text-[11px] sm:text-xs font-black uppercase tracking-wider mb-2.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00A8A7] animate-ping" />
              <span>🗺️ Mapa Cultural & Turístico Interactivo</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight">
              Descubrí Nicaragua a través del Arte y la Tradición
            </h2>
            <p className="text-slate-600 max-w-2xl text-base md:text-lg mt-2 font-normal leading-relaxed">
              Navegá por los departamentos, explorá circuitos patrimoniales y viví experiencias turísticas únicas en cada rincón del país. Tocá cualquier región para entrar al mapa inmersivo.
            </p>
          </div>

          <Link
            href="/ciudades-creativas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00A8A7] to-[#007F7E] hover:from-[#00BFBD] hover:to-[#009694] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 self-start md:self-auto"
          >
            <span>Explorar Mapa Inmersivo</span>
            <span>→</span>
          </Link>
        </div>
        
        {/* Contenedor del Mapa con Hovers y Redirección al tocar */}
        <div className="relative w-full rounded-[2.5rem] bg-white border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden p-2 sm:p-6 cursor-pointer">
          <NicaraguaSVG 
            onSelect={handleMapClick}
            showLegend={false}
            showHeader={false}
            showMarkers={true}
          />
        </div>
        
      </section>

      {/* 4. SECCIÓN: NUESTRAS CIUDADES CREATIVAS (Cuadrícula Estática) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-2.5 shadow-xs">
            <span>✨ Red Nacional de Identidad & Cultura</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight">
            Nuestras 10 Ciudades Creativas
          </h2>
          <p className="text-slate-600 max-w-3xl text-base md:text-lg mt-2 font-normal leading-relaxed">
            Cada ciudad custodia una vocación patrimonial única: desde la poesía dariana y el barro ancestral, hasta el café de montaña, la música caribeña y el muralismo popular. Elegí tu próximo destino:
          </p>
        </div>

        {/* Mobile: Sticky Stacking Cards View */}
        <CityMobileStacking />

        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CityCard name="Bluefields" desc="Cuna de la danza, el Maypole y la riqueza multicultural caribeña" active={true} slug="bluefields" logoSrc="/logos/bluefields.png" />
          <CityCard name="Masaya" desc="Capital del folclore nacional, cuna de las artesanías y el arte popular" active={true} slug="masaya" logoSrc="/logos/masaya.png" />
          <CityCard name="San Juan de Oriente" desc="Santuario milenario del diseño precolombino y la cerámica utilitaria" active={true} slug="san-juan-de-oriente" logoSrc="/logos/san-juan-de-oriente.png" />
          <CityCard name="León" desc="Capital de la literatura, poesía dariana, arquitectura colonial y murales" active={true} slug="leon" logoSrc="/logos/leon.png" />
          <CityCard name="Granada" desc="Joya colonial de Nicaragua, cuna del diseño, arquitectura y poesía" active={true} slug="granada" logoSrc="/logos/granada.png" />
          <CityCard name="Estelí" desc="Diamante de las Segovias, capital del muralismo heroico y la música norteña" active={true} slug="esteli" logoSrc="/logos/esteli.png" />
          <CityCard name="Juigalpa" desc="Corazón ganadero de Chontales, cultura arqueológica y tradición taurina" active={true} slug="juigalpa" logoSrc="/logos/juigalpa.png" />
          <CityCard name="Managua" desc="Capital multicultural, epicentro del arte contemporáneo, lagos y volcanes" active={true} slug="managua" logoSrc="/logos/managua.png" />
          <CityCard name="Matagalpa" desc="Perla del Septentrión, cuna del café especial y la memoria indígena" active={true} slug="matagalpa" logoSrc="/logos/matagalpa.png" />
          <CityCard name="Nagarote" desc="Municipio azul y limpio, cuna del quesillo y la tradición gastronómica" active={true} slug="nagarote" logoSrc="/logos/nagarote.png" />
        </div>
      </section>
      
    </main>
  );
}

// --- COMPONENTES AUXILIARES ---

function CityLogo({ logoSrc, name }: { logoSrc?: string, name: string }) {
  return (
    <div className="h-24 w-full relative mb-6 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
      {logoSrc ? (
        <div className="relative w-full h-full">
          <Image src={logoSrc} alt={`Logo ${name}`} fill sizes="(max-width: 768px) 100vw, 200px" className="object-contain" />
        </div>
      ) : (
        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
          <span className="text-slate-400 font-bold tracking-widest uppercase">{name} Logo</span>
        </div>
      )}
    </div>
  );
}

function CityCard({ name, desc, active, slug, logoSrc }: { name: string, desc: string, active: boolean, slug?: string, logoSrc?: string }) {
  if (!active || !slug) {
    return (
      <div className="flex flex-col p-8 rounded-3xl border-2 bg-slate-50 border-slate-100 opacity-60 transition-all">
        <CityLogo logoSrc={logoSrc} name={name} />
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{name}</h3>
        <p className="text-sm text-slate-500 mb-6 flex-grow">{desc}</p>
        <span className="text-slate-400 font-semibold text-sm">
          Próximamente
        </span>
      </div>
    );
  }

  return (
    <Link 
      href={`/ciudades-creativas/${slug}`} 
      className="flex flex-col p-8 rounded-3xl border-2 bg-white border-slate-100 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 cursor-pointer transition-all group"
    >
      <CityLogo logoSrc={logoSrc} name={name} />
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-sm text-slate-500 mb-6 flex-grow">{desc}</p>
      
      <span className="text-[#00A8A7] font-bold text-sm group-hover:text-[#007F7E] transition-colors flex items-center gap-1">
        Explorar ciudad <span className="group-hover:translate-x-1 transition-transform">→</span>
      </span>
    </Link>
  );
}