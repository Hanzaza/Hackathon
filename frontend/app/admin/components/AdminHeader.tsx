'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Database, 
  ArrowLeft, 
  Bell, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  supabaseConnected: boolean;
  activeTab: string;
  pendingCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  supabaseConnected,
  activeTab,
  pendingCount,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 text-slate-900 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-purple-700 transition-colors text-xs font-semibold px-2.5 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200"
            title="Volver al Portal Público"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Sitio</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/20 text-white font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black tracking-tight text-slate-950">Panel de Control Administrativo</h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                  <Sparkles className="w-2.5 h-2.5" /> Supabase Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium capitalize">
                Gestión Centralizada • {activeTab.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Status, Notifications & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Supabase Connection Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs shadow-xs">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-700 font-medium text-[11px]">PostgreSQL</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[10px] text-emerald-700 font-bold">Activo</span>
            </span>
          </div>

          {/* Pending Requests Alert */}
          {pendingCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold animate-pulse">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingCount} Pendiente{pendingCount > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Current Admin User */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-300 bg-purple-100">
              <Image
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'}
                alt={user?.name || 'Admin'}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user ? `${user.name} ${user.lastname || ''}` : 'Administrador'}
              </span>
              <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-purple-600" />
                Rol: {user?.role || 'admin'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
