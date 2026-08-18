'use client';

import Link from 'next/link';
import { useState } from 'react';
// 1. IMPORTAMOS EL MAPA (Ajusta la ruta según la estructura de tus carpetas)
import NicaraguaSVG from '@/components/map/NicaraguaSVG';

export default function HomePage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  return (
    // Fondo completamente blanco, texto oscuro
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      
      {/* 1. SECCIÓN HERO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12 flex flex-col md:flex-row items-center gap-12">
        
        {/* Textos y Llamados a la Acción (Izquierda) */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Descubrí la <br />
            <span className="text-purple-800">Creatividad</span> <br />
            que nos conecta
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            Recorré los circuitos creativos de Nicaragua, conocé nuestras historias, tradiciones, naturaleza y el talento de nuestro pueblo.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            {/* 2. CAMBIAMOS EL ENLACE PARA QUE HAGA SCROLL AL MAPA */}
            <Link 
              href="#mapa-interactivo" 
              className="px-8 py-3.5 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-full transition-all shadow-lg shadow-purple-900/20"
            >
              Explorá los circuitos
            </Link>
            <button className="px-8 py-3.5 bg-white border-2 border-slate-200 hover:border-purple-800 hover:text-purple-800 text-slate-700 font-bold rounded-full transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Ver video
            </button>
          </div>
        </div>

        {/* Espacio para el Collage de Imágenes (Derecha) */}
        <div className="flex-1 w-full min-h-[460px] rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
          <div className="grid h-full gap-3 md:grid-cols-[1.4fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-white">
              <img
                src="/logos/leon.png"
                alt="Ciudad creativa León"
                className="h-full w-full object-contain p-4 sm:p-6"
              />
            </div>
            <div className="grid gap-3">
              <div className="relative overflow-hidden rounded-[2rem] bg-white">
                <img
                  src="/logos/granada.png"
                  alt="Ciudad creativa Granada"
                  className="h-full w-full object-contain p-4"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                <div className="relative overflow-hidden rounded-[2rem] bg-white">
                  <img
                    src="/logos/esteli.png"
                    alt="Ciudad creativa Estelí"
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                <div className="relative overflow-hidden rounded-[2rem] bg-white">
                  <img
                    src="/logos/masaya.png"
                    alt="Ciudad creativa Masaya"
                    className="h-full w-full object-contain p-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE ESTADÍSTICAS MORADA */}
      <section className="w-full bg-purple-800 text-white mt-8 py-12 rounded-t-[3rem] md:rounded-t-[5rem]">
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
        
        {/* AQUI RENDERIZAMOS EL COMPONENTE PADRE QUE CREAMOS */}
        <NicaraguaSVG onSelect={setSelectedDepartment} />
        {selectedDepartment && (
          <p className="mt-4 text-sm text-slate-500">
            Departamento seleccionado: <span className="font-semibold text-slate-700">{selectedDepartment}</span>
          </p>
        )}
        
      </section>

      {/* 4. SECCIÓN: NUESTRAS CIUDADES CREATIVAS (Cuadrícula Estática) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Directorio de Ciudades Creativas
        </h2>
        <p className="text-slate-600 mb-12 max-w-2xl text-lg">
          Conocé a detalle las 10 ciudades que forman parte de la Red Nacional de Ciudades Creativas de Nicaragua.
        </p>

        {/* Mobile: horizontal carousel with snap; Desktop: grid */}
        <div className="sm:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2">
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Bluefields" desc="De la danza y la música caribeña" active={true} slug="bluefields" logoSrc="/logos/bluefields.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Masaya" desc="De las artesanías y el arte popular" active={true} slug="masaya" logoSrc="/logos/masaya.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="San Juan de Oriente" desc="Del diseño y arte popular" active={true} slug="san-juan-de-oriente" logoSrc="/logos/san-juan-de-oriente.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="León" desc="De la literatura" active={true} slug="leon" logoSrc="/logos/leon.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Granada" desc="Del diseño" active={true} slug="granada" logoSrc="/logos/granada.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Estelí" desc="De las artes, música y muralismo" active={true} slug="esteli" logoSrc="/logos/esteli.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Juigalpa" desc="De la educación y de la cultura taurina" active={true} slug="juigalpa" logoSrc="/logos/juigalpa.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Managua" desc="Multicultural" active={true} slug="managua" logoSrc="/logos/managua.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Matagalpa" desc="Del arte indígena y el café" active={true} slug="matagalpa" logoSrc="/logos/matagalpa.png" />
            </div>
            <div className="snap-start flex-shrink-0 w-[85%]">
              <CityCard name="Nagarote" desc="Próximamente" active={true} slug="nagarote" logoSrc="/logos/nagarote.png" />
            </div>
          </div>
        </div>

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
          <img src={logoSrc} alt={`Logo ${name}`} className="w-full h-full object-contain" />
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