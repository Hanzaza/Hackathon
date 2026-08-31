'use client'; 

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  IoHome, 
  IoHomeOutline, 
  IoCompass, 
  IoCompassOutline, 
  IoCalendar, 
  IoCalendarOutline, 
  IoMap, 
  IoMapOutline, 
  IoStorefront, 
  IoStorefrontOutline,
  IoPerson,
  IoPersonOutline,
} from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { User as UserIcon } from 'lucide-react';

// Enlaces de la barra de navegación para escritorio
const DESKTOP_NAV_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Circuitos Creativos', href: '/circuitos' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Experiencias', href: '/experiencias' },
  { name: 'Mapa', href: '/ciudades-creativas' },
  { name: 'Emprendedores', href: '/emprendedores' },
];

// Enlaces de la barra de navegación inferior para móviles con iconos emparejados (Sólido / Línea)
const MOBILE_NAV_ITEMS = [
  { name: 'Inicio', href: '/', iconActive: IoHome, iconInactive: IoHomeOutline },
  { name: 'Circuitos', href: '/circuitos', iconActive: IoCompass, iconInactive: IoCompassOutline },
  { name: 'Mapa', href: '/ciudades-creativas', iconActive: IoMap, iconInactive: IoMapOutline },
  { name: 'Agenda', href: '/agenda', iconActive: IoCalendar, iconInactive: IoCalendarOutline },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { isImmersiveMapActive } = useUI();

  if (pathname === '/login' || pathname.startsWith('/admin')) return null;

  // El navbar móvil se muestra en el mapa nacional / departamental para permitir navegación general,
  // y se oculta ÚNICAMENTE cuando el usuario entra al mapa 3D inmersivo de una ciudad/circuito.
  const showMobileBottomNav = !isImmersiveMapActive;

  return (
    <>
      {/* ================= 1. NAVBAR DE ESCRITORIO (Flotante Superior) ================= */}
      <nav className="hidden lg:block fixed top-4 left-1/2 z-[9999] w-[min(94vw,1400px)] -translate-x-1/2 pointer-events-auto">
        <div className="rounded-full border border-slate-200/80 bg-white/90 px-6 py-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between h-[58px]">
            
            {/* LOGO E ISOTIPO INSTITUCIONAL */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/logos/Logo.png"
                    alt="The Stateless Logo"
                    fill
                    sizes="40px"
                    className="object-contain drop-shadow-sm"
                  />
                </div>
                <div className="flex flex-col leading-none border-l border-slate-200 pl-3">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-0.5">
                    Red Nacional de
                  </span>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Ciudades Creativas
                  </span>
                </div>
              </Link>
            </div>

            {/* MENÚ DE ESCRITORIO (Centro) */}
            <div className="flex items-center space-x-7">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs font-semibold transition-all ${
                      isActive
                        ? 'text-purple-700 font-black border-b-2 border-purple-600 pb-1' 
                        : 'text-slate-700 hover:text-purple-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ACCIONES (Derecha) */}
            <div className="flex items-center gap-3.5">
              
              {/* Botón de Perfil / Login */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-3 py-1.5 rounded-full bg-slate-950 text-purple-300 hover:text-white font-bold text-xs hover:bg-slate-900 transition-all border border-purple-500/40 flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs transition-all shadow-sm cursor-pointer"
                    title="Ver Mi Pasaporte Cultural y Panel de Usuario"
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-purple-200 border border-purple-300">
                      <Image
                        src={user.avatar || '/logos/Logo.png'}
                        alt={user.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate max-w-[100px]">{user.name}</span>
                    <span className="text-[10px] bg-purple-200/80 text-purple-800 px-1.5 py-0.5 rounded-full font-black">
                      {user.points} pts
                    </span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* Botón Principal */}
              <Link
                href="/ciudades-creativas"
                className="px-5 py-2 bg-[#5ce1b4] text-black text-xs font-bold rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Planificá tu visita →
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* ================= 2. NAVBAR MÓVIL (Barra Inferior Estilo App PWA con Perfil Directamente Integrado) ================= */}
      {showMobileBottomNav && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-[9999] bg-black/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-12px_45px_rgba(0,0,0,0.9)] pb-safe pt-2 animate-fadeIn">
          <div className="flex items-center justify-around min-h-[62px] max-w-md mx-auto px-2">
            {MOBILE_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = isActive ? item.iconActive : item.iconInactive;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-white font-black scale-105' 
                      : 'text-white/60 hover:text-white font-medium active:scale-95'
                  }`}
                >
                  <div className={`relative p-1.5 rounded-2xl transition-all duration-200 ${
                    isActive ? 'bg-white/15 shadow-[0_0_16px_rgba(255,255,255,0.15)]' : ''
                  }`}>
                    <Icon 
                      className={`w-[22px] h-[22px] shrink-0 transition-all duration-200 ${
                        isActive 
                          ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                          : 'text-white/70'
                      }`} 
                    />
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                    )}
                  </div>
                  <span className={`text-[10px] tracking-tight mt-1 leading-none transition-colors ${
                    isActive ? 'text-white font-black' : 'text-white/60 font-medium'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* ITEM 5: PERFIL / INICIAR SESIÓN MÓVIL INTEGRADO */}
            {isAuthenticated && user ? (
              <Link
                href="/perfil"
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                  pathname === '/perfil'
                    ? 'text-white font-black scale-105'
                    : 'text-white/60 hover:text-white font-medium active:scale-95'
                }`}
              >
                <div className={`relative p-0.5 rounded-full transition-all duration-200 ${
                  pathname === '/perfil'
                    ? 'ring-2 ring-purple-400 bg-purple-600/30 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : ''
                }`}>
                  <div className="relative w-[24px] h-[24px] rounded-full overflow-hidden border border-white/60 bg-purple-900/60">
                    <Image
                      src={user.avatar || '/logos/Logo.png'}
                      alt={user.name || 'Perfil'}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                </div>
                <span className={`text-[10px] tracking-tight mt-1 leading-none transition-colors ${
                  pathname === '/perfil' ? 'text-white font-black' : 'text-white/60 font-medium'
                }`}>
                  Perfil
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 cursor-pointer text-white/60 hover:text-white font-medium active:scale-95"
              >
                <div className="relative p-1.5 rounded-2xl transition-all duration-200">
                  <IoPersonOutline className="w-[22px] h-[22px] shrink-0 text-white/70" />
                </div>
                <span className="text-[10px] tracking-tight mt-1 leading-none text-white/60 font-medium">
                  Ingresar
                </span>
              </button>
            )}

          </div>
        </nav>
      )}
    </>
  );
}