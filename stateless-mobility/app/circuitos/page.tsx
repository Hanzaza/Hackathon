import Link from 'next/link';
import Image from 'next/image'; // Import Image component
  
export default function CircuitosPage() {
  return (
    <main className="w-full min-h-screen bg-white text-slate-800 font-sans">
      
      {/* --- 1. HERO BANNER (ANCHO COMPLETO) --- */}
      <section className="relative w-full h-[300px] lg:h-[450px] bg-slate-900">
        <Image
          src="/banners/circuitos/circuitos-banner.jpg"
          alt="Banner Circuitos Creativos"
          fill
          loading="eager"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="opacity-30"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl lg:text-6xl font-black text-white drop-shadow-lg mb-4">
            Circuitos Creativos
          </h1>
          <p className="text-lg lg:text-xl text-white font-medium max-w-3xl drop-shadow-md">
            Explora las ciudades que forman parte de la Red Nacional de Ciudades Creativas de Nicaragua. Descubrí nuestra identidad, tradiciones y el talento de nuestro pueblo.
          </p>
        </div>
      </section>

      {/* --- 2. FRANJA DE TÍTULO --- */}
      <section className="w-full bg-gradient-to-r from-purple-900 to-purple-700 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Ciudades Creativas
          </h2>
        </div>
      </section>

      {/* --- 3. CUADRÍCULA DE CIUDADES --- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900">Nuestros Destinos</h3>
          <p className="text-slate-500 mt-2">Seleccioná una ciudad para ver sus circuitos y experiencias.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

function CityLogo({ logoSrc, name }: { logoSrc?: string, name: string }) {
  return (
    <div className="h-28 w-full relative mb-6 flex items-center justify-center transition-transform group-hover:scale-[1.05]">
      {logoSrc ? (
        <img 
          src={logoSrc} 
          alt={`Logo de ${name}`} 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
          <span className="text-2xl mb-1">🏛️</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{name}</span>
        </div>
      )}
    </div>
  );
}

function CityCard({ name, desc, active, slug, logoSrc }: { name: string, desc: string, active: boolean, slug?: string, logoSrc?: string }) {
  if (!active || !slug) {
    return (
      <div className="flex flex-col p-8 rounded-2xl border border-slate-200 bg-slate-50 opacity-75">
        <CityLogo logoSrc={logoSrc} name={name} />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{name}</h3>
        <p className="text-sm text-slate-500 mb-6 flex-grow">{desc}</p>
        <span className="text-slate-400 font-bold text-sm">
          Próximamente
        </span>
      </div>
    );
  }

  return (
    <Link 
      href={`/ciudades-creativas/${slug}`} 
      className="flex flex-col p-8 rounded-2xl border border-slate-200 bg-white hover:border-purple-600 hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 group"
    >
      <CityLogo logoSrc={logoSrc} name={name} />
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{name}</h3>
      <p className="text-sm text-slate-500 mb-8 flex-grow">{desc}</p>
      
      <span className="text-purple-700 font-bold text-sm flex items-center gap-2 mt-auto">
        Explorar ciudad 
        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
      </span>
    </Link>
  );
}