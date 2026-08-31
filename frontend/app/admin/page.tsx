'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AdminStatsGrid } from './components/AdminStatsGrid';
import { DepartmentsManagerTab } from './components/DepartmentsManagerTab';
import { EntrepreneurRequestsTab } from './components/EntrepreneurRequestsTab';
import { RoutesManagerTab } from './components/RoutesManagerTab';
import { CitiesManagerTab } from './components/CitiesManagerTab';
import { EventsManagerTab } from './components/EventsManagerTab';
import { UsersManagerTab } from './components/UsersManagerTab';
import { AchievementsManagerTab } from './components/AchievementsManagerTab';
import { ReportsModerationTab } from './components/ReportsModerationTab';
import {
  adminService,
  AdminStats,
  DepartmentItem,
  EntrepreneurRequestItem,
  CreativeRouteItem,
  MunicipalityItem,
  AdminEventItem,
  AdminUserItem,
  AchievementItem,
  ReportItem,
} from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEntrepreneurs: 0,
    pendingRequests: 0,
    totalRoutes: 0,
    totalEvents: 0,
    totalCities: 0,
    totalDepartments: 0,
    pendingReports: 0,
    supabaseConnected: true,
  });
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [requests, setRequests] = useState<EntrepreneurRequestItem[]>([]);
  const [routes, setRoutes] = useState<CreativeRouteItem[]>([]);
  const [cities, setCities] = useState<MunicipalityItem[]>([]);
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);

  const loadAllData = useCallback(async () => {
    try {
      const [
        statsData,
        deptsData,
        requestsData,
        routesData,
        citiesData,
        eventsData,
        usersData,
        achievementsData,
        reportsData,
      ] = await Promise.all([
        adminService.getStats(),
        adminService.getDepartments(),
        adminService.getEntrepreneurRequests(),
        adminService.getRoutes(),
        adminService.getCities(),
        adminService.getEvents(),
        adminService.getUsers(),
        adminService.getAchievements(),
        adminService.getReports(),
      ]);

      setStats(statsData);
      setDepartments(deptsData);
      setRequests(requestsData);
      setRoutes(routesData);
      setCities(citiesData);
      setEvents(eventsData);
      setUsers(usersData);
      setAchievements(achievementsData);
      setReports(reportsData);
    } catch (e) {
      console.error('Error cargando datos del panel admin:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'admin') {
      loadAllData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, user, loadAllData]);

  // Guardia de Carga
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Verificando credenciales de seguridad...</p>
      </div>
    );
  }

  // Guardia de Acceso de Ciberseguridad (RBAC)
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 text-center select-none">
        <div className="relative w-24 h-24 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
          <ShieldAlert className="w-12 h-12 text-rose-600" />
          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-widest border border-rose-200 mb-4">
          Acceso Restringido • Protocolo RBAC
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mb-3">
          Panel de Administración Protegido
        </h1>

        <p className="text-sm text-slate-600 max-w-md mb-8 leading-relaxed">
          Esta sección está reservada exclusivamente para administradores autorizados de la Red Nacional de Ciudades Creativas.
          {isAuthenticated
            ? ` Tu usuario actual (${user?.email}) tiene rol "${user?.role}".`
            : ' Debes iniciar sesión con una cuenta de administrador.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>

          {!isAuthenticated && (
            <button
              type="button"
              onClick={openAuthModal}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Iniciar Sesión como Administrador
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 1. Header Fijo Superior */}
      <AdminHeader
        supabaseConnected={stats.supabaseConnected}
        activeTab={activeTab}
        pendingCount={stats.pendingRequests}
      />

      {/* 2. Main Body with Sidebar & Dynamic View */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          pendingRequestsCount={stats.pendingRequests}
          pendingReportsCount={stats.pendingReports}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-slate-50">
          {isLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-purple-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sincronizando con Supabase...
              </p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {activeTab === 'resumen' && (
                <AdminStatsGrid stats={stats} onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'departamentos' && (
                <DepartmentsManagerTab departments={departments} users={users} cities={cities} onRefresh={loadAllData} />
              )}
              {activeTab === 'solicitudes' && (
                <EntrepreneurRequestsTab requests={requests} onRefresh={loadAllData} />
              )}
              {activeTab === 'rutas' && (
                <RoutesManagerTab routes={routes} cities={cities} onRefresh={loadAllData} />
              )}
              {activeTab === 'ciudades' && (
                <CitiesManagerTab cities={cities} onRefresh={loadAllData} />
              )}
              {activeTab === 'eventos' && (
                <EventsManagerTab events={events} onRefresh={loadAllData} />
              )}
              {activeTab === 'usuarios' && (
                <UsersManagerTab users={users} onRefresh={loadAllData} />
              )}
              {activeTab === 'logros' && (
                <AchievementsManagerTab achievements={achievements} onRefresh={loadAllData} />
              )}
              {activeTab === 'reportes' && (
                <ReportsModerationTab reports={reports} onRefresh={loadAllData} />
              )}
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
