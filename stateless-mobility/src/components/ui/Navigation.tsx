'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Enlaces exactos basados en tu diseño mockup
const NAV_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Circuitos Creativos', href: '/circuitos' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Experiencias', href: '/experiencias' },
  { name: 'Mapa', href: '/ciudades-creativas' }, // Aquí enlazamos tu mapa inmersivo
  { name: 'Nosotros', href: '/nosotros' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login') return null;

  return (
    // Fondo blanco puro, sin blur, con una línea inferior ultra delgada para diferenciar al hacer scroll
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-[88px]">
          
          {/* LOGO INSTITUCIONAL (Izquierda) */}
          <div className="flex-shrink-0 flex items-center gap-3">
             {/* Simulación del logo del diseño */}
            <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-xl">
              🏛️
            </div>
            <Link href="/circuitos" className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                Red Nacional de
              </span>
              <span className="text-sm font-extrabold text-purple-900 uppercase">
                Ciudades Creativas<br/>Nicaragua
              </span>
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
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-purple-800' // Sin fondos, solo cambio de color en el texto
                      : 'text-slate-800 hover:text-purple-700'
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
            <button className="text-sm font-semibold text-slate-800 hover:text-purple-800 flex items-center gap-1">
              ES 
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Botón Principal (Morado oscuro) */}
            <Link
              href="/perfil"
              className="px-7 py-3 bg-[#3b0764] hover:bg-purple-950 text-white text-sm font-bold rounded-full transition-all"
            >
              Planificá tu visita
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA (Móviles) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-800"
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
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
          <div className="px-6 py-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-base font-bold text-slate-800 hover:text-purple-800 border-b border-slate-50 last:border-0"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 pb-2">
              <Link
                href="/perfil"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3.5 bg-[#3b0764] text-white rounded-full font-bold"
              >
                Planificá tu visita
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}