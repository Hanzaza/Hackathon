import Link from 'next/link';

export default function BluefieldsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-24">
      
      {/* MIGA DE PAN */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-8 pb-4">
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-purple-800 transition-colors">Ciudades</Link>
          <span>›</span>
          <span className="text-slate-900 font-bold">Bluefields</span>
        </div>
      </div>

      {/* HERO DE BLUEFIELDS */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          
          <div>
            <span className="inline-block px-3 py-1 bg-purple-900 text-white text-xs font-black uppercase tracking-widest rounded-sm mb-4 transform -skew-x-12">
              Ciudad Creativa
            </span>
            {/* Logo Tipográfico adaptado con colores caribeños */}
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter flex items-center gap-1">
              <span className="text-cyan-500">B</span>
              <span className="text-blue-600">L</span>
              <span className="text-green-500">U</span>
              <span className="text-yellow-400">E</span>
              <span className="text-cyan-500">F</span>
              <span className="text-blue-600">I</span>
              <span className="text-green-500">E</span>
              <span className="text-yellow-400">L</span>
              <span className="text-cyan-500">D</span>
              <span className="text-blue-600">S</span>
            </h1>
            <h2 className="text-xl font-bold text-slate-900 mt-2">De la danza y la música caribeña</h2>
          </div>

          <p className="text-slate-600 leading-relaxed max-w-lg text-lg">
            Bluefields es el corazón del Caribe nicaragüense. Recorré sus calles llenas de historia, disfrutá de su gastronomía única como el Rondón, y viví la energía del Palo de Mayo en una mezcla vibrante de culturas y tradiciones antillanas.
          </p>
        </div>

        <div className="flex-1 w-full flex justify-end">
          <div className="w-full max-w-md h-64 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-sm">
            <span className="text-slate-400 font-medium text-sm text-center px-4">
              [Ilustración de la Bahía de Bluefields y el Palo de Mayo]
            </span>
            {/* Formas decorativas con colores caribeños */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-400 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-500 rounded-full opacity-10 blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-wrap justify-between md:justify-start md:gap-16 border-t border-b border-slate-100 py-8">
          <QuickAccess icon="📍" label="Circuitos Creativos" active />
          <QuickAccess icon="⭐" label="Experiencias" />
          <QuickAccess icon="📅" label="Agenda" />
          <QuickAccess icon="🏪" label="Emprendedores" />
          <QuickAccess icon="🖼️" label="Galería" />
        </div>
      </section>

      {/* CIRCUITOS DESTACADOS DE BLUEFIELDS */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Circuitos destacados</h3>
        </div>

        {/* Tarjeta de Circuito Caribeño */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-xl shadow-slate-200/40 hover:border-cyan-200 transition-colors">
          
          <div className="flex-1 space-y-6 flex flex-col justify-center">
            <div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Ruta Histórica y Cultural</h4>
              <p className="text-slate-600">
                Descubrí los barrios emblemáticos, la arquitectura antillana y los epicentros de la música caribeña que dan vida a la ciudad.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-lg">📍</span> 5 Paradas
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">🚶</span> 3.0 km
              </span>
            </div>

            <div>
              <Link 
                href="/ciudades-creativas" // Enlace hacia el mapa inmersivo general
                className="inline-block px-8 py-3 bg-[#0891b2] hover:bg-cyan-800 text-white text-sm font-bold rounded-full transition-all shadow-md"
              >
                Ver circuito
              </Link>
            </div>
          </div>

          <div className="flex-1 h-64 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 flex items-center justify-center">
            <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M20,70 L40,40 L70,50 L90,30" stroke="#0891b2" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <circle cx="20" cy="70" r="3" fill="#0891b2" />
              <circle cx="40" cy="40" r="3" fill="#0891b2" />
              <circle cx="70" cy="50" r="3" fill="#0891b2" />
              <circle cx="90" cy="30" r="3" fill="#0891b2" />
            </svg>
            <span className="text-slate-400 text-xs font-bold bg-white/80 px-3 py-1 rounded-full z-10 backdrop-blur-sm">
              Minimapa Ilustrativo
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}

function QuickAccess({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-3 group transition-all ${active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
        active 
          ? 'bg-cyan-50 text-cyan-900 border-2 border-cyan-200' 
          : 'bg-slate-50 border border-slate-200 group-hover:bg-cyan-50 group-hover:border-cyan-200'
      }`}>
        {icon}
      </div>
      <span className={`text-sm font-bold ${active ? 'text-cyan-900' : 'text-slate-600'}`}>
        {label}
      </span>
    </button>
  );
}
