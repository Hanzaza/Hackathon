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
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Star,
  Check,
  Heart,
  Bookmark,
  Sun,
  Moon,
  Laptop,
  ArrowRight,
  Send,
  AlertCircle,
  Clock,
  Trash2,
  Layers,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  NICARAGUA_GEO_DATA,
  getMunicipalitiesByDepartment,
  getDepartmentByMunicipality,
} from '@/data/nicaraguaGeo';
import PrecolombianPattern from '../ui/PrecolombianPattern';

// Categorías culturales oficiales ROOTS
const CULTURAL_CATEGORIES = [
  'Literatura & Poesía',
  'Artesanías & Cerámica',
  'Folclore & Marimba',
  'Muralismo & Arte Urbano',
  'Gastronomía Tradicional',
  'Café & Cacao de Altura',
  'Patrimonio Colonial',
  'Artesanías en Cuero & Madera',
  'Música & Danza Caribeña',
  'Arquitectura & Tradición',
];

// Sellos oficiales del Pasaporte Cultural de Ciudades Creativas
interface CityStamp {
  name: string;
  slug: string;
  badge: string;
  icon: string;
  stamped: boolean;
  date?: string;
  points: number;
}

const PASSPORT_STAMPS: CityStamp[] = [
  { name: 'Masaya', slug: 'masaya', badge: 'Folclore & Artesanía', icon: '🎭', stamped: true, date: '14 Ago 2026', points: 150 },
  { name: 'León', slug: 'leon', badge: 'Poesía & Literatura', icon: '📜', stamped: true, date: '22 Ago 2026', points: 180 },
  { name: 'Granada', slug: 'granada', badge: 'Arquitectura & Diseño', icon: '🏛️', stamped: true, date: '01 Sep 2026', points: 200 },
  { name: 'San Juan de Oriente', slug: 'san-juan-de-oriente', badge: 'Barro Ancestral', icon: '🏺', stamped: true, date: '03 Sep 2026', points: 160 },
  { name: 'Estelí', slug: 'esteli', badge: 'Muralismo & Guitarras', icon: '🎨', stamped: false, points: 150 },
  { name: 'Bluefields', slug: 'bluefields', badge: 'Música & Maypole', icon: '🥁', stamped: false, points: 220 },
  { name: 'Matagalpa', slug: 'matagalpa', badge: 'Café & Montaña', icon: '☕', stamped: false, points: 170 },
  { name: 'Juigalpa', slug: 'juigalpa', badge: 'Arqueología & Chontales', icon: '🐂', stamped: false, points: 140 },
  { name: 'Managua', slug: 'managua', badge: 'Epicentro Cultural', icon: '🌆', stamped: false, points: 150 },
  { name: 'Nagarote', slug: 'nagarote', badge: 'Sabor & Municipio Azul', icon: '🧀', stamped: false, points: 130 },
];

// Medallas y Logros de Explorador
interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  progress: number;
  total: number;
  pointsReward: number;
  unlockedDate?: string;
}

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'maestro_alfarero',
    title: 'Maestro Alfarero',
    description: 'Visitaste y experimentaste el modelado de barro en San Juan de Oriente.',
    icon: '🏺',
    category: 'Artesanía',
    unlocked: true,
    progress: 1,
    total: 1,
    pointsReward: 150,
    unlockedDate: '03 Sep 2026',
  },
  {
    id: 'poeta_dariano',
    title: 'Poeta Dariano',
    description: 'Completaste el recorrido de la Ruta Poética y Catedralicia en León.',
    icon: '📜',
    category: 'Literatura',
    unlocked: true,
    progress: 1,
    total: 1,
    pointsReward: 180,
    unlockedDate: '22 Ago 2026',
  },
  {
    id: 'gran_folclorista',
    title: 'Gran Folclorista',
    description: 'Participaste en una muestra vivencial de marimba y danza en Masaya.',
    icon: '🎭',
    category: 'Folclore',
    unlocked: true,
    progress: 1,
    total: 1,
    pointsReward: 150,
    unlockedDate: '14 Ago 2026',
  },
  {
    id: 'guardian_muralismo',
    title: 'Guardián del Muralismo',
    description: 'Descubrí 4 de los murales patrimoniales del circuito heroico de Estelí.',
    icon: '🎨',
    category: 'Arte Urbano',
    unlocked: false,
    progress: 3,
    total: 4,
    pointsReward: 160,
  },
  {
    id: 'catador_cafe',
    title: 'Catador de Altura',
    description: 'Recorré 3 fincas patrimoniales y museos de café en Matagalpa.',
    icon: '☕',
    category: 'Gastronomía',
    unlocked: false,
    progress: 1,
    total: 3,
    pointsReward: 180,
  },
  {
    id: 'ritmo_caribeno',
    title: 'Ritmo Caribeño',
    description: 'Celebrá y conocé la historia multicultural del Palo de Mayo en Bluefields.',
    icon: '🥁',
    category: 'Música',
    unlocked: false,
    progress: 0,
    total: 1,
    pointsReward: 250,
  },
  {
    id: 'explorador_bicentenario',
    title: 'Explorador Bicentenario',
    description: 'Completá 5 circuitos en al menos 3 departamentos diferentes.',
    icon: '🗺️',
    category: 'Movilidad',
    unlocked: false,
    progress: 3,
    total: 5,
    pointsReward: 300,
  },
  {
    id: 'embajador_roots',
    title: 'Embajador de Identidad',
    description: 'Alcanzá 500 puntos de experiencia cultural en la plataforma ROOTS.',
    icon: '🌟',
    category: 'Comunidad',
    unlocked: true,
    progress: 690,
    total: 500,
    pointsReward: 500,
    unlockedDate: '01 Sep 2026',
  },
];

