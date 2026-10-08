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
  ChevronLeft,
  X,
  QrCode,
  Share2,
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
  LayoutDashboard,
  Users,
  Camera,
  MessageSquare,
  Trophy,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { adminService, CreativeRouteItem, AchievementItem as AdminAchievementItem } from '@/services/adminService';
import { routeProgressService, RouteProgressData } from '@/services/routeProgressService';
import {
  NICARAGUA_GEO_DATA,
  getMunicipalitiesByDepartment,
  getDepartmentByMunicipality,
} from '@/data/nicaraguaGeo';

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
  const isAdmin = user?.role === 'admin';
  
  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'admin_overview' | 'overview' | 'achievements' | 'saved_events' | 'circuits' | 'entrepreneur' | 'settings'>('overview');

  // Si el usuario es administrador, asegurar que su pestaña por defecto sea la de gestión
  useEffect(() => {
    if (isAdmin && (activeTab === 'overview' || activeTab === 'achievements' || activeTab === 'circuits' || activeTab === 'entrepreneur')) {
      setActiveTab('admin_overview');
    }
  }, [isAdmin, activeTab]);

  // Modo Claro / Oscuro
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

  // Logros y Eventos Guardados
  const [achievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [savedEvents, setSavedEvents] = useState<SavedEventItem[]>([]);

  // Estados de Rutas y Gamificación en Tiempo Real
  const [dbAchievements, setDbAchievements] = useState<AdminAchievementItem[]>([]);
  const [routesProgressList, setRoutesProgressList] = useState<Array<{
    route: CreativeRouteItem;
    places: Array<{ id: string; name: string }>;
    progress: RouteProgressData;
    linkedAchievement?: AdminAchievementItem;
  }>>([]);
  const [userUnlockedIds, setUserUnlockedIds] = useState<string[]>([]);
  const [isLoadingGamification, setIsLoadingGamification] = useState(true);

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

  // Estados de Modales y Vistas Emergentes Accesibles
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCopiedPublicLink, setIsCopiedPublicLink] = useState(false);

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

  // Cargar datos de gamificación y progreso de rutas en tiempo real
  const loadGamificationData = async () => {
    setIsLoadingGamification(true);
    try {
      const [routesData, achievementsData, locationsRes] = await Promise.all([
        adminService.getRoutes(),
        adminService.getAchievements(),
        fetch('/api/locations').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      const effectiveAchievements = achievementsData && achievementsData.length > 0 ? achievementsData : [];
      setDbAchievements(effectiveAchievements);

      const unlockedIds = routeProgressService.getUserUnlockedAchievements(user?.id || '');
      setUserUnlockedIds(unlockedIds);

      // Agrupar lugares por route_id o route_slug
      const placesByRoute: Record<string, Array<{ id: string; name: string }>> = {};
      if (locationsRes && Array.isArray(locationsRes.features)) {
        locationsRes.features.forEach((f: any) => {
          const pRouteId = f.properties.route_id;
          const pRouteSlug = f.properties.route_slug;
          const placeObj = {
            id: f.properties.id || f.properties.slug,
            name: f.properties.name,
          };
          if (pRouteId) {
            if (!placesByRoute[pRouteId]) placesByRoute[pRouteId] = [];
            placesByRoute[pRouteId].push(placeObj);
          }
          if (pRouteSlug) {
            if (!placesByRoute[pRouteSlug]) placesByRoute[pRouteSlug] = [];
            placesByRoute[pRouteSlug].push(placeObj);
          }
        });
      }

      // Procesar rutas y calcular progreso con routeProgressService
      const effectiveRoutes = routesData && routesData.length > 0 ? routesData : [];
      const computedList = effectiveRoutes.map((r) => {
        let places = placesByRoute[r.id] || placesByRoute[r.slug] || [];
        if (places.length === 0) {
          if (r.slug?.includes('dario') || r.name.toLowerCase().includes('darío') || r.name.toLowerCase().includes('dario')) {
            places = [
              { id: 'casa-museo-ruben-dario', name: 'Casa Museo Rubén Darío' },
              { id: 'catedral-insigne-leon', name: 'Real e Insigne Basílica Catedral de León' },
              { id: 'murales-sutiaba', name: 'Murales y Memoria Histórica de Sutiaba' },
            ];
          } else if (r.slug?.includes('tierra-viva') || r.name.toLowerCase().includes('tierra viva')) {
            places = [
              { id: 'taller-ceramica-ancestral', name: 'Taller de Cerámica Precolombina Gregorio Bracamonte' },
              { id: 'mirador-laguna-apoyo', name: 'Mirador de la Laguna de Apoyo' },
            ];
          } else {
            places = [
              { id: `${r.slug}-parada-1`, name: `Hito Central de ${r.name}` },
              { id: `${r.slug}-parada-2`, name: `Espacio Patrimonial y Creativo` },
            ];
          }
        }

        const progress = routeProgressService.getRouteProgress(user?.id || '', r.id, places);

        // Encontrar logro vinculado a la ruta
        const linked = effectiveAchievements.find((a) =>
          (a.route_id && a.route_id === r.id) ||
          (a.achievement_type === 'ruta' && (
            (a.slug === 'guardian-dariano' && (r.slug?.includes('dario') || r.name.toLowerCase().includes('darío') || r.name.toLowerCase().includes('dario'))) ||
            (a.slug === 'explorador-circuitos' && (r.slug?.includes('tierra-viva') || r.name.toLowerCase().includes('tierra viva'))) ||
            (a.slug === r.slug)
          ))
        );

        return {
          route: r,
          places,
          progress,
          linkedAchievement: linked,
        };
      });

      setRoutesProgressList(computedList);
    } catch (err) {
      console.error('Error loading gamification data in profile:', err);
    } finally {
      setIsLoadingGamification(false);
    }
  };

  useEffect(() => {
    loadGamificationData();
    const handleUnlock = () => {
      loadGamificationData();
    };
    window.addEventListener('roots:achievement-unlocked', handleUnlock);
    return () => {
      window.removeEventListener('roots:achievement-unlocked', handleUnlock);
    };
  }, [user?.id]);

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
      </main>
    );
  }

  // Conteo de medallas y rutas desbloqueadas dinámicas
  const completedRoutesCount = routesProgressList.filter((rp) => rp.progress.isCompleted).length;

  const displayAchievements = dbAchievements.length > 0 ? dbAchievements.map((dbAch) => {
    // Si es de tipo ruta, verificar si la ruta ligada está completada o si está en userUnlockedIds
    const linkedRouteItem = routesProgressList.find((rp) => 
      (dbAch.route_id && rp.route.id === dbAch.route_id) ||
      (dbAch.slug === 'guardian-dariano' && (rp.route.slug?.includes('dario') || rp.route.name.toLowerCase().includes('darío') || rp.route.name.toLowerCase().includes('dario'))) ||
      (dbAch.slug === 'explorador-circuitos' && (rp.route.slug?.includes('tierra-viva') || rp.route.name.toLowerCase().includes('tierra viva'))) ||
      (dbAch.slug === rp.route.slug)
    );

    const isUnlocked = 
      userUnlockedIds.includes(dbAch.id) || 
      (linkedRouteItem ? linkedRouteItem.progress.isCompleted : false);

    const progressValue = linkedRouteItem ? linkedRouteItem.progress.completedPlacesCount : (isUnlocked ? (dbAch.required_count || 1) : 0);
    const totalValue = linkedRouteItem ? linkedRouteItem.progress.totalPlaces : (dbAch.required_count || 1);

    return {
      id: dbAch.id,
      title: dbAch.name,
      description: dbAch.description,
      icon: dbAch.icon || '🏆',
      category: dbAch.achievement_type === 'ruta' ? 'Ruta Creativa' : dbAch.achievement_type === 'evento' ? 'Asistencia Evento' : dbAch.achievement_type === 'resena' ? 'Reseña Ciudadana' : 'Exploración',
      unlocked: isUnlocked,
      progress: progressValue,
      total: totalValue,
      pointsReward: dbAch.points_reward,
      unlockedDate: isUnlocked ? 'Validado Oficialmente' : undefined,
      isRouteType: dbAch.achievement_type === 'ruta',
      linkedRouteName: linkedRouteItem?.route.name || dbAch.route_name || undefined,
      linkedRouteProgress: linkedRouteItem?.progress,
    };
  }) : achievements.map((a) => ({
    ...a,
    isRouteType: false,
    linkedRouteName: undefined,
    linkedRouteProgress: undefined,
  }));

  const unlockedAchievementsCount = displayAchievements.filter((a) => a.unlocked).length;
  const stampedCitiesCount = PASSPORT_STAMPS.filter((s) => s.stamped).length;

  return (
    <main className="min-h-screen bg-[#F5EFE6] dark:bg-[#0A1217] text-slate-800 dark:text-slate-100 font-sans pb-32 pt-0 sm:pt-4 lg:pt-24 transition-colors duration-300 w-full overflow-x-hidden">
      
      {/* ================= 1. HEADER DE PERFIL OFICIAL ROOTS (100% FULL WIDTH EN MÓVIL) ================= */}
      <section className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 mt-0 sm:mt-2 mb-4 sm:mb-8 lg:mb-10">
        <div className="relative w-full rounded-none sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-[#0F3A2E] text-white shadow-xl border-b sm:border border-white/10 p-4 sm:p-8 lg:p-12">
          
          {/* Halo de luz turquesa ambiental */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -top-24 right-0 w-96 h-96 bg-[#00A8A7]/20 blur-[100px] rounded-full" 
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-5 lg:gap-10">
            
            {/* Información del Usuario */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left w-full md:w-auto">
              
              {/* Avatar con anillo oficial ROOTS */}
              <div className="relative shrink-0">
                <div className="relative w-22 h-22 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-[#00A8A7] shadow-xl bg-slate-900 mx-auto">
                  <Image
                    src={user.avatar || '/icons/roots/profile-mask.png'}
                    alt={user.name}
                    fill
                    sizes="(min-width: 1024px) 128px, 112px"
                    className="object-contain p-2"
                  />
                </div>
                <span className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-[#3BA455] border-2 border-white flex items-center justify-center text-white text-[11px] lg:text-xs shadow-sm font-bold" title="Usuario Verificado">
                  ✓
                </span>
              </div>

              {/* Textos y Badges */}
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                  {user.role === 'admin' ? (
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                      🛡️ Administrador General
                    </span>
                  ) : user.role === 'entrepreneur' ? (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      🏪 Emprendedor Verificado
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      🧭 Explorador Cultural
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-[#F4A43B]/20 text-[#F4A43B] border border-[#F4A43B]/30 text-[10px] sm:text-xs font-bold">
                    Nivel {user.level || 3} • Aventurero
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white capitalize">
                  {user.name} {user.lastname}
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 font-medium flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00A8A7]" />
                    <span>{user.city || 'León'}, Nicaragua</span>
                  </span>
                  <span className="text-white/40 hidden sm:inline">•</span>
                  <span className="text-slate-300/80 truncate max-w-[260px] sm:max-w-none">{user.email}</span>
                </p>

                {user.bio && (
                  <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl leading-relaxed pt-0.5">
                    "{user.bio}"
                  </p>
                )}
              </div>

            </div>

            {/* Puntos y Acciones Rápidas (100% Responsive sin desbordes) */}
            <div className="flex flex-col items-stretch sm:items-end gap-2.5 w-full md:w-auto mt-2 sm:mt-0 shrink-0">
              
              {!isAdmin && (
                /* Tarjeta de Puntos ROOTS (Solo para exploradores) */
                <div className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex sm:block items-center justify-between text-left sm:text-right shadow-sm">
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#00A8A7] block">
                    Puntos Acumulados
                  </span>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4D44D]" />
                    <span className="text-xl sm:text-3xl font-black text-white">{user.points || 0}</span>
                    <span className="text-xs text-slate-300 font-bold">pts</span>
                  </div>
                </div>
              )}

              {/* Botones de Acción (Grid en móvil de 2 columnas al 100% de ancho) */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="py-2.5 px-3 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Panel Admin →</span>
                  </Link>
                )}

                {/* Botón Cerrar Sesión */}
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className={`py-2.5 px-3 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-white/15 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center ${!isAdmin ? 'col-span-2' : ''}`}
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
                  <span className="truncate">Cerrar Sesión</span>
                </button>
              </div>

            </div>

          </div>

          {/* Estadísticas Resumidas (Grid 2x2 en móvil / 4 columnas en desktop) */}
          {!isAdmin ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 lg:gap-6 mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 lg:pt-8 border-t border-white/10 text-center">
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#00A8A7]">{stampedCitiesCount}/10</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Sellos de Ciudades</span>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#F4A43B]">{unlockedAchievementsCount}/{displayAchievements.length}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Medallas</span>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#3BA455]">{savedEvents.length}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Eventos Guardados</span>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#F4D44D]">{completedRoutesCount} de {routesProgressList.length > 0 ? routesProgressList.length : 3}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Rutas Completadas</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 lg:gap-6 mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 lg:pt-8 border-t border-white/10 text-center">
              <Link href="/admin?tab=locations" className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs group">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#00A8A7] group-hover:scale-105 inline-block transition-transform">17</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Departamentos</span>
              </Link>
              <Link href="/admin?tab=locations" className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs group">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#F4A43B] group-hover:scale-105 inline-block transition-transform">10</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Ciudades Creativas</span>
              </Link>
              <Link href="/admin?tab=routes" className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs group">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#3BA455] group-hover:scale-105 inline-block transition-transform">3</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Rutas Oficiales</span>
              </Link>
              <Link href="/admin?tab=events" className="p-2.5 sm:p-4 rounded-xl sm:rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 shadow-xs group">
                <span className="text-lg sm:text-2xl lg:text-3xl font-black text-[#F4D44D] group-hover:scale-105 inline-block transition-transform">7</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 block uppercase tracking-wider mt-0.5">Eventos en Agenda</span>
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ================= 2. PESTAÑAS DE NAVEGACIÓN DEL PERFIL ================= */}
      <section className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mb-6 sm:mb-8 lg:mb-10">
        
        {/* Vista Desktop: Tabs horizontales */}
        <div className="hidden lg:flex items-center gap-2.5 lg:gap-3.5 overflow-x-auto pb-2 scrollbar-hide">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('admin_overview')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'admin_overview'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                <span>Gestión del Sistema</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('saved_events')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'saved_events'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Bookmark className="w-4.5 h-4.5 text-[#00A8A7]" />
                <span>Eventos Guardados ({savedEvents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Settings className="w-4.5 h-4.5 text-slate-400" />
                <span>Ajustes & Menú</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#0F3A2E] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Compass className="w-4.5 h-4.5 text-[#00A8A7]" />
                <span>Pasaporte Cultural</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('achievements')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-[#0F3A2E] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Award className="w-4.5 h-4.5 text-[#F4A43B]" />
                <span>Logros & Medallas ({unlockedAchievementsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('saved_events')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'saved_events'
                    ? 'bg-[#0F3A2E] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Bookmark className="w-4.5 h-4.5 text-[#00A8A7]" />
                <span>Eventos Guardados ({savedEvents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('circuits')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'circuits'
                    ? 'bg-[#0F3A2E] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Layers className="w-4.5 h-4.5 text-[#3BA455]" />
                <span>Mis Circuitos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('entrepreneur')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'entrepreneur'
                    ? 'bg-[#0F3A2E] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Store className="w-4.5 h-4.5 text-[#F4D44D]" />
                <span>Emprendimiento</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#0F3A2E] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <Settings className="w-4.5 h-4.5 text-slate-400" />
                <span>Ajustes & Menú</span>
              </button>
            </>
          )}
        </div>

        {/* Vista Móvil: Segmented Grid al 100% de Ancho (Sin desbordes ni scroll cortado) */}
        <div className="lg:hidden w-full">
          {isAdmin ? (
            <div className="grid grid-cols-3 gap-1.5 w-full p-1.5 rounded-2xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('admin_overview')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'admin_overview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="truncate text-[11px]">Gestión</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved_events')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'saved_events'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="truncate text-[11px]">Eventos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="truncate text-[11px]">Ajustes</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 w-full p-1.5 rounded-2xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#0F3A2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Compass className="w-4 h-4 text-[#00A8A7]" />
                <span className="truncate text-[10px]">Pasaporte</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('achievements')}
                className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-[#0F3A2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Award className="w-4 h-4 text-[#F4A43B]" />
                <span className="truncate text-[10px]">Logros</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('circuits')}
                className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'circuits'
                    ? 'bg-[#0F3A2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Layers className="w-4 h-4 text-[#3BA455]" />
                <span className="truncate text-[10px]">Circuitos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved_events')}
                className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'saved_events'
                    ? 'bg-[#0F3A2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Bookmark className="w-4 h-4 text-[#00A8A7]" />
                <span className="truncate text-[10px]">Eventos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('entrepreneur')}
                className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'entrepreneur'
                    ? 'bg-[#0F3A2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Store className="w-4 h-4 text-[#F4D44D]" />
                <span className="truncate text-[10px]">Negocio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#0F3A2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="truncate text-[10px]">Ajustes</span>
              </button>
            </div>
          )}
        </div>

      </section>

      {/* ================= 3. CONTENIDO PRINCIPAL SEGÚN PESTAÑA ================= */}
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">

        {/* ================= TAB ADMIN: GESTIÓN DEL SISTEMA (SOLO ADMINISTRADOR) ================= */}
        {activeTab === 'admin_overview' && isAdmin && (
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-4 sm:p-8 lg:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Control Central de Gestión</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
                    Centro de Administración Territorial
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    Supervisa la Red de Ciudades Creativas de Nicaragua, curaduría de circuitos turísticos, eventos de agenda y moderación de emprendedores.
                  </p>
                </div>

                <Link
                  href="/admin"
                  className="px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs lg:text-sm flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-md transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Abrir Panel Completo →</span>
                </Link>
              </div>

              {/* Banner informativo de rol sin gamificación */}
              <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Perfil Administrativo Exento de Gamificación
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Las dinámicas de puntos, niveles, sellos de pasaporte y logros están orientadas exclusivamente a los exploradores, turistas y ciudadanos. Tu rol de administrador cuenta con gobernanza y control operativo pleno.
                  </p>
                </div>
              </div>

              {/* Accesos rápidos a los módulos del Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                <Link
                  href="/admin?tab=routes"
                  className="p-5 rounded-2xl lg:rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Compass className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Circuitos & Rutas</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Curaduría de rutas culturales, trazado geográfico y paradas.</p>
                  </div>
                </Link>

                <Link
                  href="/admin?tab=places"
                  className="p-5 rounded-2xl lg:rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Lugares de Interés</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Catálogo de talleres artesanales, museos, iglesias y miradores.</p>
                  </div>
                </Link>

                <Link
                  href="/admin?tab=events"
                  className="p-5 rounded-2xl lg:rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Agenda Cultural</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aprobación y publicación de ferias, festivales y talleres vivenciales.</p>
                  </div>
                </Link>

                <Link
                  href="/admin?tab=users"
                  className="p-5 rounded-2xl lg:rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Usuarios & Permisos</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestión de roles institucionales, exploradores y moderación.</p>
                  </div>
                </Link>

                <Link
                  href="/admin?tab=locations"
                  className="p-5 rounded-2xl lg:rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Territorio & Municipios</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Red de Ciudades Creativas y 17 departamentos nicaragüenses.</p>
                  </div>
                </Link>

                <Link
                  href="/admin?tab=reports"
                  className="p-5 rounded-2xl lg:rounded-3xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/5 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                      <AlertCircle className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Buzón de Incidencias</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sugerencias ciudadanas y reportes sobre lugares o rutas.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 1: RESUMEN / PASAPORTE CULTURAL (SOLO EXPLORADORES) ================= */}
        {activeTab === 'overview' && !isAdmin && (
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
                    {displayAchievements.filter((a) => !a.unlocked).slice(0, 2).map((ach) => (
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

        {/* ================= TAB 2: LOGROS & MEDALLAS CULTURALES (SOLO EXPLORADORES) ================= */}
        {activeTab === 'achievements' && !isAdmin && (
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
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black">{unlockedAchievementsCount} de {displayAchievements.length}</span>
                </div>
              </div>

              {/* Lista Completa de Logros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {displayAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-5 sm:p-6 lg:p-7 rounded-3xl border transition-all flex items-start gap-4 lg:gap-5 ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-white to-[#00A8A7]/5 dark:from-slate-900 dark:to-slate-800 border-[#00A8A7]/30 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 opacity-80'
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

                      {/* Notificación de vinculación a ruta creativa oficial */}
                      {ach.isRouteType && (
                        <div className="my-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/30 text-[11px] text-purple-900 dark:text-purple-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Ruta Vinculada: {ach.linkedRouteName || 'Circuito Creativo'}</span>
                          </div>
                          <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80">
                            Requisitos por parada: 💬 1. Reseña & Comentario + 📷 2. Foto Colaborativa
                          </p>
                        </div>
                      )}

                      <div className="pt-2">
                        {ach.unlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3BA455]/15 text-[#3BA455] text-[10px] lg:text-xs font-black">
                            <CheckCircle2 className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                            <span>Desbloqueado • {ach.unlockedDate || 'Oficial'}</span>
                          </span>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#F4A43B] h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.round((ach.progress / (ach.total || 1)) * 100))}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] lg:text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-bold">
                                Progreso: {ach.progress} de {ach.total} {ach.isRouteType ? 'paradas completadas' : 'actividades'}
                              </span>
                              {ach.isRouteType && (
                                <Link href="/circuitos" className="font-bold text-[#00A8A7] hover:underline">
                                  Ver ruta →
                                </Link>
                              )}
                            </div>
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
                          {!isAdmin ? (
                            <span className="text-xs lg:text-sm font-black text-[#F4A43B]">+{event.points} pts</span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Evento Oficial</span>
                          )}
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

        {/* ================= TAB 4: MIS CIRCUITOS EXPLORADOS (SOLO EXPLORADORES) ================= */}
        {activeTab === 'circuits' && !isAdmin && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn">
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-200/80 dark:border-white/10 p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#3BA455]/15 text-[#3BA455] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Progreso Territorial & Gamificación</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
                    Mis Circuitos y Rutas Creativas
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                    Cada parada validada con reseña y fotografía te acerca a desbloquear la insignia oficial de la ruta.
                  </p>
                </div>

                <Link
                  href="/circuitos"
                  className="px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl bg-[#0F3A2E] text-white text-xs lg:text-sm font-black hover:bg-[#0A261E] transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#00A8A7]" />
                  <span>Descubrir Nuevas Rutas</span>
                </Link>
              </div>

              {/* Banner Didáctico: Los 2 Pasos Evaluados Obligatorios */}
              <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-emerald-500/10 border border-amber-300/40 dark:border-amber-700/30">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      ¿Cómo validar paradas y obtener las insignias de ruta?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Para que cada hito cuente hacia el 100% de la ruta, el explorador debe completar dos pasos evaluados en cada lugar:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-amber-800/30 flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-[#00A8A7]/20 text-[#00A8A7] flex items-center justify-center font-black text-xs shrink-0">
                          1
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-[#00A8A7]" />
                            <span>Reseña y Comentario</span>
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Calificación 1-5★ y opinión sobre el lugar.</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-amber-800/30 flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-[#F4A43B]/20 text-[#F4A43B] flex items-center justify-center font-black text-xs shrink-0">
                          2
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#F4A43B]" />
                            <span>Fotografía Colaborativa</span>
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Aporte visual testimonial de la experiencia.</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-200/90 font-medium pt-1">
                      🏆 <strong>Premio:</strong> Una vez completadas todas las paradas con ambos requisitos, el logro vinculado a esa ruta se te otorgará automáticamente junto a sus puntos de bonificación.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid de Circuitos con Progreso en Tiempo Real */}
              {isLoadingGamification ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#00A8A7] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Cargando progreso territorial de circuitos...</p>
                </div>
              ) : routesProgressList.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">No hay rutas registradas</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Explorá el mapa interactivo y comenzá a recorrer los circuitos de Nicaragua.</p>
                  <Link href="/circuitos" className="inline-block px-6 py-3 rounded-xl bg-[#00A8A7] text-slate-950 font-black text-xs sm:text-sm shadow-sm">
                    Ver Rutas Culturales
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                  {routesProgressList.map((rp) => {
                    const isDone = rp.progress.isCompleted;
                    const inProg = !isDone && rp.progress.completedPlacesCount > 0;

                    return (
                      <div
                        key={rp.route.id}
                        className={`p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                          isDone
                            ? 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-400/40 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-white/10'
                        }`}
                      >
                        <div className="space-y-3.5">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between">
                            {isDone ? (
                              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] lg:text-xs font-black uppercase flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>¡Ruta Completada y Validada!</span>
                              </span>
                            ) : inProg ? (
                              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] lg:text-xs font-black uppercase flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-amber-500" />
                                <span>En Progreso ({rp.progress.progressPercent}%)</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] lg:text-xs font-black uppercase">
                                Por Iniciar
                              </span>
                            )}

                            <span className="text-xs lg:text-sm font-black text-[#F4A43B]">
                              +{rp.route.points_award} pts
                            </span>
                          </div>

                          {/* Título y Ciudad */}
                          <div>
                            <span className="text-[11px] font-bold text-[#007F7E] dark:text-[#00A8A7] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{rp.route.municipality_name || 'Nicaragua'}</span>
                              <span className="text-slate-400">•</span>
                              <span>{rp.route.theme || 'Patrimonio Cultural'}</span>
                              <span className="text-slate-400">•</span>
                              <span>{rp.route.difficulty || 'Fácil'}</span>
                            </span>

                            <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-snug">
                              {rp.route.name}
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {rp.route.description}
                            </p>
                          </div>

                          {/* Barra de Progreso de Paradas */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-600 dark:text-slate-400">Validación de Paradas:</span>
                              <span className="text-[#00A8A7] font-black">
                                {rp.progress.completedPlacesCount} de {rp.progress.totalPlaces} ({rp.progress.progressPercent}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDone ? 'bg-emerald-500' : 'bg-[#00A8A7]'
                                }`}
                                style={{ width: `${rp.progress.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Detalle de Paradas y sus 2 Requisitos */}
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                              Estado por Lugar (💬 Reseña + 📷 Foto):
                            </span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {rp.places.map((place) => {
                                const pState = rp.progress.places[place.id];
                                const isPlaceCompleted = pState?.hasReview && pState?.hasPhoto;

                                return (
                                  <div
                                    key={place.id}
                                    className={`p-2 px-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                      isPlaceCompleted
                                        ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-950 dark:text-emerald-200'
                                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    <span className="truncate font-semibold text-[11px] sm:text-xs">
                                      {place.name}
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                                      <span
                                        className={`px-1.5 py-0.5 rounded font-bold ${
                                          pState?.hasReview
                                            ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                        }`}
                                        title={pState?.hasReview ? 'Reseña enviada' : 'Falta reseña con calificación'}
                                      >
                                        💬 {pState?.hasReview ? '✓' : '—'}
                                      </span>
                                      <span
                                        className={`px-1.5 py-0.5 rounded font-bold ${
                                          pState?.hasPhoto
                                            ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                        }`}
                                        title={pState?.hasPhoto ? 'Fotografía colaborada' : 'Falta colaboración fotográfica'}
                                      >
                                        📷 {pState?.hasPhoto ? '✓' : '—'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Logro e Insignia Vinculada */}
                          {rp.linkedAchievement && (
                            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                              isDone
                                ? 'bg-emerald-500/15 border-emerald-400/50'
                                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-white/10'
                            }`}>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl">{rp.linkedAchievement.icon || '🏅'}</span>
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                                    Insignia Ligada a la Ruta
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                    {rp.linkedAchievement.name}
                                  </h4>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                {isDone ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>¡Logro Desbloqueado!</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-black text-[#F4A43B]">
                                    +{rp.linkedAchievement.points_reward} pts al completar
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Botón de Acción */}
                        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs lg:text-sm">
                          <span className="text-slate-500 dark:text-slate-400 text-xs">
                            {isDone ? 'Sello grabado en Pasaporte' : 'Validar paradas en el mapa'}
                          </span>
                          <Link
                            href="/circuitos"
                            className="px-4 py-2 rounded-xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <span>{isDone ? 'Ver en el Mapa' : 'Continuar Ruta en Mapa'}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#00A8A7]" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )}

        {/* ================= TAB 5: ACREDITACIÓN DE EMPRENDIMIENTO (SOLO USUARIOS/EMPRENDEDORES) ================= */}
        {activeTab === 'entrepreneur' && !isAdmin && (
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

        {/* ================= TAB 6: AJUSTES & MENÚ GENERAL (LAYOUT MÓVIL ACCESIBLE & RESPONSIVE) ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 lg:space-y-8 animate-fadeIn max-w-4xl mx-auto">
            
            {/* Header / Sub-título */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#00A8A7]/15 text-[#007F7E] dark:text-[#00A8A7] text-[11px] lg:text-xs font-black uppercase tracking-wider mb-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configuración & Preferencias</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Ajustes de la Cuenta
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Gestioná tu información personal, tema visual, notificaciones y credencial oficial.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPublicProfileModal(true)}
                className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#00A8A7] dark:hover:text-[#00A8A7] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-[#00A8A7]" />
                <span>Credencial Pública</span>
              </button>
            </div>

            {/* SECCIÓN 1: PERFIL & CREDENCIAL */}
            <div className="space-y-2.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block">
                PERFIL & CREDENCIAL
              </span>

              <div className="space-y-2.5 sm:space-y-3">
                {/* 1.1 Editar Información Personal */}
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 hover:border-[#00A8A7]/50 dark:hover:border-[#00A8A7]/40 transition-all flex items-center justify-between gap-3 text-left group shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#00A8A7]/15 text-[#007F7E] dark:text-[#00A8A7] border border-[#00A8A7]/30 flex items-center justify-center shrink-0">
                      <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-[#00A8A7] dark:group-hover:text-[#00A8A7] transition-colors truncate">
                        Editar Información Personal
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Nombre, departamento, ciudad, biografía y categorías favoritas
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 1.2 Ver Perfil Público / Pasaporte Digital */}
                <button
                  type="button"
                  onClick={() => setShowPublicProfileModal(true)}
                  className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 text-left group shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors truncate">
                        Credencial Pública & QR
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Tu credencial de pasaporte oficial como lo ven otros exploradores
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>

                {/* 1.3 Panel Admin si corresponde */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 text-left group shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                          Panel de Administración
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                          Control central de circuitos, lugares, eventos y reportes
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                )}
              </div>
            </div>

            {/* SECCIÓN 2: PREFERENCIAS & INTERFAZ */}
            <div className="space-y-2.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block">
                PREFERENCIAS & INTERFAZ
              </span>

              <div className="space-y-2.5 sm:space-y-3">
                {/* 2.1 Tema Visual (Con Selector Rápido Integrado) */}
                <div className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-xs">
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                      {themeMode === 'dark' ? <Moon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        Tema Visual
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Elegí la apariencia ({themeMode === 'light' ? 'Modo Claro' : themeMode === 'dark' ? 'Modo Oscuro' : 'Sincronizado'})
                      </p>
                    </div>
                  </div>

                  {/* Pills de selección de tema */}
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        themeMode === 'light'
                          ? 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-200'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                      title="Modo Claro"
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Claro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        themeMode === 'dark'
                          ? 'bg-[#00A8A7] text-slate-950 font-black shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                      title="Modo Oscuro"
                    >
                      <Moon className="w-3.5 h-3.5 text-slate-950 dark:text-white" />
                      <span>Oscuro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange('system')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        themeMode === 'system'
                          ? 'bg-slate-700 text-white font-black shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                      title="Sincronizado con el Sistema"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>

                {/* 2.2 Notificaciones de Agenda */}
                <div className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 transition-all flex items-center justify-between gap-3 text-left shadow-xs">
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                        Notificaciones de Agenda
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Alertas de festividades y nuevas rutas en tus ciudades
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formNotifications}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setFormNotifications(val);
                        updateProfile({ notifications_enabled: val });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A8A7]"></div>
                  </label>
                </div>

                {/* 2.3 Directorio de Emprendedores */}
                <Link
                  href="/emprendedores"
                  className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 text-left group shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        Directorio de Emprendedores
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Conectate con la red nacional de artesanos, artistas y talleres
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                </Link>
              </div>
            </div>

            {/* SECCIÓN 3: CUENTA & SESIÓN */}
            <div className="space-y-2.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block">
                CUENTA & SESIÓN
              </span>

              <div className="space-y-2.5 sm:space-y-3">
                {/* 3.1 Cerrar Sesión */}
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c141f] border border-rose-200 dark:border-rose-950/60 hover:border-rose-500/60 dark:hover:border-rose-500/50 transition-all flex items-center justify-between gap-3 text-left group shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors truncate">
                        Cerrar Sesión
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                        Salir de tu cuenta en este dispositivo
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================= MODAL 1: EDITAR INFORMACIÓN PERSONAL ================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Editar Información Personal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Actualizá los datos públicos y preferencias de tu pasaporte
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              await handleSaveProfile(e);
              setTimeout(() => setShowEditProfileModal(false), 800);
            }} className="space-y-5">
              
              {profileSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-[#3BA455]/15 border border-[#3BA455]/30 text-[#3BA455] text-xs sm:text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Tus cambios de perfil se guardaron correctamente!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={formLastname}
                    onChange={(e) => setFormLastname(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                  >
                    {NICARAGUA_GEO_DATA.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Municipio
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                  >
                    {getMunicipalitiesByDepartment(formDepartment).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Biografía / Qué te apasiona de la cultura nicaragüense
                </label>
                <textarea
                  rows={2}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Contanos qué tradiciones, ciudades o artesanías te inspiran..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8A7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tus Categorías Culturales Favoritas
                </label>
                <div className="flex flex-wrap gap-2">
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
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3 rounded-xl bg-[#00A8A7] hover:bg-[#008F8E] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isSavingProfile ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: VISTA DE PERFIL PÚBLICO / PASAPORTE VIRTUAL ================= */}
      {showPublicProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0F3A2E] text-white rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center">
            
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setShowPublicProfileModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge superior */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00A8A7]/20 border border-[#00A8A7]/40 text-[#00A8A7] text-[11px] font-black uppercase tracking-wider mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pasaporte Digital Oficial ROOTS</span>
            </div>

            {/* Avatar & Anillo de Honor */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#F4A43B] bg-slate-950 shadow-xl relative">
                <Image
                  src={user.avatar || '/icons/roots/profile-mask.png'}
                  alt={user.name}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#3BA455] border-2 border-white flex items-center justify-center text-white text-xs shadow-sm font-bold" title="Verificado">
                ✓
              </span>
            </div>

            {/* Información del Explorador */}
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">
                {user.name} {user.lastname}
              </h3>
              <p className="text-xs text-slate-300 flex items-center justify-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#00A8A7]" />
                <span>{user.city || 'León'}, Nicaragua</span>
              </p>
              {user.bio && (
                <p className="text-xs text-slate-200/90 italic pt-2 max-w-xs mx-auto">
                  "{user.bio}"
                </p>
              )}
            </div>

            {/* Grid de Estadísticas Públicas */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
              <div>
                <span className="text-lg font-black text-[#F4D44D]">{user.points || 0}</span>
                <span className="block text-[10px] text-slate-300 uppercase font-bold">Puntos</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-lg font-black text-[#00A8A7]">{stampedCitiesCount}/10</span>
                <span className="block text-[10px] text-slate-300 uppercase font-bold">Sellos</span>
              </div>
              <div>
                <span className="text-lg font-black text-[#F4A43B]">{unlockedAchievementsCount}</span>
                <span className="block text-[10px] text-slate-300 uppercase font-bold">Medallas</span>
              </div>
            </div>

            {/* Muestra de Sellos */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                Últimos Sellos de Ciudades
              </span>
              <div className="flex items-center justify-center gap-2">
                {PASSPORT_STAMPS.filter(s => s.stamped).slice(0, 4).map((s) => (
                  <div key={s.slug} className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg" title={s.name}>
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de Compartir */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard?.writeText?.(window.location.href);
                  setIsCopiedPublicLink(true);
                  setTimeout(() => setIsCopiedPublicLink(false), 3000);
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-[#00A8A7] hover:bg-[#008F8E] text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isCopiedPublicLink ? '¡Enlace de Pasaporte Copiado!' : 'Compartir Pasaporte Cultural'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CONFIRMAR CERRAR SESIÓN ================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0c141f] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 text-center space-y-5">
            
            <div className="w-16 h-16 rounded-3xl bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
              <LogOut className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                ¿Deseas cerrar sesión?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Podrás volver a ingresar en cualquier momento con tu cuenta para continuar acumulando sellos, medallas y puntos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
