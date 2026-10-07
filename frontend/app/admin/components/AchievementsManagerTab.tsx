'use client';

import React, { useState, useMemo } from 'react';
import {
  Award,
  Plus,
  Sparkles,
  Check,
  X,
  Pencil,
  Trash2,
  Search,
  Filter,
  Store,
  Camera,
  Star,
  Compass,
  MapPin,
  Music,
  Coffee,
  BookOpen,
  Heart,
  Trophy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AchievementItem, CreativeRouteItem, adminService } from '@/services/adminService';

interface AchievementsManagerTabProps {
  achievements: AchievementItem[];
  routes?: CreativeRouteItem[];
  onRefresh: () => void;
}

// Preset de iconos rápidos recomendados
const ICON_PRESETS = [
  { label: 'Trofeo', value: '🏆' },
  { label: 'Medalla', value: '🏅' },
  { label: 'Pergamino', value: '📜' },
  { label: 'Cerámica', value: '🏺' },
  { label: 'Marimba', value: '🎶' },
  { label: 'Pintura', value: '🎨' },
  { label: 'Café', value: '☕' },
  { label: 'Estrella', value: '🌟' },
  { label: 'Award', value: 'Award' },
  { label: 'Store', value: 'Store' },
  { label: 'Camera', value: 'Camera' },
  { label: 'Compass', value: 'Compass' },
];

// Helper para renderizar iconos inteligentes (Lucide o Emoji)
function renderAchievementIcon(icon: string) {
  const trimmed = (icon || '').trim();
  const lower = trimmed.toLowerCase();

  switch (lower) {
    case 'award':
      return <Award className="w-6 h-6 text-purple-700" />;
    case 'store':
      return <Store className="w-6 h-6 text-amber-700" />;
    case 'camera':
      return <Camera className="w-6 h-6 text-indigo-700" />;
    case 'star':
      return <Star className="w-6 h-6 text-amber-500 fill-amber-400" />;
    case 'compass':
      return <Compass className="w-6 h-6 text-teal-600" />;
    case 'mappin':
      return <MapPin className="w-6 h-6 text-rose-600" />;
    case 'music':
      return <Music className="w-6 h-6 text-purple-600" />;
    case 'coffee':
      return <Coffee className="w-6 h-6 text-amber-800" />;
    case 'book':
    case 'bookopen':
      return <BookOpen className="w-6 h-6 text-blue-600" />;
    case 'heart':
      return <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />;
    case 'sparkles':
      return <Sparkles className="w-6 h-6 text-amber-500" />;
    case 'trophy':
      return <Trophy className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="text-2xl leading-none">{trimmed || '🏅'}</span>;
  }
}

