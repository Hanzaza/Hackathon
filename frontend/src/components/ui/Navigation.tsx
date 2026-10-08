'use client'; 

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
import MagneticDock, { DockItemData } from '@/components/ui/magnetic-dock';

// Enlaces de la barra de navegación para escritorio
const DESKTOP_NAV_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Circuitos Creativos', href: '/circuitos' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Mapa', href: '/ciudades-creativas' },
  { name: 'Emprendedores', href: '/emprendedores' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { isImmersiveMapActive } = useUI();

  if (pathname === '/login' || (pathname && pathname.startsWith('/admin'))) return null;

  // El navbar móvil se muestra en el mapa nacional / departamental para permitir navegación general,
  // y se oculta ÚNICAMENTE cuando el usuario entra al mapa 3D inmersivo de una ciudad/circuito.
  const showMobileBottomNav = !isImmersiveMapActive;

  // Elementos del Dock Magnético para móvil (todas las secciones del ecosistema ROOTS)
  const mobileDockItems: DockItemData[] = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <Image
            src="/icons/roots/cathedral.png"
            alt="Inicio"
            fill
            sizes="32px"
            className="object-contain drop-shadow-xs"
          />
        </div>
      ),
      onClick: () => router.push('/'),
      isActive: pathname === '/',
    },
    {
      id: 'circuitos',
      label: 'Circuitos',
      icon: <IoCompass className="w-5.5 h-5.5 text-white drop-shadow-sm" />,
      onClick: () => router.push('/circuitos'),
      isActive: Boolean(pathname?.startsWith('/circuitos')),
    },
    {
      id: 'mapa',
      label: 'Mapa',
      icon: <IoMap className="w-5.5 h-5.5 text-white drop-shadow-sm" />,
      onClick: () => router.push('/ciudades-creativas'),
      isActive: Boolean(pathname?.startsWith('/ciudades-creativas')),
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: <IoCalendar className="w-5.5 h-5.5 text-white drop-shadow-sm" />,
      onClick: () => router.push('/agenda'),
      isActive: Boolean(pathname?.startsWith('/agenda')),
    },
    {
      id: 'emprendedores',
      label: 'Emprendedores',
      icon: <IoStorefront className="w-5.5 h-5.5 text-white drop-shadow-sm" />,
      onClick: () => router.push('/emprendedores'),
      isActive: Boolean(pathname?.startsWith('/emprendedores')),
    },
    {
      id: 'perfil',
      label: isAuthenticated ? (user?.name || 'Mi Perfil') : 'Iniciar Sesión',
      icon: (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <Image
            src={user?.avatar || '/icons/roots/profile-mask.png'}
            alt="Perfil"
            fill
            sizes="32px"
            className="object-contain drop-shadow-xs"
          />
        </div>
      ),
      onClick: () => {
        if (!isAuthenticated) {
          openAuthModal();
        } else {
          router.push('/perfil');
        }
      },
      isActive: pathname === '/perfil',
      badge: user?.role === 'admin' ? 1 : undefined,
    },
  ];

  return (
    <>
      {/* ================= 1. NAVBAR DE ESCRITORIO (Flotante Superior) ================= */}
      <nav className="hidden lg:block fixed top-4 left-1/2 z-[9999] w-[min(94vw,1400px)] -translate-x-1/2 pointer-events-auto">
        <div className="rounded-full border border-slate-200/80 bg-white/90 px-6 py-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between h-[58px]">
            
            {/* LOGO E ISOTIPO INSTITUCIONAL */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="relative h-9 w-36 sm:w-40 shrink-0">
                  <Image
                    src="/logos/roots-isologo.png"
                    alt="ROOTS Isologo Oficial"
                    fill
                    sizes="160px"
                    priority
                    className="object-contain drop-shadow-xs"
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
                const isActive = pathname === item.href || (item.href !== '/' && Boolean(pathname?.startsWith(item.href)));
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
            <div className="flex items-center gap-2.5">
              
              {/* Botón de Perfil / Login */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer tracking-wider uppercase"
                      title="Panel de Control de Administrador"
                    >
                      Admin
                    </Link>
                  )}

                  <Link
                    href="/perfil"
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs transition-all shadow-xs hover:shadow-sm cursor-pointer"
                    title="Ver Mi Pasaporte Cultural y Panel de Usuario"
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <Image
                        src={user.avatar || '/icons/roots/profile-mask.png'}
                        alt={user.name}
                        fill
                        sizes="24px"
                        className="object-contain p-0.5"
                      />
                    </div>
                    
                    <span className="truncate max-w-[120px] font-bold text-xs text-slate-900">
                      {user.name}
                    </span>

                    {user.role !== 'admin' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full font-black shadow-xs">
                        {user.points || 0} pts
                      </span>
                    )}
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <div className="relative w-4 h-5 shrink-0">
                    <Image
                      src="/icons/roots/profile-mask.png"
                      alt="Perfil"
                      fill
                      sizes="20px"
                      className="object-contain"
                    />
                  </div>
                  <span>Perfil</span>
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

      {/* ================= 2. NAVBAR MÓVIL FLOTANTE CON MAGNETIC DOCK ================= */}
      {showMobileBottomNav && (
        <div className="lg:hidden fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto flex items-center justify-center w-full px-3 animate-fadeIn">
          <MagneticDock
            items={mobileDockItems}
            iconSize={42}
            maxScale={1.35}
            magneticDistance={85}
            showLabels={true}
            position="bottom"
            variant="roots"
          />
        </div>
      )}
    </>
  );
}