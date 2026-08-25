'use client';

import Link from 'next/link';
import Image from 'next/image';
// 1. IMPORTAMOS EL MAPA (Ajusta la ruta según la estructura de tus carpetas)
import MapaContenedor from '@/components/map/MapaContenedor';
import CityMobileStacking from '@/components/ui/city-mobile-stacking';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function HomePage() {
  return (
    // Fondo completamente blanco, texto oscuro con padding inferior amplio para el navbar móvil
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-32">
      
      {/* 1. SECCIÓN HERO PARALLAX */}
      <ParallaxComponent title="Ciudades Creativas" />

      {/* 2. BARRA DE ESTADÍSTICAS MORADA */}
      <section className="relative z-30 w-full bg-purple-800 text-white -mt-10 py-12 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-purple-700/50">
          <StatItem icon="💡" value="10" label="Ciudades Creativas" />
          <StatItem icon="🗺️" value="06" label="Circuitos Habilitados" />
          <StatItem icon="✨" value="+200" label="Experiencias Únicas" />
          <StatItem icon="👥" value="+500" label="Emprendedores" />
        </div>
      </section>

      {/* 3. NUEVA SECCIÓN: MAPA INTERACTIVO */}
      <section id="mapa-interactivo" className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 scroll-mt-10">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Mapa Interactivo Nacional
          </h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            Seleccioná un departamento para adentrarte en sus circuitos y descubrir los puntos de interés cultural, artístico y turístico.
          </p>
        </div>
        
        {/* AQUI RENDERIZAMOS EL CONTENEDOR CON LA NAVEGACIÓN COMPLETA (Nacional -> Departamental -> Inmersivo) */}
        <MapaContenedor />
        
      </section>

      {/* 4. SECCIÓN: NUESTRAS CIUDADES CREATIVAS (Cuadrícula Estática) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Directorio de Ciudades Creativas
        </h2>
        <p className="text-slate-600 mb-12 max-w-2xl text-lg">
          Conocé a detalle las 10 ciudades que forman parte de la Red Nacional de Ciudades Creativas de Nicaragua.
        </p>

        {/* Mobile: Sticky Stacking Cards View */}
        <CityMobileStacking />

        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CityCard name="Bluefields" desc="De la danza y la música caribeña" active={true} slug="bluefields" logoSrc="/logos/bluefields.png" />
          <CityCard name="Masaya" desc="De las artesanías y el arte popular" active={true} slug="masaya" logoSrc="/logos/masaya.png" />
          <CityCard name="San Juan de Oriente" desc="Del diseño y arte popular" active={true} slug="san-juan-de-oriente" logoSrc="/logos/san-juan-de-oriente.png" />
          <CityCard name="León" desc="De la literatura" active={true} slug="leon" logoSrc="/logos/leon.png" />
          <CityCard name="Granada" desc="Del diseño" active={true} slug="granada" logoSrc="/logos/granada.png" />
          <CityCard name="Estelí" desc="De las artes, música y muralismo" active={true} slug="esteli" logoSrc="/logos/esteli.png" />
          <CityCard name="Juigalpa" desc="De la educación y de la cultura taurina" active={true} slug="juigalpa" logoSrc="/logos/juigalpa.png" />
          <CityCard name="Managua" desc="Multicultural" active={true} slug="managua" logoSrc="/logos/managua.png" />
          <CityCard name="Matagalpa" desc="Del arte indígena y el café" active={true} slug="matagalpa" logoSrc="/logos/matagalpa.png" />
          <CityCard name="Nagarote" desc="Próximamente" active={true} slug="nagarote" logoSrc="/logos/nagarote.png" />
        </div>
      </section>
      
    </main>
  );
}

// --- COMPONENTES AUXILIARES ---
// (Mantuve todos tus componentes exactamente iguales)

function StatItem({ icon, value, label }: { icon: string, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-4xl font-extrabold mb-1">{value}</span>
      <span className="text-sm text-purple-200 font-medium tracking-wide">{label}</span>
    </div>
  );
}

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
      className="flex flex-col p-8 rounded-3xl border-2 bg-white border-slate-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5 cursor-pointer transition-all group"
    >
      <CityLogo logoSrc={logoSrc} name={name} />
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-sm text-slate-500 mb-6 flex-grow">{desc}</p>
      
      <span className="text-purple-700 font-semibold text-sm group-hover:text-purple-900 transition-colors flex items-center gap-1">
        Explorar ciudad <span className="group-hover:translate-x-1 transition-transform">→</span>
      </span>
    </Link>
  );
}