// Eventos guardados por defecto
interface SavedEventItem {
  id: string;
  title: string;
  city: string;
  department: string;
  date: string;
  category: string;
  image: string;
  points: number;
}

const DEFAULT_SAVED_EVENTS: SavedEventItem[] = [
  {
    id: 'ev-1',
    title: 'Festival Nacional de Danza y Marimba Folclórica',
    city: 'Masaya',
    department: 'Masaya',
    date: '18 Sep 2026 • 05:00 PM',
    category: 'Folclore & Marimba',
    image: 'https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&auto=format&fit=crop',
    points: 150,
  },
  {
    id: 'ev-2',
    title: 'Feria Ancestral de Cerámica Precolombina y Torno en Vivo',
    city: 'San Juan de Oriente',
    department: 'Masaya',
    date: '25 Sep 2026 • 10:00 AM',
    category: 'Artesanías & Cerámica',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop',
    points: 120,
  },
  {
    id: 'ev-3',
    title: 'Noche de Poesía Dariana y Música en la Plaza Mayor',
    city: 'León',
    department: 'León',
    date: '02 Oct 2026 • 06:30 PM',
    category: 'Literatura & Poesía',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
    points: 180,
  },
];

export default function UserProfileDashboard() {
  const { user, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  
  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'saved_events' | 'circuits' | 'entrepreneur' | 'settings'>('overview');

  // Modo Claro / Oscuro
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

  // Logros y Eventos Guardados
  const [achievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [savedEvents, setSavedEvents] = useState<SavedEventItem[]>([]);

  // Estados del Formulario de Perfil
  const [formName, setFormName] = useState('');
  const [formLastname, setFormLastname] = useState('');
  const [formDepartment, setFormDepartment] = useState('León');
  const [formCity, setFormCity] = useState('León');
  const [formBio, setFormBio] = useState('');
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
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Inicializar Tema (Light / Dark) y Cargar Eventos Guardados
  useEffect(() => {
    // 1. Cargar tema desde localStorage
    const savedTheme = (localStorage.getItem('roots_theme') as 'light' | 'dark' | 'system') || 'light';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);

    // 2. Cargar eventos guardados
    try {
      const stored = localStorage.getItem('roots_saved_events');
      if (stored) {
        setSavedEvents(JSON.parse(stored));
      } else {
        setSavedEvents(DEFAULT_SAVED_EVENTS);
        localStorage.setItem('roots_saved_events', JSON.stringify(DEFAULT_SAVED_EVENTS));
      }
    } catch {
      setSavedEvents(DEFAULT_SAVED_EVENTS);
    }
  }, []);

  // Función para cambiar y persistir Tema
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeMode(newTheme);
    localStorage.setItem('roots_theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Cargar datos de usuario
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
      setFormFavCategories(user.favorite_categories || ['Literatura & Poesía', 'Artesanías & Cerámica']);
      setFormNotifications(user.notifications_enabled ?? true);
    }
  }, [user]);

  // Manejo de eliminar evento guardado
  const handleRemoveSavedEvent = (id: string) => {
    const updated = savedEvents.filter((e) => e.id !== id);
    setSavedEvents(updated);
    localStorage.setItem('roots_saved_events', JSON.stringify(updated));
  };

  // Guardar Cambios de Perfil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(false);

    try {
      const success = await updateProfile({
        name: formName.trim(),
        lastname: formLastname.trim(),
        city: formCity,
        bio: formBio.trim(),
        favorite_categories: formFavCategories,
        notifications_enabled: formNotifications,
      });

      if (success) {
        setProfileSuccessMsg(true);
        setTimeout(() => setProfileSuccessMsg(false), 3000);
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Enviar Solicitud de Emprendedor
  const handleSubmitEntrepreneur = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRequest(true);

    try {
      if (supabase && user?.id) {
        await supabase.from('entrepreneur_requests').insert({
          user_id: user.id,
          business_name: businessName.trim(),
          business_type: businessType,
          department: businessDepartment,
          city: businessCity,
          address: businessAddress.trim(),
          description: businessDescription.trim(),
          status: 'pending',
        });
      }
      setRequestSubmitted(true);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Pantalla para usuarios no autenticados
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#0F3A2E] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        <div className="relative max-w-md w-full bg-black/40 border border-white/15 rounded-[3rem] p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="relative w-28 h-28 mx-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
            <Image src="/logos/roots-emblem-white.png" alt="ROOTS" fill sizes="112px" className="object-contain" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-wider uppercase text-white">
              Pasaporte ROOTS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Iniciá sesión para acceder a tus medallas de explorador, circuitos completados, eventos guardados y acreditación comunitaria.
            </p>
          </div>

          <button
            type="button"
            onClick={openAuthModal}
            className="w-full py-4 rounded-2xl bg-[#00A8A7] hover:bg-[#007F7E] text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Ingresar a Mi Perfil</span>
          </button>
        </div>

        <div className="absolute bottom-0 w-full pointer-events-none">
          <PrecolombianPattern fillColor="#0A261E" strokeColor="#00A8A7" opacity={0.3} height="120px" />
        </div>
      </main>
    );
  }

  // Conteo de medallas desbloqueadas
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;
  const stampedCitiesCount = PASSPORT_STAMPS.filter((s) => s.stamped).length;

  return (
    <main className="min-h-screen bg-[#F5EFE6] dark:bg-[#0A1217] text-slate-800 dark:text-slate-100 font-sans pb-36 pt-4 lg:pt-24 transition-colors duration-300">
      
      {/* ================= 1. HEADER DE PERFIL OFICIAL ROOTS ================= */}
      <section className="w-[min(94vw,1400px)] mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-8 lg:mb-10">
        <div className="relative rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden bg-[#0F3A2E] text-white shadow-xl border border-white/10 p-6 sm:p-10 lg:p-12">
          
          {/* Halo de luz turquesa ambiental */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -top-24 right-0 w-96 h-96 bg-[#00A8A7]/20 blur-[100px] rounded-full" 
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 lg:gap-10">
            
            {/* Información del Usuario */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 text-center sm:text-left">
              
              {/* Avatar con anillo oficial ROOTS */}
              <div className="relative shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-[#00A8A7] shadow-xl bg-slate-900">
                  <Image
                    src={user.avatar || '/icons/roots/profile-mask.png'}
                    alt={user.name}
                    fill
                    sizes="(min-width: 1024px) 128px, 112px"
                    className="object-contain p-2"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#3BA455] border-2 border-white flex items-center justify-center text-white text-[11px] lg:text-xs shadow-sm" title="Usuario Verificado">
                  ✓
                </span>
              </div>

              {/* Textos y Badges */}
              <div className="space-y-2 lg:space-y-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 lg:gap-2.5">
                  <span className="px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#00A8A7]/20 text-[#00A8A7] border border-[#00A8A7]/30 text-[11px] lg:text-xs font-black uppercase tracking-wider">
                    {user.role === 'admin' ? '🛡️ Administrador' : user.role === 'entrepreneur' ? '🏪 Emprendedor Verificado' : '🧭 Explorador Cultural'}
                  </span>
                  <span className="px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#F4A43B]/20 text-[#F4A43B] border border-[#F4A43B]/30 text-[11px] lg:text-xs font-bold">
                    Nivel {user.level || 3} • Aventurero
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {user.name} {user.lastname}
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#00A8A7]" />
                  <span>{user.city || 'León'}, Nicaragua</span>
                  <span className="text-white/40">•</span>
                  <span>{user.email}</span>
                </p>

                {user.bio && (
                  <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl leading-relaxed pt-1">
                    "{user.bio}"
                  </p>
                )}
              </div>

            </div>

            {/* Puntos y Acciones Rápidas */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 lg:gap-4 w-full md:w-auto justify-center shrink-0">
              
              {/* Tarjeta de Puntos ROOTS */}
              <div className="px-5 py-3 sm:px-6 sm:py-3.5 lg:px-8 lg:py-4.5 rounded-2xl lg:rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md text-center md:text-right shadow-sm">
                <span className="text-[10px] lg:text-xs font-extrabold uppercase tracking-widest text-[#00A8A7] block">
                  Puntos Acumulados
                </span>
                <div className="flex items-center justify-center md:justify-end gap-2 mt-0.5">
                  <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-[#F4D44D]" />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">{user.points || 690}</span>
                  <span className="text-xs lg:text-sm text-slate-300 font-bold">pts</span>
                </div>
              </div>

              {/* Botón Cerrar Sesión */}
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl bg-white/5 hover:bg-rose-600/30 text-white/80 hover:text-white border border-white/10 text-xs lg:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span>Cerrar Sesión</span>
              </button>

            </div>

          </div>

          {/* Estadísticas Resumidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-white/10 text-center">
            <div className="p-3.5 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#00A8A7]">{stampedCitiesCount}/10</span>
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-slate-300 block uppercase tracking-wider mt-1">Sellos de Ciudades</span>
            </div>
            <div className="p-3.5 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F4A43B]">{unlockedAchievementsCount}/{achievements.length}</span>
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-slate-300 block uppercase tracking-wider mt-1">Medallas Desbloqueadas</span>
            </div>
            <div className="p-3.5 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3BA455]">{savedEvents.length}</span>
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-slate-300 block uppercase tracking-wider mt-1">Eventos Guardados</span>
            </div>
            <div className="p-3.5 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F4D44D]">4 Circuitos</span>
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-slate-300 block uppercase tracking-wider mt-1">Rutas Exploradas</span>
            </div>
          </div>

          {/* Patrón inferior decorativo */}
          <div className="absolute bottom-0 inset-x-0 pointer-events-none opacity-25">
            <PrecolombianPattern variant="diamonds" className="w-full h-8 text-[#00A8A7]" />
          </div>

        </div>
      </section>

      {/* ================= 2. PESTAÑAS DE NAVEGACIÓN DEL PERFIL ================= */}
      <section className="w-[min(94vw,1400px)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 lg:mb-10">
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
          
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 lg:gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-xs sm:text-sm lg:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0F3A2E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Compass className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-[#00A8A7]" />
            <span>Pasaporte Cultural</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 lg:gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-xs sm:text-sm lg:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-[#0F3A2E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Award className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-[#F4A43B]" />
            <span>Logros & Medallas ({unlockedAchievementsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved_events')}
            className={`flex items-center gap-2 lg:gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-xs sm:text-sm lg:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'saved_events'
                ? 'bg-[#0F3A2E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Bookmark className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-[#00A8A7]" />
            <span>Eventos Guardados ({savedEvents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('circuits')}
            className={`flex items-center gap-2 lg:gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-xs sm:text-sm lg:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'circuits'
                ? 'bg-[#0F3A2E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Layers className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-[#3BA455]" />
            <span>Mis Circuitos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('entrepreneur')}
            className={`flex items-center gap-2 lg:gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-xs sm:text-sm lg:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'entrepreneur'
                ? 'bg-[#0F3A2E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Store className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-[#F4D44D]" />
            <span>Emprendimiento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 lg:gap-2.5 px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl text-xs sm:text-sm lg:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#0F3A2E] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Settings className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-slate-400" />
            <span>Ajustes & Tema</span>
          </button>

        </div>
      </section>

      {/* ================= 3. CONTENIDO PRINCIPAL SEGÚN PESTAÑA ================= */}
      <div className="w-[min(94vw,1400px)] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= TAB 1: RESUMEN / PASAPORTE CULTURAL ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 lg:space-y-10 animate-fadeIn">
            
            {/* Tarjeta del Pasaporte Cultural con Sellos */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#00A8A7]/10 text-[#007F7E] dark:text-[#00A8A7] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sellos de Ciudades Creativas</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                    Pasaporte de Explorador Cultural
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                    Visitá los atractivos y circuitos geolocalizados de cada municipio para coleccionar todos los sellos oficiales.
                  </p>
                </div>

                <span className="px-4 py-2 lg:px-5 lg:py-2.5 rounded-2xl bg-[#F5EFE6] dark:bg-slate-800 text-[#0F3A2E] dark:text-[#00A8A7] font-black text-xs lg:text-sm shrink-0 self-start sm:self-auto shadow-xs">
                  {stampedCitiesCount} de 10 Sellos Conseguidos
                </span>
              </div>

              {/* Rejilla de Sellos de las 10 Ciudades */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
                {PASSPORT_STAMPS.map((stamp) => (
                  <div
                    key={stamp.slug}
                    className={`relative p-4 sm:p-5 lg:p-6 rounded-3xl lg:rounded-[2rem] border text-center transition-all flex flex-col items-center justify-between min-h-[145px] sm:min-h-[160px] lg:min-h-[190px] hover:-translate-y-1 hover:shadow-md cursor-default ${
                      stamp.stamped
                        ? 'bg-[#0F3A2E]/5 dark:bg-[#00A8A7]/10 border-[#00A8A7]/40 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-white/5 opacity-60'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-1.5 lg:mb-2 drop-shadow-xs">{stamp.icon}</div>
                    <div>
                      <h4 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white">{stamp.name}</h4>
                      <p className="text-[10px] sm:text-xs lg:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{stamp.badge}</p>
                    </div>

                    <div className="mt-2.5 lg:mt-3.5 w-full pt-2 lg:pt-3 border-t border-slate-200/60 dark:border-white/10">
                      {stamp.stamped ? (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs lg:text-xs font-black text-[#007F7E] dark:text-[#00A8A7]">
                          <CheckCircle2 className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          <span>Sellado</span>
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs lg:text-xs font-bold text-slate-400">
                          Por explorar
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accesos directos a Eventos Guardados y Próximos Circuitos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Eventos Guardados Recientes */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Bookmark className="w-4 h-4 lg:w-5 lg:h-5 text-[#00A8A7]" />
                      <span>Eventos Guardados ({savedEvents.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('saved_events')}
                      className="text-xs lg:text-sm font-bold text-[#007F7E] dark:text-[#00A8A7] hover:underline"
                    >
                      Ver todos →
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {savedEvents.slice(0, 2).map((ev) => (
                      <div key={ev.id} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 sm:gap-4 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden relative shrink-0 shadow-xs">
                            <Image src={ev.image} alt={ev.title} fill sizes="56px" className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white line-clamp-1">{ev.title}</h4>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#00A8A7]" />
                              <span>{ev.city}</span> • <span>{ev.date.split('•')[0]}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-xs lg:text-sm font-black text-[#F4A43B] shrink-0">+{ev.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/agenda"
                  className="mt-6 w-full py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-[#F5EFE6] dark:bg-slate-800 text-[#0F3A2E] dark:text-white text-center text-xs lg:text-sm font-black hover:bg-[#0F3A2E] hover:text-white transition-all shadow-xs"
                >
                  Explorar Agenda Cultural Completa
                </Link>
              </div>

              {/* Próximas Medallas por Desbloquear */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 lg:w-5 lg:h-5 text-[#F4A43B]" />
                      <span>Siguiente Reto Cultural</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('achievements')}
                      className="text-xs lg:text-sm font-bold text-[#F4A43B] hover:underline"
                    >
                      Ver medallas →
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {achievements.filter((a) => !a.unlocked).slice(0, 2).map((ach) => (
                      <div key={ach.id} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 sm:gap-4 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3.5">
                          <span className="text-2xl sm:text-3xl">{ach.icon}</span>
                          <div>
                            <h4 className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ach.category}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-black text-[#0F3A2E] dark:text-[#00A8A7]">{ach.progress}/{ach.total}</span>
                          <span className="block text-[10px] sm:text-xs text-slate-400">Progreso</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/circuitos"
                  className="mt-6 w-full py-3.5 lg:py-4 rounded-xl lg:rounded-2xl bg-[#0F3A2E] text-white text-center text-xs lg:text-sm font-black hover:bg-[#0A261E] transition-all shadow-xs"
                >
                  Recorrer Circuitos para Ganar Puntos
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 2: LOGROS & MEDALLAS CULTURALES ================= */}
        {activeTab === 'achievements' && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#F4A43B]/15 text-[#F4A43B] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5" />
                    <span>Medallero Nacional</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                    Medallas y Logros de Identidad
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                    Desbloqueá reconocimientos exclusivos participando en las tradiciones y rutas de Nicaragua.
                  </p>
                </div>

                <div className="px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl bg-[#0F3A2E] text-white text-center self-start sm:self-auto shadow-sm">
                  <span className="text-[10px] lg:text-xs uppercase font-bold text-[#00A8A7] block tracking-wider">Desbloqueadas</span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black">{unlockedAchievementsCount} de {achievements.length}</span>
                </div>
              </div>

              {/* Lista Completa de Logros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-5 sm:p-6 lg:p-7 rounded-3xl border transition-all flex items-start gap-4 lg:gap-5 ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-white to-[#00A8A7]/5 dark:from-slate-900 dark:to-slate-800 border-[#00A8A7]/30 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 opacity-75'
                    }`}
                  >
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl shrink-0 shadow-sm ${
                      ach.unlocked ? 'bg-[#00A8A7]/20 border border-[#00A8A7]/40' : 'bg-slate-200 dark:bg-slate-700 grayscale'
                    }`}>
                      {ach.icon}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] lg:text-xs font-black uppercase tracking-wider text-[#007F7E] dark:text-[#00A8A7]">
                          {ach.category}
                        </span>
                        <span className="text-xs lg:text-sm font-black text-[#F4A43B]">
                          +{ach.pointsReward} pts
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white">
                        {ach.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {ach.description}
                      </p>

                      <div className="pt-2">
                        {ach.unlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3BA455]/15 text-[#3BA455] text-[10px] lg:text-xs font-black">
                            <CheckCircle2 className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span>Desbloqueado • {ach.unlockedDate}</span>
                          </span>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#F4A43B] h-full rounded-full transition-all"
                                style={{ width: `${(ach.progress / ach.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400">
                              Progreso: {ach.progress} de {ach.total}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 3: EVENTOS GUARDADOS ================= */}
        {activeTab === 'saved_events' && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#00A8A7]/15 text-[#007F7E] dark:text-[#00A8A7] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Tu Agenda Personal</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                    Eventos y Ferias Guardadas
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                    Tené a mano tus celebraciones y talleres favoritos para no perderte ninguna experiencia cultural.
                  </p>
                </div>

                <Link
                  href="/agenda"
                  className="px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl bg-[#0F3A2E] text-white text-xs lg:text-sm font-black hover:bg-[#0A261E] transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-[#00A8A7]" />
                  <span>Explorar Más en la Agenda</span>
                </Link>
              </div>

              {/* Lista de Eventos Guardados */}
              {savedEvents.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Bookmark className="w-8 h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">No tenés eventos guardados todavía</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Explorá las ferias, talleres y festivales de las Ciudades Creativas y guardá tus favoritos aquí.</p>
                  <Link href="/agenda" className="inline-block px-6 py-3 rounded-xl bg-[#00A8A7] text-slate-950 font-black text-xs sm:text-sm shadow-sm">
                    Ver Agenda Cultural
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {savedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-800/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-48 lg:h-52 w-full">
                        <Image src={event.image} alt={event.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-[10px] lg:text-xs font-black uppercase text-[#007F7E] dark:text-[#00A8A7]">
                          {event.category}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedEvent(event.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/80 text-rose-500 hover:text-rose-700 shadow-sm cursor-pointer"
                          title="Eliminar de guardados"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-4 sm:p-5 lg:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs lg:text-sm text-[#007F7E] dark:text-[#00A8A7] font-semibold mb-1">
                            <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            <span>{event.city}, {event.department}</span>
                          </div>
                          <h4 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                            {event.title}
                          </h4>
                          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{event.date}</span>
                          </p>
                        </div>

                        <div className="pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                          <span className="text-xs lg:text-sm font-black text-[#F4A43B]">+{event.points} pts</span>
                          <Link href="/agenda" className="text-xs lg:text-sm font-bold text-[#0F3A2E] dark:text-[#00A8A7] hover:underline flex items-center gap-1">
                            <span>Ver detalles</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* ================= TAB 4: MIS CIRCUITOS EXPLORADOS ================= */}
        {activeTab === 'circuits' && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#3BA455]/15 text-[#3BA455] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Rutas Turísticas Vivas</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                    Circuitos y Rutas de Viaje
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                    Historial de recorridos geolocalizados y rutas patrimoniales registradas en tu pasaporte.
                  </p>
                </div>

                <Link
                  href="/circuitos"
                  className="px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl bg-[#0F3A2E] text-white text-xs lg:text-sm font-black hover:bg-[#0A261E] transition-all shadow-sm"
                >
                  Descubrir Nuevas Rutas
                </Link>
              </div>

              {/* Grid de Circuitos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                
                <div className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#3BA455]/20 text-[#3BA455] text-[10px] lg:text-xs font-black uppercase">Completado</span>
                    <span className="text-xs lg:text-sm font-black text-[#F4A43B]">+200 pts</span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white">Ruta Colonial y de los Templos de Granada</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Recorrido por la Catedral, Convento San Francisco y Malecón del Gran Lago.</p>
                  <div className="pt-2 flex items-center justify-between text-xs lg:text-sm text-slate-500">
                    <span>📍 Granada • 3.5 km</span>
                    <span className="font-bold text-[#007F7E] dark:text-[#00A8A7]">Sello Obtenido ✓</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#3BA455]/20 text-[#3BA455] text-[10px] lg:text-xs font-black uppercase">Completado</span>
                    <span className="text-xs lg:text-sm font-black text-[#F4A43B]">+180 pts</span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white">Circuito Dariano y Murales Históricos de León</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Visita al Museo Archivo Rubén Darío, Insigne Basílica y barrio de Sutiaba.</p>
                  <div className="pt-2 flex items-center justify-between text-xs lg:text-sm text-slate-500">
                    <span>📍 León • 4.2 km</span>
                    <span className="font-bold text-[#007F7E] dark:text-[#00A8A7]">Sello Obtenido ✓</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#F4A43B]/20 text-[#F4A43B] text-[10px] lg:text-xs font-black uppercase">En Progreso (65%)</span>
                    <span className="text-xs lg:text-sm font-black text-[#F4A43B]">+160 pts</span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white">Ruta de los Talleres del Barro Ancestral</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Conexión directa con artesanos y maestros del torno en San Juan de Oriente.</p>
                  <div className="pt-2 flex items-center justify-between text-xs lg:text-sm text-slate-500">
                    <span>📍 San Juan de Oriente</span>
                    <Link href="/circuitos" className="font-bold text-[#0F3A2E] dark:text-[#00A8A7] hover:underline">Continuar ruta →</Link>
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] lg:text-xs font-black uppercase">Por Iniciar</span>
                    <span className="text-xs lg:text-sm font-black text-[#F4A43B]">+220 pts</span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white">Circuito Multicultural y Bahía de Bluefields</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Inmersión en las danzas, historia garífuna, creole y música caribeña.</p>
                  <div className="pt-2 flex items-center justify-between text-xs lg:text-sm text-slate-500">
                    <span>📍 Bluefields</span>
                    <Link href="/circuitos" className="font-bold text-[#0F3A2E] dark:text-[#00A8A7] hover:underline">Iniciar ruta →</Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 5: ACREDITACIÓN DE EMPRENDIMIENTO ================= */}
        {activeTab === 'entrepreneur' && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#F4D44D]/20 text-[#8B5E3C] dark:text-[#F4D44D] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                  <Store className="w-3.5 h-3.5" />
                  <span>Red Nacional de Negocios Creativos</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                  Acreditación de Emprendedor Cultural
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                  Si poseés un taller artesanal, restaurante tradicional, galería o espacio de experiencias, podés solicitar tu acreditación oficial de la Red de Ciudades Creativas.
                </p>
              </div>

              {requestSubmitted ? (
                <div className="mt-8 lg:mt-10 p-6 lg:p-8 rounded-3xl bg-[#00A8A7]/15 border border-[#00A8A7]/30 text-[#0F3A2E] dark:text-white text-center max-w-lg mx-auto space-y-3.5 shadow-xs">
                  <CheckCircle2 className="w-12 h-12 lg:w-14 lg:h-14 mx-auto text-[#00A8A7]" />
                  <h3 className="text-lg lg:text-xl font-black">¡Solicitud Enviada con Éxito!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    El equipo municipal y de curaduría de Ciudades Creativas evaluará los datos de tu taller o negocio para incluirte en el mapa oficial.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitEntrepreneur} className="mt-8 lg:mt-10 space-y-5 max-w-2xl">
                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Nombre del Taller / Negocio
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ej. Taller de Cerámica Los Chorotegas"
                      className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                    <div>
                      <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Categoría
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                      >
                        <option value="artesania">Artesanía & Cerámica</option>
                        <option value="gastronomia">Gastronomía Tradicional</option>
                        <option value="danza">Música & Danza</option>
                        <option value="turismo">Tours & Experiencias</option>
                        <option value="cafe">Café & Fincas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Municipio
                      </label>
                      <input
                        type="text"
                        required
                        value={businessCity}
                        onChange={(e) => setBusinessCity(e.target.value)}
                        placeholder="Ej. San Juan de Oriente"
                        className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Breve Descripción de tu Actividad
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      placeholder="Contanos sobre tu arte, productos y qué hace único a tu taller..."
                      className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRequest}
                    className="w-full py-3.5 lg:py-4 rounded-2xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-black text-sm lg:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4 text-[#00A8A7]" />
                    <span>{isSubmittingRequest ? 'Enviando postulación...' : 'Enviar Solicitud de Acreditación'}</span>
                  </button>
                </form>
              )}

            </div>

          </div>
        )}

        {/* ================= TAB 6: AJUSTES & MODO CLARO / OSCURO ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm space-y-8 lg:space-y-10">
              
              {/* Encabezado */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#00A8A7]/15 text-[#007F7E] dark:text-[#00A8A7] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Personalización del Pasaporte</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                  Ajustes y Preferencias de Cuenta
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                  Configurá el aspecto visual, información personal e intereses culturales.
                </p>
              </div>

              {/* 1. SELECTOR DE MODO CLARO / OSCURO (LIGHT / DARK MODE) */}
              <div className="p-6 lg:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Tema Visual de la Aplicación</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Elegí la apariencia visual para explorar la plataforma.</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#007F7E] dark:text-[#00A8A7] uppercase tracking-wider">
                    {themeMode === 'light' ? 'Modo Claro' : themeMode === 'dark' ? 'Modo Oscuro' : 'Automático'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3.5 lg:gap-5">
                  
                  {/* Opción Claro */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl border text-center transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                      themeMode === 'light'
                        ? 'bg-white border-[#00A8A7] shadow-md ring-2 ring-[#00A8A7]'
                        : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Modo Claro</span>
                    <span className="text-[10px] sm:text-xs text-slate-500">Luminoso & Nítido</span>
                  </button>

                  {/* Opción Oscuro */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl border text-center transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                      themeMode === 'dark'
                        ? 'bg-slate-900 border-[#00A8A7] shadow-md ring-2 ring-[#00A8A7]'
                        : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0F3A2E] text-[#00A8A7] flex items-center justify-center">
                      <Moon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Modo Oscuro</span>
                    <span className="text-[10px] sm:text-xs text-slate-500">Inmersivo & Elegante</span>
                  </button>

                  {/* Opción Sistema */}
                  <button
                    type="button"
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl border text-center transition-all flex flex-col items-center gap-2.5 cursor-pointer ${
                      themeMode === 'system'
                        ? 'bg-white dark:bg-slate-900 border-[#00A8A7] shadow-md ring-2 ring-[#00A8A7]'
                        : 'bg-white/60 dark:bg-slate-800 border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                      <Laptop className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Sistema</span>
                    <span className="text-[10px] sm:text-xs text-slate-500">Sincronizado</span>
                  </button>

                </div>
              </div>

              {/* 2. FORMULARIO DE DATOS DEL PERFIL */}
              <form onSubmit={handleSaveProfile} className="space-y-6 lg:space-y-8">
                
                {profileSuccessMsg && (
                  <div className="p-4 rounded-2xl bg-[#3BA455]/15 border border-[#3BA455]/30 text-[#3BA455] text-xs sm:text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Tus cambios de perfil se guardaron correctamente!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={formLastname}
                      onChange={(e) => setFormLastname(e.target.value)}
                      className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Departamento
                    </label>
                    <select
                      value={formDepartment}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setFormDepartment(newDept);
                        const muns = getMunicipalitiesByDepartment(newDept);
                        setFormCity(muns[0] || 'León');
                      }}
                      className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                    >
                      {NICARAGUA_GEO_DATA.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Municipio
                    </label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                    >
                      {getMunicipalitiesByDepartment(formDepartment).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Biografía / Qué te apasiona de la cultura nicaragüense
                  </label>
                  <textarea
                    rows={3}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Contanos qué tradiciones, ciudades o artesanías te inspiran..."
                    className="w-full px-4 py-3 lg:px-5 lg:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                  />
                </div>

                {/* 3. PREFERENCIAS CULTURALES */}
                <div>
                  <label className="block text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                    Tus Categorías Culturales Favoritas
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {CULTURAL_CATEGORIES.map((cat) => {
                      const isSelected = formFavCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFormFavCategories(formFavCategories.filter((c) => c !== cat));
                            } else {
                              setFormFavCategories([...formFavCategories, cat]);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0F3A2E] text-white border border-[#00A8A7]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-slate-300'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. NOTIFICACIONES */}
                <div className="p-5 lg:p-6 rounded-2xl lg:rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 dark:text-white">Notificaciones de Nuevos Eventos y Rutas</h4>
                    <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mt-0.5">Recibí alertas sobre ferias, festividades y circuitos habilitados en tus ciudades favoritas.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formNotifications}
                    onChange={(e) => setFormNotifications(e.target.checked)}
                    className="w-5 h-5 lg:w-6 lg:h-6 accent-[#00A8A7] rounded cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="py-3.5 px-8 lg:py-4 lg:px-10 rounded-2xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-black text-xs sm:text-sm lg:text-base shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isSavingProfile ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
                </button>

              </form>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}
