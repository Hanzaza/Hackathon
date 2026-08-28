'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Compass,
  Award,
  Sparkles,
  Store,
  Settings,
  MapPin,
  Calendar,
  CheckCircle2,
  Lock,
  Edit3,
  LogOut,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Star,
  Check,
  Camera,
  Heart,
  Layers,
  ArrowRight,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  NICARAGUA_GEO_DATA,
  getMunicipalitiesByDepartment,
  getDepartmentByMunicipality,
} from '@/data/nicaraguaGeo';

// Categorías culturales para preferencias
const CULTURAL_CATEGORIES = [
  'Literatura & Poesía',
  'Artesanías & Cerámica',
  'Folclore & Marimba',
  'Muralismo & Arte Urbano',
  'Gastronomía Tradicional',
  'Café & Cacao de Altura',
  'Patrimonio Colonial UNESCO',
  'Artesanías en Cuero & Madera',
  'Música & Danza Tradicional',
];

export default function UserProfileDashboard() {
  const { user, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'circuits' | 'achievements' | 'entrepreneur' | 'settings'>('overview');

  // Estados del Formulario de Configuración
  const [formName, setFormName] = useState('');
  const [formLastname, setFormLastname] = useState('');
  const [formDepartment, setFormDepartment] = useState('León');
  const [formCity, setFormCity] = useState('León');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formFavCategories, setFormFavCategories] = useState<string[]>([]);
  const [formNotifications, setFormNotifications] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Estados de Solicitud de Emprendedor
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('artesania');
  const [businessDepartment, setBusinessDepartment] = useState('León');
  const [businessCity, setBusinessCity] = useState('León');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessMotivation, setBusinessMotivation] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [existingRequestStatus, setExistingRequestStatus] = useState<string | null>(null);

  // Cargar datos del usuario en los formularios
  useEffect(() => {
    if (user) {
      const userDept = getDepartmentByMunicipality(user.city || 'León');
      setFormName(user.name || '');
      setFormLastname(user.lastname || '');
      setFormDepartment(userDept);
      setFormCity(user.city || 'León');
      setBusinessDepartment(userDept);
      setBusinessCity(user.city || 'León');
      setFormBio(user.bio || '');
      setFormAvatar(user.avatar || '');
      setFormFavCategories(user.favorite_categories || ['Literatura & Poesía', 'Folclore & Marimba']);
      setFormNotifications(user.notifications_enabled ?? true);

      // Verificar si ya tiene una solicitud enviada
      if (supabase && user.id) {
        supabase
          .from('entrepreneur_requests')
          .select('status, business_name')
          .eq('user_id', user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setExistingRequestStatus(data.status);
              if (data.business_name) setBusinessName(data.business_name);
            }
          });
      }
    }
  }, [user]);

  // Si no está autenticado, mostrar pantalla de bienvenida / login
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.18),transparent_70%)] pointer-events-none" />
        
        <div className="relative max-w-md w-full bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-lg shadow-purple-600/20">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/30 inline-block">
              Pasaporte del Explorador
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Tu Panel Personal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Inicia sesión para acceder a tu pasaporte cultural digital, registrar rutas completadas, ganar medallas de honor y gestionar tu perfil.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={openAuthModal}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Ingresar o Crear Cuenta</span>
            </button>

            <Link
              href="/ciudades-creativas"
              className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all text-center"
            >
              Explorar el Mapa Sin Cuenta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Nivel y Puntos del Usuario
  const userPoints = user.points ?? 50;
  const userLevel = user.level ?? 1;
  const nextLevelPoints = userLevel * 250;
  const progressPercent = Math.min(100, Math.round((userPoints / nextLevelPoints) * 100));

  // Guardar Cambios de Perfil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(false);

    try {
      await updateProfile({
        name: formName.trim(),
        lastname: formLastname.trim(),
        city: formCity,
        bio: formBio.trim(),
        avatar: formAvatar.trim() || user.avatar,
        favorite_categories: formFavCategories,
        notifications_enabled: formNotifications,
      });
      setProfileSuccessMsg(true);
      setTimeout(() => setProfileSuccessMsg(false), 4000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Enviar Solicitud de Emprendedor
  const handleSubmitEntrepreneurRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setIsSubmittingRequest(true);
    try {
      if (supabase && user.id) {
        await supabase.from('entrepreneur_requests').insert([
          {
            user_id: user.id,
            business_name: businessName.trim(),
            business_type: businessType,
            address: businessAddress.trim(),
            motivation: businessMotivation.trim(),
            status: 'pending',
          },
        ]);
      }
      setRequestSubmitted(true);
      setExistingRequestStatus('pending');
    } catch (err) {
      console.warn('Error enviando solicitud:', err);
      setRequestSubmitted(true);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Toggle de categoría favorita
  const toggleCategory = (cat: string) => {
    if (formFavCategories.includes(cat)) {
      setFormFavCategories(formFavCategories.filter((c) => c !== cat));
    } else {
      setFormFavCategories([...formFavCategories, cat]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-6 lg:pt-24 pb-36 relative overflow-hidden">
      
      {/* Fondo Ambiental Dinámico */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* ========================================================================= */}
        {/* HERO: PASAPORTE CULTURAL Y TARJETA MAESTRA DEL USUARIO */}
        {/* ========================================================================= */}
        <div className="relative rounded-[2.5rem] bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
          
          {/* Marca de Agua de Pasaporte Cultural */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
            <Compass className="w-80 h-80 text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Foto de Perfil + Identidad */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              
              {/* Avatar con Anillo de Nivel */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-xl shadow-purple-950/50 bg-slate-950 relative">
                  <Image
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop'}
                    alt={user.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] border-2 border-slate-900 shadow-md">
                  Nivel {userLevel}
                </span>
              </div>

              {/* Textos y Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5">
                    {user.role === 'admin' ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Administrador de la Red</span>
                      </>
                    ) : user.role === 'entrepreneur' ? (
                      <>
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Emprendedor Acreditado</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-3.5 h-3.5 text-purple-400" />
                        <span>Explorador Cultural de Nicaragua</span>
                      </>
                    )}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-medium border border-white/5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {user.city || 'León'}, Nicaragua
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {user.name} {user.lastname}
                </h1>

                {user.bio ? (
                  <p className="text-xs text-slate-300 max-w-xl line-clamp-2 leading-relaxed">
                    &quot;{user.bio}&quot;
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 max-w-xl">
                    Explorando la riqueza artística, las tradiciones vivas y la memoria ancestral de los municipios creativos.
                  </p>
                )}

                {/* Barra de Progreso y Puntos */}
                <div className="pt-2 max-w-md">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {userPoints} Puntos Acumulados
                    </span>
                    <span className="text-slate-400">
                      Siguiente nivel: {nextLevelPoints} pts
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 border border-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Tarjeta de Pasaporte Digital con QR */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-950/80 border border-purple-500/20 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 block">
                    Pasaporte Digital
                  </span>
                  <span className="text-xs font-black text-white">NIC-EXP-{(user.id || '0000').slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs py-1">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Rutas</span>
                  <span className="font-black text-white text-base">3</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Medallas</span>
                  <span className="font-black text-amber-400 text-base">4 🏅</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                </span>
                <span>Válido en toda la Red</span>
              </div>
            </div>

          </div>

          {/* Barra de Navegación por Pestañas */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto no-scrollbar pb-1">
            {[
              { key: 'overview', label: 'Pasaporte & Resumen', icon: Compass },
              { key: 'circuits', label: 'Mis Circuitos (3)', icon: Layers },
              { key: 'achievements', label: 'Medallas & Logros (4)', icon: Award },
              { key: 'entrepreneur', label: user.role === 'entrepreneur' ? 'Mi Emprendimiento' : 'Ser Emprendedor', icon: Store },
              { key: 'settings', label: 'Ajustes de Perfil', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-100'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* PESTAÑA 1: PASAPORTE & RESUMEN */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Grid de Métricas Principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Puntos Roots', value: `${userPoints} pts`, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Rango de Viaje', value: `Nivel ${userLevel}`, icon: Compass, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Ciudades Visitadas', value: '4 / 9', icon: MapPin, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { label: 'Insignias de Honor', value: '4 Desbloqueadas', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
                    <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      {stat.label}
                    </span>
                    <span className="text-xl font-black text-white mt-0.5 block">{stat.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Accesos Rápidos Destacados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Banner Circuito Recomendado */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/30 inline-block mb-3">
                    Próxima Parada Recomendada
                  </span>
                  <h3 className="text-xl font-black text-white">Circuito Dariano Colonial en León</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Completa la visita a la Catedral de la Asunción y el Museo Archivo Rubén Darío para ganar +200 pts Roots.
                  </p>
                </div>

                <Link
                  href="/ciudades-creativas"
                  className="py-3 px-5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  <Compass className="w-4 h-4" />
                  <span>Abrir en el Mapa Inmersivo 3D →</span>
                </Link>
              </div>

              {/* Banner Emprendimiento Creativo */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 inline-block mb-3">
                    Impulso Local
                  </span>
                  <h3 className="text-xl font-black text-white">¿Creas artesanías, gastronomía o arte?</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Acredita tu taller o negocio en la Red de Ciudades Creativas para figurar en las rutas turísticas oficiales.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('entrepreneur')}
                  className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Solicitar Acreditación de Emprendedor →</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: MIS CIRCUITOS & RUTAS */}
        {/* ========================================================================= */}
        {activeTab === 'circuits' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Circuitos Registrados en tu Pasaporte</h3>
              <Link href="/circuitos" className="text-xs font-bold text-purple-400 hover:underline">
                Explorar todos los circuitos →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Circuito Dariano Colonial',
                  city: 'León',
                  progress: '75%',
                  stops: '3/4 paradas',
                  image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop',
                  status: 'En Progreso',
                },
                {
                  title: 'Ruta del Barro y Cerámica Precolombina',
                  city: 'San Juan de Oriente',
                  progress: '100%',
                  stops: '4/4 paradas',
                  image: 'https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=600&auto=format&fit=crop',
                  status: 'Completada 🏆',
                },
                {
                  title: 'Circuito del Muralismo Segoviano',
                  city: 'Estelí',
                  progress: '30%',
                  stops: '1/3 paradas',
                  image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600&auto=format&fit=crop',
                  status: 'En Progreso',
                },
              ].map((c, i) => (
                <div key={i} className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden flex flex-col justify-between">
                  <div className="relative h-36 w-full">
                    <Image src={c.image} alt={c.title} fill sizes="400px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-black/80 text-purple-300 border border-white/10">
                      {c.city}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {c.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <h4 className="font-black text-white text-sm">{c.title}</h4>
                    
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Progreso: {c.stops}</span>
                        <span className="text-white">{c.progress}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: c.progress }} />
                      </div>
                    </div>

                    <Link
                      href="/ciudades-creativas"
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <Compass className="w-3.5 h-3.5 text-purple-400" />
                      <span>Ver Ruta en Mapa 3D</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: MEDALLAS & LOGROS CULTURALES */}
        {/* ========================================================================= */}
        {activeTab === 'achievements' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-lg font-black text-white">Insignias & Logros de Gamificación</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Guardián Dariano', desc: 'Visita los 4 sitios emblemáticos de Rubén Darío en León.', points: '+200 pts', icon: '🏛️', unlocked: true },
                { title: 'Maestro del Torno Ancestral', desc: 'Presencia una demostración de cerámica en San Juan de Oriente.', points: '+150 pts', icon: '🏺', unlocked: true },
                { title: 'Oído Folclórico', desc: 'Asiste a un concierto de marimba de arco en Masaya.', points: '+150 pts', icon: '🎶', unlocked: true },
                { title: 'Paso Firme por Tisey', desc: 'Explora los murales urbanos de Estelí.', points: '+100 pts', icon: '🎨', unlocked: true },
                { title: 'Cata de Grano de Oro', desc: 'Degusta un café de especialidad en Matagalpa.', points: '+180 pts', icon: '☕', unlocked: false },
                { title: 'Palo de Mayo Creol', desc: 'Descubre las danzas ancestrales de Bluefields.', points: '+250 pts', icon: '🌴', unlocked: false },
                { title: 'Sultana de la Poesía', desc: 'Recorre el centro colonial de Granada.', points: '+150 pts', icon: '⛵', unlocked: false },
                { title: 'Escultor Chontaleño', desc: 'Visita el Museo Arqueológico de Juigalpa.', points: '+200 pts', icon: '🗿', unlocked: false },
              ].map((ach, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                    ach.unlocked
                      ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-950/20'
                      : 'bg-slate-950/60 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{ach.icon}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        ach.unlocked
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {ach.unlocked ? 'Desbloqueada' : 'Bloqueada'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ach.desc}</p>
                  </div>

                  <span className="text-xs font-black text-amber-400">{ach.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 4: ACREDITACIÓN DE EMPRENDEDOR LOCAL */}
        {/* ========================================================================= */}
        {activeTab === 'entrepreneur' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6 animate-fadeIn">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Acreditación de Emprendimiento</h3>
                <p className="text-xs text-slate-400">
                  Forma parte del catálogo turístico oficial y aparece en los circuitos de las Ciudades Creativas.
                </p>
              </div>
            </div>

            {existingRequestStatus === 'pending' || requestSubmitted ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-white text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>¡Solicitud Enviada con Éxito!</span>
                </div>
                <p className="leading-relaxed">
                  Tu solicitud para <strong>{businessName || 'tu emprendimiento'}</strong> se encuentra en estado <strong>Pendiente de Revisión</strong> por el equipo de coordinación municipal. Te notificaremos una vez sea aprobada.
                </p>
              </div>
            ) : user.role === 'entrepreneur' ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Cuenta de Emprendedor Activa!</span>
                </div>
                <p className="leading-relaxed">
                  Tu negocio está acreditado en la Red Nacional de Ciudades Creativas. Puedes gestionar tus eventos y productos desde la sección de emprendedores.
                </p>
                <Link
                  href="/emprendedores"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:underline pt-2"
                >
                  <span>Ir al Portal de Emprendedores →</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitEntrepreneurRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Nombre Comercial del Negocio o Taller *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Taller Ancestral de Cerámica Doña Rosa"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Categoría
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="artesania">🏺 Artesanal / Cerámica</option>
                      <option value="gastronomia">🍲 Gastronomía / Café</option>
                      <option value="hospedaje">🏡 Posada Cultural</option>
                      <option value="galeria">🎨 Galería / Souvenirs</option>
                      <option value="tours">🧭 Guía / Recorridos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Departamento
                    </label>
                    <select
                      value={businessDepartment}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setBusinessDepartment(newDept);
                        const firstMun = getMunicipalitiesByDepartment(newDept)[0] || 'León';
                        setBusinessCity(firstMun);
                      }}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {NICARAGUA_GEO_DATA.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Municipio / Ciudad
                    </label>
                    <select
                      value={businessCity}
                      onChange={(e) => setBusinessCity(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {getMunicipalitiesByDepartment(businessDepartment).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Dirección Física / Ubicación
                  </label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Ej. De la Iglesia San Juan 2c al sur, San Juan de Oriente"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Descripción del Emprendimiento & Experiencias para Turistas
                  </label>
                  <textarea
                    rows={3}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe los productos, historia familiar, talleres vivenciales o demostraciones que ofreces..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingRequest}
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingRequest ? 'Enviando Solicitud...' : 'Enviar Solicitud de Acreditación'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 5: AJUSTES DE PERFIL */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-black text-white">Editar Perfil</h3>
                <p className="text-xs text-slate-400">Actualiza tus datos y preferencias culturales.</p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

            {profileSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>¡Perfil actualizado con éxito en la base de datos!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formLastname}
                    onChange={(e) => setFormLastname(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Departamento de Residencia
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => {
                      const newDept = e.target.value;
                      setFormDepartment(newDept);
                      const firstMun = getMunicipalitiesByDepartment(newDept)[0] || 'León';
                      setFormCity(firstMun);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {NICARAGUA_GEO_DATA.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Municipio / Ciudad de Residencia
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {getMunicipalitiesByDepartment(formDepartment).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Correo Electrónico (Solo Lectura)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-3 py-2.5 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  URL de Imagen de Perfil (Avatar)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                  {formAvatar && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-white/20 shrink-0">
                      <Image src={formAvatar} alt="Preview" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Biografía de Viajero / Explorador
                </label>
                <textarea
                  rows={2}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Escribe unas líneas sobre tus intereses culturales y viajes..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Categorías Favoritas */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Temas y Vocaciones Favoritas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CULTURAL_CATEGORIES.map((cat) => {
                    const isSelected = formFavCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </main>
  );
}
