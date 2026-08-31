'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Landmark,
  MapPin,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Search,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
  Image as ImageIcon,
  Layers,
  AlertTriangle,
  Compass,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';
import { MunicipalityItem, adminService } from '@/services/adminService';
import { NICARAGUA_GEO_DATA } from '@/data/nicaraguaGeo';

interface CitiesManagerTabProps {
  cities: MunicipalityItem[];
  onRefresh: () => void;
}

export const CitiesManagerTab: React.FC<CitiesManagerTabProps> = ({ cities, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modal de Crear / Editar Ciudad
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<MunicipalityItem | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'media' | 'geo'>('info');

  // Estados del Formulario
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDepartment, setFormDepartment] = useState('León');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<'creativa' | 'tradicional' | 'mixta' | 'en_desarrollo'>('creativa');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'disabled' | 'pending'>('active');
  const [formIsCreative, setFormIsCreative] = useState(true);
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formHeroDesktop, setFormHeroDesktop] = useState('');
  const [formHeroMobile, setFormHeroMobile] = useState('');
  const [formLat, setFormLat] = useState<number | string>(12.4350);
  const [formLng, setFormLng] = useState<number | string>(-86.8782);
  const [formSpecialties, setFormSpecialties] = useState('');

  // Modal de Confirmación de Eliminación
  const [deletingCity, setDeletingCity] = useState<MunicipalityItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCity(null);
    setFormName('');
    setFormSlug('');
    setFormDepartment('León');
    setFormSubtitle('');
    setFormDescription('');
    setFormType('creativa');
    setFormStatus('active');
    setFormIsCreative(true);
    setFormLogoUrl('https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop');
    setFormHeroDesktop('https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&auto=format&fit=crop');
    setFormHeroMobile('https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop');
    setFormLat(12.4350);
    setFormLng(-86.8782);
    setFormSpecialties('Literatura, Artes Plásticas, Danza');
    setModalTab('info');
    setIsModalOpen(true);
  };

  const openEditModal = (city: MunicipalityItem) => {
    setEditingCity(city);
    setFormName(city.name);
    setFormSlug(city.slug);
    setFormDepartment(city.department_name || 'Nicaragua');
    setFormSubtitle(city.subtitle || '');
    setFormDescription(city.description || '');
    setFormType(city.municipality_type || 'creativa');
    setFormStatus(city.status || 'active');
    setFormIsCreative(city.is_creative);
    setFormLogoUrl(city.logo_url || '');
    setFormHeroDesktop(city.hero_desktop || '');
    setFormHeroMobile(city.hero_mobile || '');
    setFormLat(city.lat ?? 12.4350);
    setFormLng(city.lng ?? -86.8782);
    setFormSpecialties((city.specialties || []).join(', '));
    setModalTab('info');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCity) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    const specialtiesArray = formSpecialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingCity) {
        await adminService.updateCity(editingCity.id, {
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
          department_name: formDepartment,
          subtitle: formSubtitle.trim(),
          description: formDescription.trim(),
          municipality_type: formType,
          status: formStatus,
          is_creative: formIsCreative,
          logo_url: formLogoUrl.trim(),
          hero_desktop: formHeroDesktop.trim(),
          hero_mobile: formHeroMobile.trim(),
          lat: typeof formLat === 'number' ? formLat : parseFloat(formLat) || 12.4350,
          lng: typeof formLng === 'number' ? formLng : parseFloat(formLng) || -86.8782,
          specialties: specialtiesArray,
        });
      } else {
        await adminService.createCity({
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
          department_name: formDepartment,
          subtitle: formSubtitle.trim(),
          description: formDescription.trim(),
          municipality_type: formType,
          status: formStatus,
          is_creative: formIsCreative,
          logo_url: formLogoUrl.trim(),
          hero_desktop: formHeroDesktop.trim(),
          hero_mobile: formHeroMobile.trim(),
          lat: typeof formLat === 'number' ? formLat : parseFloat(formLat) || 12.4350,
          lng: typeof formLng === 'number' ? formLng : parseFloat(formLng) || -86.8782,
          specialties: specialtiesArray,
        });
      }

      setIsModalOpen(false);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (city: MunicipalityItem) => {
    setTogglingId(city.id);
    const nextStatus = city.status === 'active' ? 'inactive' : 'active';
    try {
      await adminService.toggleCityStatus(city.id, nextStatus);
      onRefresh();
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCity = async () => {
    if (!deletingCity) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteCity(deletingCity.id);
      setDeletingCity(null);
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCities = cities.filter((city) => {
    const term = search.toLowerCase();
    const matchesSearch =
      city.name.toLowerCase().includes(term) ||
      (city.department_name && city.department_name.toLowerCase().includes(term)) ||
      (city.subtitle && city.subtitle.toLowerCase().includes(term));

    if (filterType === 'active') return matchesSearch && city.status === 'active';
    if (filterType === 'inactive') return matchesSearch && city.status === 'inactive';
    if (filterType === 'creative') return matchesSearch && city.is_creative;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Principal con Barra de Búsqueda y Botón de Creación */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5 text-purple-700" />
            <span>Gestión Territorial y Cultural</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">
            Red de Ciudades Creativas de Nicaragua
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal">
            Edita y administra la información completa de cada ciudad: imágenes para escritorio y móvil, escudo/logo, estado de mantenimiento, vocaciones creativas y circuitos interactivos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ciudad o departamento..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Ciudad</span>
          </button>
        </div>
      </div>

      {/* Chips de Filtrado */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'all', label: `Todas (${cities.length})` },
          { key: 'active', label: `Públicas Activas (${cities.filter((c) => c.status !== 'inactive').length})` },
          { key: 'inactive', label: `En Mantenimiento (${cities.filter((c) => c.status === 'inactive').length})` },
          { key: 'creative', label: `UNESCO / Red Creativa (${cities.filter((c) => c.is_creative).length})` },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilterType(f.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === f.key
                ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid de Ciudades */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCities.map((city) => {
          const isActive = city.status !== 'inactive';
          return (
            <div
              key={city.id}
              className={`relative rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                isActive
                  ? 'bg-white border-slate-200 hover:border-purple-300'
                  : 'bg-slate-50/80 border-amber-300'
              }`}
            >
              {/* Imagen Banner Superior */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <Image
                  src={city.hero_desktop || city.hero_mobile || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop'}
                  alt={city.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={`object-cover transition-transform duration-700 hover:scale-105 ${!isActive ? 'grayscale-[50%]' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Logo Escudo Flotante */}
                {city.logo_url && (
                  <div className="absolute top-3 left-3 w-12 h-12 rounded-2xl bg-white p-1 border border-slate-200 shadow-md overflow-hidden">
                    <Image
                      src={city.logo_url}
                      alt={`Logo ${city.name}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Badges de Estado Superior */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                      isActive
                        ? 'bg-emerald-500/90 text-white border-emerald-400'
                        : 'bg-amber-500/90 text-slate-950 border-amber-300 font-black'
                    }`}
                  >
                    {isActive ? '● Pública' : '⚙ Mantenimiento'}
                  </span>

                  {city.is_creative && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-black bg-purple-700/90 text-white border border-purple-500 backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Creativa
                    </span>
                  )}
                </div>

                {/* Nombre de la Ciudad sobre el Banner */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-black text-white drop-shadow-md">{city.name}</h3>
                  <p className="text-xs text-purple-200 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {city.department_name ? `Depto. de ${city.department_name}` : 'Nicaragua'}
                  </p>
                </div>
              </div>

              {/* Contenido Central */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {city.subtitle && (
                    <p className="text-xs font-bold text-slate-700 italic mb-2">
                      &quot;{city.subtitle}&quot;
                    </p>
                  )}

                  {city.description && (
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-normal">
                      {city.description}
                    </p>
                  )}

                  {/* Especialidades / Tags */}
                  {city.specialties && city.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {city.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                      {city.specialties.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-[10px] text-slate-500 font-semibold">
                          +{city.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Switch de Estado de Mantenimiento / Publicación */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      Estado de la Página
                    </span>
                    <span className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isActive ? 'Habilitada al Público' : 'En Mantenimiento (Oculta)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={togglingId === city.id}
                    onClick={() => handleToggleStatus(city)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={isActive ? 'Poner en Mantenimiento' : 'Publicar Ciudad'}
                  >
                    {isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-600 hover:text-emerald-700 transition-transform active:scale-95" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-amber-500 hover:text-amber-600 transition-transform active:scale-95" />
                    )}
                  </button>
                </div>

                {/* Barra de Acciones Inferior */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/ciudades-creativas/${city.slug}`}
                    target="_blank"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
                    title="Ver página pública de la ciudad"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-700" />
                    <span>Ver Página</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(city)}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Editar información completa de la ciudad"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCity(city)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                      title="Eliminar ciudad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL CREAR / EDITAR CIUDAD CREATIVA */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden text-slate-900">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {editingCity ? `Editar Ciudad: ${editingCity.name}` : 'Añadir Nueva Ciudad Creativa'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Información cultural, imágenes multiplataforma y geolocalización.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas del Modal (Info / Multimedia / Geolocalización) */}
            <div className="flex items-center gap-2 my-4 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              {[
                { key: 'info', label: '1. Información General', icon: Landmark },
                { key: 'media', label: '2. Logo e Imágenes (Móvil/PC)', icon: ImageIcon },
                { key: 'geo', label: '3. Mapa & Vocaciones', icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setModalTab(tab.key as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      modalTab === tab.key
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Formulario con Scroll */}
            <form onSubmit={handleSaveCity} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              
              {/* TAB 1: INFORMACIÓN GENERAL */}
              {modalTab === 'info' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Nombre del Municipio *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Ej. San Juan de Oriente"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Slug de URL (Ruta en web) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        placeholder="san-juan-de-oriente"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Departamento de Nicaragua
                      </label>
                      <select
                        value={formDepartment}
                        onChange={(e) => setFormDepartment(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      >
                        {NICARAGUA_GEO_DATA.map((d) => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Tipo de Municipio
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      >
                        <option value="creativa">✨ Ciudad Creativa UNESCO / Red</option>
                        <option value="tradicional">🏛️ Municipio Tradicional</option>
                        <option value="mixta">🌿 Mixta / Ecoturismo</option>
                        <option value="en_desarrollo">🛠️ En Proceso de Acreditación</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Lema o Subtítulo Cultural
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Ej. Cuna del Folclore y Ciudad de las Flores"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Descripción Narrativa de la Ciudad
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Historia, relevancia artística, tradiciones artesanales y atractivos principales..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white leading-relaxed resize-none"
                    />
                  </div>

                  {/* Estado de Publicación */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-black text-slate-900 block">Estado de Disponibilidad</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {formStatus === 'active'
                          ? 'Visible para todos los turistas y exploradores.'
                          : 'Inhabilitada (Muestra aviso de mantenimiento para trabajar en ediciones).'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormStatus(formStatus === 'active' ? 'inactive' : 'active')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          formStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {formStatus === 'active' ? 'Activa (Pública)' : 'En Mantenimiento'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTIMEDIA E IMÁGENES */}
              {modalTab === 'media' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      URL del Logotipo / Escudo Oficial
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formLogoUrl}
                        onChange={(e) => setFormLogoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                      {formLogoUrl && (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <Image src={formLogoUrl} alt="Logo" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      URL de Imagen Hero para Escritorio (Desktop 16:9)
                    </label>
                    <input
                      type="url"
                      value={formHeroDesktop}
                      onChange={(e) => setFormHeroDesktop(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                    />
                    {formHeroDesktop && (
                      <div className="relative h-28 w-full rounded-xl overflow-hidden mt-2 border border-slate-200">
                        <Image src={formHeroDesktop} alt="Desktop Hero Preview" fill sizes="500px" className="object-cover" />
                        <span className="absolute bottom-1 right-2 text-[9px] font-bold bg-black/70 px-2 py-0.5 rounded text-white">Vista Escritorio</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      URL de Imagen de Portada para Móvil (Mobile Vertical / Compacto)
                    </label>
                    <input
                      type="url"
                      value={formHeroMobile}
                      onChange={(e) => setFormHeroMobile(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: GEOLOCALIZACIÓN Y VOCACIONES */}
              {modalTab === 'geo' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Latitud Geográfica (Mapa)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formLat}
                        onChange={(e) => setFormLat(e.target.value)}
                        placeholder="12.4350"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Longitud Geográfica (Mapa)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formLng}
                        onChange={(e) => setFormLng(e.target.value)}
                        placeholder="-86.8782"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Especialidades / Vocaciones Creativas (Separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={formSpecialties}
                      onChange={(e) => setFormSpecialties(e.target.value)}
                      placeholder="Ej. Literatura, Artesanía en Barro, Marimba, Muralismo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-3">
                    <Compass className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Integración con el Mapa Inmersivo</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-normal">
                        Las coordenadas configuradas ubicarán el punto central de la ciudad y activarán los circuitos asociados en la vista inmersiva 3D.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones Guardar / Cancelar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando...' : editingCity ? 'Actualizar Ciudad' : 'Guardar Nueva Ciudad'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {/* ========================================================================= */}
      {deletingCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-rose-200 p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-950 mb-2">
              ¿Eliminar {deletingCity.name}?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed font-normal">
              Esta acción eliminará el registro de la ciudad de la Red Nacional. Si prefieres ocultarla temporalmente del público, te recomendamos cambiar su estado a <strong>En Mantenimiento</strong>.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingCity(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteCity}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
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
