'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NicaraguaSVG from '@/components/map/NicaraguaSVG';
import CityMobileStacking from '@/components/ui/city-mobile-stacking';
import AccordionModal, { NICARAGUA_CITIES_GALLERY } from '@/components/ui/gallery-modal-accordion';
import CiudadesCreativasHero from '@/components/ui/CiudadesCreativasHero';
import HomeEmprendedoresBanner from '@/components/ui/HomeEmprendedoresBanner';

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

      {/* 4. SECCIÓN: NUESTRAS CIUDADES CREATIVAS (Galería Acordeón Interactivo con Fotos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="mb-6 sm:mb-8">
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

        {/* Desktop: Interactive Gallery Modal Accordion with scenic photos */}
        <div className="hidden sm:block">
          <AccordionModal items={NICARAGUA_CITIES_GALLERY} />
        </div>
      </section>

      {/* 5. SECCIÓN: CONEXIÓN RED DE EMPRENDEDORES & ARTESANOS */}
      <HomeEmprendedoresBanner />
      
    </main>
  );
}