'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Tus enlaces exactos
const NAV_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Circuitos Creativos', href: '/circuitos' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Experiencias', href: '/experiencias' },
  { name: 'Mapa', href: '/ciudades-creativas' },
  { name: 'Nosotros', href: '/nosotros' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login') return null;

  return (
    <nav className="fixed top-4 left-1/2 z-[9999] w-[min(92vw,1400px)] -translate-x-1/2 pointer-events-auto">
      <div className="rounded-full border border-slate-200/80 bg-white/85 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:px-6">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* LOGO INSTITUCIONAL (Estilo Editorial Limpio) */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-4xl font-serif italic pr-3 border-r-2 border-slate-900 leading-none text-slate-900">
                C
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                  Red Nacional de
                </span>
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Ciudades Creativas
                </span>
              </div>
            </Link>
          </div>

          {/* MENÚ DE ESCRITORIO (Centro-Derecha) */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  // Estilo de enlaces más limpio y neutral
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-black font-bold border-b-2 border-black pb-1' 
                      : 'text-slate-700 hover:text-black'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* ACCIONES (Derecha) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Selector de idioma */}
            <button className="text-sm font-medium text-slate-700 hover:text-black flex items-center gap-1 transition-colors">
              ES 
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Botón Principal (Estilo Neo-Brutalismo / Sombra Sólida) */}
            <Link
              href="/perfil"
              className="px-6 py-2.5 bg-[#5ce1b4] text-black text-sm font-medium rounded-full border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Planificá tu visita →
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA (Móviles) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-900 bg-white rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full mt-3 rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base font-medium text-slate-900 hover:text-slate-600 border-b border-black/10 last:border-0"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 pb-4">
              <Link
                href="/perfil"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-6 py-3.5 bg-[#5ce1b4] text-black border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-full font-medium active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Planificá tu visita →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}