// Mapeo legible de tipos de logros
const ACHIEVEMENT_TYPES: Record<AchievementItem['achievement_type'], { label: string; badgeClass: string }> = {
  ruta: { label: 'Ruta Creativa', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  puntos_secundarios: { label: 'Puntos Secundarios', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300' },
  visita: { label: 'Visita Cultural', badgeClass: 'bg-teal-100 text-teal-800 border-teal-300' },
  evento: { label: 'Asistencia Evento', badgeClass: 'bg-purple-100 text-purple-800 border-purple-300' },
  resena: { label: 'Reseña Ciudadana', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
  foto: { label: 'Fotografía', badgeClass: 'bg-pink-100 text-pink-800 border-pink-300' },
  especial: { label: 'Reconocimiento Especial', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
};

export const AchievementsManagerTab: React.FC<AchievementsManagerTabProps> = ({
  achievements,
  routes = [],
  onRefresh,
}) => {
  // Estados para CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);
  const [deletingAchievement, setDeletingAchievement] = useState<AchievementItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Formulario
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    achievement_type: AchievementItem['achievement_type'];
    icon: string;
    points_reward: number;
    required_count: number;
    route_id: string;
  }>({
    name: '',
    description: '',
    achievement_type: 'ruta',
    icon: '🏆',
    points_reward: 150,
    required_count: 1,
    route_id: '',
  });

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingAchievement(null);
    setFormData({
      name: '',
      description: '',
      achievement_type: 'ruta',
      icon: '🏆',
      points_reward: 150,
      required_count: 1,
      route_id: routes.length > 0 ? routes[0].id : '',
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (ach: AchievementItem) => {
    setEditingAchievement(ach);
    setFormData({
      name: ach.name,
      description: ach.description || '',
      achievement_type: ach.achievement_type || 'ruta',
      icon: ach.icon || '🏆',
      points_reward: ach.points_reward || 100,
      required_count: ach.required_count || 1,
      route_id: ach.route_id || (routes.length > 0 ? routes[0].id : ''),
    });
    setIsModalOpen(true);
  };

  // Guardar (Crear o Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const targetRouteId = formData.achievement_type === 'ruta' ? (formData.route_id || null) : null;

    try {
      if (editingAchievement) {
        // Actualizar logro existente
        const ok = await adminService.updateAchievement(editingAchievement.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          achievement_type: formData.achievement_type,
          icon: formData.icon.trim(),
          points_reward: Number(formData.points_reward) || 0,
          required_count: Number(formData.required_count) || 1,
          route_id: targetRouteId,
        });

        if (ok) {
          setFeedbackMsg({ type: 'success', text: '¡Logro actualizado con éxito!' });
          setIsModalOpen(false);
          onRefresh();
        } else {
          setFeedbackMsg({ type: 'error', text: 'No se pudo actualizar el logro. Intenta nuevamente.' });
        }
      } else {
        // Crear nuevo logro
        const ok = await adminService.createAchievement({
          name: formData.name.trim(),
          slug: formData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: formData.description.trim(),
          achievement_type: formData.achievement_type,
          icon: formData.icon.trim(),
          points_reward: Number(formData.points_reward) || 0,
          required_count: Number(formData.required_count) || 1,
          route_id: targetRouteId,
        });

        if (ok) {
          setFeedbackMsg({ type: 'success', text: '¡Logro creado exitosamente!' });
          setIsModalOpen(false);
          onRefresh();
        } else {
          setFeedbackMsg({ type: 'error', text: 'No se pudo crear el logro. Revisa los datos.' });
        }
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  // Confirmar y eliminar
  const confirmDelete = async () => {
    if (!deletingAchievement) return;

    setIsSubmitting(true);
    try {
      const ok = await adminService.deleteAchievement(deletingAchievement.id);
      if (ok) {
        setFeedbackMsg({ type: 'success', text: `Logro "${deletingAchievement.name}" eliminado correctamente.` });
        setDeletingAchievement(null);
        onRefresh();
      } else {
        setFeedbackMsg({ type: 'error', text: 'Error al eliminar el logro.' });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  // Logros filtrados
  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      const matchesSearch =
        ach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ach.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || ach.achievement_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [achievements, searchTerm, typeFilter]);

  // Métricas rápidas
  const totalPoints = useMemo(() => {
    return achievements.reduce((acc, a) => acc + (a.points_reward || 0), 0);
  }, [achievements]);

  return (
    <div className="space-y-6">
      
      {/* Toast de Feedback */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-md animate-fadeIn ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Gestión de Gamificación para Exploradores</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
            Catálogo de Logros e Insignias Culturales
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Administra los retos, medallas y bonificaciones de puntos que los turistas y exploradores pueden desbloquear recorriendo Nicaragua.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Crear Nuevo Logro</span>
        </button>
      </div>

      {/* Barra de Búsqueda, Filtros y Métricas */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Búsqueda por texto */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar logro por título o descripción..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-purple-600"
            />
          </div>

          {/* Métricas Resumidas */}
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Total Logros</span>
              <span className="text-sm font-black text-slate-900">{achievements.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-purple-600 font-bold block text-[10px] uppercase">Puntos en Juego</span>
              <span className="text-sm font-black text-purple-900">+{totalPoints} pts</span>
            </div>
          </div>

        </div>

        {/* Pestañas de Filtro por Tipo */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              typeFilter === 'all'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todos ({achievements.length})
          </button>
          {Object.entries(ACHIEVEMENT_TYPES).map(([typeKey, info]) => {
            const count = achievements.filter((a) => a.achievement_type === typeKey).length;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => setTypeFilter(typeKey)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  typeFilter === typeKey
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {info.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Logros */}
      {filteredAchievements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-black text-slate-900">No se encontraron logros</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No hay reconocimientos que coincidan con el término de búsqueda o filtro seleccionado.
          </p>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((ach) => {
            const typeInfo = ACHIEVEMENT_TYPES[ach.achievement_type] || {
              label: ach.achievement_type,
              badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
            };

            return (
              <div
                key={ach.id}
                className="group relative p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="space-y-3">
                  
                  {/* Fila superior: Icono renderizado + Puntos + Botones CRUD */}
                  <div className="flex items-start justify-between gap-2">
                    
                    {/* Caja de Icono Inteligente */}
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 shadow-xs">
                      {renderAchievementIcon(ach.icon)}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                        +{ach.points_reward} pts
                      </span>

                      {/* Botones de Acción CRUD (Edición y Eliminación) */}
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ach)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                          title="Editar logro"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingAchievement(ach)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Eliminar logro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Información Principal del Logro */}
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border mb-1.5 ${typeInfo.badgeClass}`}>
                      {typeInfo.label}
                    </span>
                    <h3 className="text-sm font-black text-slate-950 line-clamp-1 leading-snug">
                      {ach.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {ach.description || 'Sin descripción detallada.'}
                    </p>

                    {/* Badge de Ruta Creativa Vinculada y sus 2 Pasos Evaluados */}
                    {ach.achievement_type === 'ruta' && (
                      <div className="mt-2.5 p-2 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50/80 border border-purple-200/80 text-[10.5px] space-y-1">
                        <div className="font-extrabold text-purple-950 flex items-center gap-1.5 line-clamp-1">
                          <Compass className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>{ach.route_name || 'Circuito Creativo Vinculado'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-[9.5px] font-bold text-purple-900">
                          <span className="px-1.5 py-0.5 rounded-md bg-white border border-purple-200 shadow-2xs">
                            💬 1. Reseña & Comentario
                          </span>
                          <span>+</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-white border border-purple-200 shadow-2xs">
                            📷 2. Foto Colaborativa
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Requisito de desbloqueo */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Requisito:</span>
                  <span className="text-slate-900 font-black">
                    {ach.achievement_type === 'ruta' 
                      ? '100% de paradas completadas' 
                      : `${ach.required_count} actividad(es)`}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CRUD: CREAR O EDITAR LOGRO */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {editingAchievement ? 'Editar Logro e Insignia' : 'Crear Nuevo Logro'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingAchievement ? `Modificando ID: ${editingAchievement.id}` : 'Configura una nueva insignia de gamificación'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Nombre */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre del Logro *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Guardián del Muralismo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white text-xs font-semibold"
                />
              </div>

              {/* Tipo de Actividad y Puntos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Actividad</label>
                  <select
                    value={formData.achievement_type}
                    onChange={(e) => setFormData({ ...formData, achievement_type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-medium"
                  >
                    <option value="ruta">Ruta Creativa</option>
                    <option value="puntos_secundarios">Puntos Secundarios / Emprendedores</option>
                    <option value="visita">Visita a Hito Cultural</option>
                    <option value="evento">Asistencia a Evento</option>
                    <option value="resena">Reseña o Comentario</option>
                    <option value="foto">Fotografía Compartida</option>
                    <option value="especial">Reconocimiento Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Puntos Recompensa (+pts)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10}
                    value={formData.points_reward}
                    onChange={(e) => setFormData({ ...formData, points_reward: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                  />
                </div>
              </div>

              {/* Selector de Ruta Creativa Vinculada y Explicación de los 2 Pasos Evaluados */}
              {formData.achievement_type === 'ruta' && (
                <div className="p-4 rounded-3xl bg-purple-50/80 border border-purple-200/90 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-purple-900 mb-1.5 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>Ruta Creativa Vinculada (Circuito Oficial)</span>
                    </label>
                    <select
                      value={formData.route_id}
                      onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
                      className="w-full bg-white border border-purple-300 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-2xs"
                    >
                      <option value="">-- Selecciona el circuito creativo --</option>
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.municipality_name || 'Nicaragua'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Panel Informativo de los 2 Pasos de Progreso */}
                  <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs space-y-2">
                    <div className="font-black flex items-center gap-1.5 text-amber-900 text-[11px]">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Reglas de Progreso de Cada Parada de la Ruta:</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                      Para que cuente cada lugar de la ruta, el explorador deberá cumplir <strong>2 pasos obligatorios</strong>:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-bold text-amber-950">
                      <div className="p-2 rounded-xl bg-white border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                        <span>💬</span>
                        <div>
                          <span className="block font-black text-amber-900">1. Reseña & Comentario</span>
                          <span className="text-[9.5px] text-amber-700 font-normal">Valoración con estrellas y opinión escrita</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                        <span>📷</span>
                        <div>
                          <span className="block font-black text-amber-900">2. Foto Colaborativa</span>
                          <span className="text-[9.5px] text-amber-700 font-normal">Aportar una imagen real del lugar</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-amber-800 font-bold pt-1 border-t border-amber-200/60">
                      🎯 Una vez completados todos los lugares de la ruta cumpliendo ambos pasos, esta insignia y sus +{formData.points_reward} pts se otorgarán automáticamente al explorador.
                    </p>
                  </div>
                </div>
              )}

              {/* Selector de Icono / Emoji con Vista Previa */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Icono o Emoji del Reconocimiento
                </label>
                
                <div className="flex items-center gap-3 mb-2.5">
                  {/* Vista previa en tiempo real */}
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                    {renderAchievementIcon(formData.icon)}
                  </div>
                  
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Escribe emoji (🏆, 📜) o icono (Award, Store, Camera, Compass)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-medium"
                  />
                </div>

                {/* Presets rápidos */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">Sugeridos:</span>
                  {ICON_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: p.value })}
                      className={`px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                        formData.icon === p.value
                          ? 'bg-purple-700 text-white font-bold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cantidad requerida */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Cantidad Requerida (Meta para Desbloquear)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.required_count}
                    onChange={(e) => setFormData({ ...formData, required_count: parseInt(e.target.value) || 1 })}
                    className="w-32 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white font-bold"
                  />
                  <span className="text-slate-500 font-medium">actividad(es) o visitas completadas</span>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Descripción del Desafío Cultural</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalla qué debe hacer el visitante para ganar esta insignia y cómo promueve la identidad cultural..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white resize-none text-xs leading-relaxed"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Guardando...'
                      : editingAchievement
                      ? 'Actualizar Logro'
                      : 'Guardar Nuevo Logro'}
                  </span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {/* ========================================================================= */}
      {deletingAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 space-y-4 text-slate-900 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-950">¿Eliminar este Logro?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Estás a punto de eliminar <strong className="text-slate-800">"{deletingAchievement.name}"</strong>. Los exploradores ya no podrán desbloquear esta medalla.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAchievement(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
