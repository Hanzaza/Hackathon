'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Map,
  Sparkles,
  UserCheck,
  Edit2,
  Check,
  X,
  Building2,
  MapPin,
  Search,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Loader2,
  Layers,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DepartmentItem, AdminUserItem, MunicipalityItem, adminService } from '@/services/adminService';
import { NICARAGUA_GEO_DATA, NicaraguaDepartment } from '@/data/nicaraguaGeo';

interface DepartmentsManagerTabProps {
  departments: DepartmentItem[];
  users: AdminUserItem[];
  cities?: MunicipalityItem[];
  onRefresh: () => void;
}

export const DepartmentsManagerTab: React.FC<DepartmentsManagerTabProps> = ({
  departments,
  users,
  cities = [],
  onRefresh,
}) => {
  // Referencia para el contenedor de scroll horizontal
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Modal de configuración / creación de departamento
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'general' | 'municipalities'>('general');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_creative_region: false,
    manager_id: '',
  });
  const [saving, setSaving] = useState(false);

  // Modal / Vista rápida de gestión de municipios
  const [selectedDeptForMunicipalities, setSelectedDeptForMunicipalities] = useState<DepartmentItem | null>(null);
  const [munSearch, setMunSearch] = useState('');
  const [togglingMun, setTogglingMun] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);

  const potentialManagers = users.filter(
    (u) => u.role === 'department_manager' || u.role === 'admin' || u.role === 'user'
  );

  // Helper para mover a los lados
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 370;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Helper para obtener municipios oficiales según NICARAGUA_GEO_DATA
  const getGeoDepartment = (deptName: string): NicaraguaDepartment | undefined => {
    const clean = deptName.toLowerCase().trim();
    return NICARAGUA_GEO_DATA.find(
      (d) =>
        d.name.toLowerCase().trim() === clean ||
        clean.includes(d.name.toLowerCase().trim()) ||
        d.name.toLowerCase().includes(clean) ||
        (d.id && clean.includes(d.id))
    );
  };

  // Helper para saber si un municipio está habilitado en la BD
  const isMunicipalityEnabled = (munName: string, deptId?: string): boolean => {
    const clean = munName.toLowerCase().trim();
    const city = cities.find(
      (c) =>
        c.name.toLowerCase().trim() === clean &&
        (!deptId || !c.department_id || c.department_id === deptId)
    );
    if (!city) {
      return false;
    }
    return city.status === 'active';
  };

  // Conteo de municipios por departamento
  const getDepartmentMunicipalityStats = (dept: DepartmentItem) => {
    const geo = getGeoDepartment(dept.name);
    const list = geo?.municipalities || [];
    const enabledCount = list.filter((m) => isMunicipalityEnabled(m, dept.id)).length;
    return {
      total: list.length,
      enabled: enabledCount,
      disabled: list.length - enabledCount,
      list,
    };
  };

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingDept(null);
    setActiveModalTab('general');
    setFormData({
      name: '',
      code: '',
      description: '',
      is_creative_region: false,
      manager_id: '',
    });
  };

  const openEditModal = (dept: DepartmentItem, initialTab: 'general' | 'municipalities' = 'general') => {
    setIsCreatingNew(false);
    setEditingDept(dept);
    setActiveModalTab(initialTab);
    setFormData({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
      is_creative_region: dept.is_creative_region,
      manager_id: dept.manager_id || '',
    });
  };

  const openMunicipalitiesModal = (dept: DepartmentItem) => {
    setSelectedDeptForMunicipalities(dept);
    setMunSearch('');
  };

  const handleToggleMunicipality = async (dept: DepartmentItem, munName: string, currentlyEnabled: boolean) => {
    setTogglingMun(munName);
    const nextStatus = currentlyEnabled ? 'disabled' : 'active';
    try {
      await adminService.setMunicipalityStatus(dept.id, dept.name, munName, nextStatus);
      onRefresh();
    } finally {
      setTogglingMun(null);
    }
  };

  const handleBatchToggleMunicipalities = async (dept: DepartmentItem, status: 'active' | 'disabled') => {
    const geo = getGeoDepartment(dept.name);
    if (!geo || geo.municipalities.length === 0) return;
    setBatchLoading(true);
    try {
      await adminService.setDepartmentAllMunicipalities(dept.id, dept.name, geo.municipalities, status);
      onRefresh();
    } finally {
      setBatchLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isCreatingNew) {
        if (!formData.name.trim()) return;
        await adminService.createDepartment({
          name: formData.name.trim(),
          code: formData.code.trim() || formData.name.trim().substring(0, 2).toUpperCase(),
          description: formData.description.trim(),
          is_creative_region: formData.is_creative_region,
          manager_id: formData.manager_id || null,
        });
        setIsCreatingNew(false);
      } else if (editingDept) {
        await adminService.updateDepartment(editingDept.id, {
          name: formData.name.trim() || editingDept.name,
          code: formData.code.trim(),
          description: formData.description.trim(),
          is_creative_region: formData.is_creative_region,
          manager_id: formData.manager_id || undefined,
        });

        if (formData.manager_id !== editingDept.manager_id) {
          await adminService.assignDepartmentManager(
            editingDept.id,
            formData.manager_id || null
          );
        }
        setEditingDept(null);
      }

      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  // Filtrado de municipios en el modal activo
  const activeDeptForModal = selectedDeptForMunicipalities || (activeModalTab === 'municipalities' ? editingDept : null);
  const activeDeptGeo = activeDeptForModal ? getGeoDepartment(activeDeptForModal.name) : undefined;
  const filteredMunicipalities = useMemo(() => {
    if (!activeDeptGeo) return [];
    if (!munSearch.trim()) return activeDeptGeo.municipalities;
    const q = munSearch.toLowerCase().trim();
    return activeDeptGeo.municipalities.filter((m) => m.toLowerCase().includes(q));
  }, [activeDeptGeo, munSearch]);

  return (
    <div className="space-y-6">
      {/* Header Principal con Controles de Desplazamiento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Map className="w-5 h-5 text-purple-700" />
            Departamentos y Encargados Territoriales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            <span className="md:hidden">Desliza a los lados para explorar las regiones, asignar delegados y configurar municipios.</span>
            <span className="hidden md:inline">Gestiona los 15 departamentos y 2 regiones autónomas, asigna delegados y habilita municipios activos.</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
            <Building2 className="w-4 h-4 text-purple-700" />
            <span>{departments.filter((d) => d.is_creative_region).length} de {departments.length} Creativas</span>
          </div>

          {/* Botones de Desplazamiento Lateral: solo en móvil */}
          <div className="flex md:hidden items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              title="Mover a la izquierda"
              aria-label="Mover a la izquierda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              title="Mover a la derecha"
              aria-label="Mover a la derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Acción Rápida: Agregar */}
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm shadow-purple-600/30 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Territorio</span>
          </button>
        </div>
      </div>

      {/* Visualización de Territorios: Deslizable en móvil y Grid completo en escritorio */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x md:snap-none md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 pb-6 md:pb-0 pt-1 px-1 scroll-smooth scrollbar-thin md:scrollbar-none"
        >
          {departments.map((dept) => {
            const stats = getDepartmentMunicipalityStats(dept);
            const hasEnabledMunicipalities = stats.enabled > 0;

            return (
              <div
                key={dept.id}
                className={`w-[85vw] sm:w-[360px] md:w-full shrink-0 md:shrink snap-start md:snap-align-none rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                  dept.is_creative_region
                    ? 'bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 border-purple-300 ring-2 ring-purple-400/20 shadow-xs hover:shadow-md'
                    : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md opacity-95'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Header de tarjeta */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                          dept.is_creative_region
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {dept.code || dept.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-black text-slate-900 truncate" title={dept.name}>{dept.name}</h3>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Nicaragua • {dept.code || 'Territorio'}
                        </span>
                      </div>
                    </div>

                    {/* Badge informativo de tipo de región (sin botón confuso) */}
                    {dept.is_creative_region ? (
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-xs shrink-0"
                        title="Región Creativa Oficial"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Creativo</span>
                      </span>
                    ) : (
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 shrink-0"
                        title="Territorio Tradicional"
                      >
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>Tradicional</span>
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                    {dept.description || 'Sin descripción territorial detallada.'}
                  </p>

                  {/* Banner de Municipios Habilitados */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ${
                        hasEnabledMunicipalities ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        <MapPin className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                          Municipios
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          {stats.enabled} de {stats.total} Habilitados
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openMunicipalitiesModal(dept)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        hasEnabledMunicipalities
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                      title="Gestionar municipios de este departamento"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Gestionar</span>
                    </button>
                  </div>

                  {/* Encargado Departamental Asignado */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ${
                          dept.manager_id ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Encargado
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          {dept.manager_name || 'Sin asignar'}
                        </span>
                      </div>
                    </div>

                    {dept.manager_id && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-200 shrink-0">
                        Activo
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer / Acciones */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Estado: <strong className="text-emerald-700 capitalize font-bold">{dept.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(dept, 'general')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200 hover:border-purple-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Configurar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Tarjeta Final: Botón "+" para Agregar Nuevo Departamento o Región */}
          <button
            type="button"
            onClick={openCreateModal}
            className="w-[85vw] sm:w-[320px] md:w-full shrink-0 md:shrink snap-start md:snap-align-none rounded-3xl border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-50 transition-all duration-300 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer shadow-xs hover:shadow-md min-h-[300px] md:min-h-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-purple-100 group-hover:bg-purple-600 text-purple-700 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
              <Plus className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-purple-950 transition-colors">
                Agregar Nuevo Territorio
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-[240px] leading-relaxed">
                Habilita una nueva región o departamento, define su código y asigna su delegado.
              </p>
            </div>
            <span className="px-4 py-2 rounded-2xl bg-purple-700 group-hover:bg-purple-800 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 mt-2">
              <Plus className="w-4 h-4" />
              <span>Añadir Tarjeta</span>
            </span>
          </button>
        </div>
      </div>

      {/* ================= MODAL EXCLUSIVO: GESTIÓN DE MUNICIPIOS HABILITADOS ================= */}
      {selectedDeptForMunicipalities && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Municipios de {selectedDeptForMunicipalities.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Habilita o deshabilita municipios para controlar su acceso público en el mapa y la creación de rutas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDeptForMunicipalities(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Búsqueda y Acciones Rápidas */}
            <div className="space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={munSearch}
                    onChange={(e) => setMunSearch(e.target.value)}
                    placeholder="Buscar municipio por nombre..."
                    className="w-full pl-9.5 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-purple-600 focus:bg-white outline-hidden transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={batchLoading}
                    onClick={() => handleBatchToggleMunicipalities(selectedDeptForMunicipalities, 'active')}
                    className="px-3 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Habilitar Todos</span>
                  </button>

                  <button
                    type="button"
                    disabled={batchLoading}
                    onClick={() => handleBatchToggleMunicipalities(selectedDeptForMunicipalities, 'disabled')}
                    className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deshabilitar Todos</span>
                  </button>
                </div>
              </div>

              {/* Barra de Resumen */}
              {(() => {
                const stats = getDepartmentMunicipalityStats(selectedDeptForMunicipalities);
                return (
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs">
                    <span className="font-bold text-purple-950">
                      Total: {stats.total} municipios
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        ● {stats.enabled} Habilitados
                      </span>
                      <span className="font-bold text-slate-500 flex items-center gap-1">
                        ○ {stats.disabled} Inhabilitados
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Lista Scrollable de Municipios */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[50vh]">
              {filteredMunicipalities.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold text-xs">
                  No se encontraron municipios con ese nombre.
                </div>
              ) : (
                filteredMunicipalities.map((munName) => {
                  const isEnabled = isMunicipalityEnabled(munName, selectedDeptForMunicipalities.id);
                  const isToggling = togglingMun === munName;

                  return (
                    <div
                      key={munName}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isEnabled
                          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50/70 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isEnabled
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {munName}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {isEnabled
                              ? 'Habilitado para selección y rutas en el mapa'
                              : 'Inhabilitado (Acceso público restringido)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isEnabled
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-slate-200 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {isEnabled ? 'Habilitado' : 'Inhabilitado'}
                        </span>

                        <button
                          type="button"
                          disabled={isToggling || batchLoading}
                          onClick={() =>
                            handleToggleMunicipality(
                              selectedDeptForMunicipalities,
                              munName,
                              isEnabled
                            )
                          }
                          className={`p-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
                            isEnabled
                              ? 'text-emerald-700 hover:bg-emerald-100'
                              : 'text-slate-400 hover:bg-slate-200'
                          }`}
                          title={isEnabled ? 'Deshabilitar municipio' : 'Habilitar municipio'}
                        >
                          {isToggling ? (
                            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                          ) : isEnabled ? (
                            <ToggleRight className="w-7 h-7 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedDeptForMunicipalities(null)}
                className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-600/30 cursor-pointer"
              >
                Listo / Guardado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE EDICIÓN / CREACIÓN DE DEPARTAMENTO ================= */}
      {(editingDept || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  {isCreatingNew ? <Plus className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {isCreatingNew ? 'Nuevo Territorio / Departamento' : `Configurar: ${editingDept?.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isCreatingNew
                      ? 'Registra una nueva región o departamento en la red nacional'
                      : 'Configuración territorial, delegado y región creativa'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingDept(null);
                  setIsCreatingNew(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              {isCreatingNew && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Nombre del Departamento o Región *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Carazo, Madriz, RACCN..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all font-bold"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Código Territorial
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: LE, MY, GR, MN, BO"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Descripción & Vocación Cultural
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la riqueza histórica, artesanal o literaria del territorio..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Asignar Encargado / Delegado Departamental
                </label>
                <select
                  value={formData.manager_id}
                  onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:bg-white outline-hidden transition-all"
                >
                  <option value="">-- Sin encargado asignado --</option>
                  {potentialManagers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.lastname || ''} ({u.email}) - Rol: {u.role}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  El usuario asignado podrá gestionar los circuitos y eventos correspondientes a este territorio.
                </p>
              </div>

              {/* Selector Visual de Tipo de Región (Creativo vs Tradicional) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Tipo de Territorio & Vocación
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Opción 1: Región Creativa */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_creative_region: true })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      formData.is_creative_region
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/30 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      {formData.is_creative_region && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <span>🎨 Región Creativa</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        La tarjeta lucirá en color creativo, con circuitos y sellos en el mapa.
                      </p>
                    </div>
                  </button>

                  {/* Opción 2: Región Tradicional */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_creative_region: false })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      !formData.is_creative_region
                        ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/30 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      {!formData.is_creative_region && (
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <span>🏛️ Tradicional / Base</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        La tarjeta lucirá en tono neutral estándar con gestión de municipios.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDept(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isCreatingNew ? 'Crear Territorio' : 'Guardar Cambios'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
