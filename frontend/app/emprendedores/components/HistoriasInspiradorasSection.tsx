'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  Quote, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  ArrowRight, 
  X, 
  ChevronRight, 
  Share2, 
  CheckCircle,
  Clock,
  Compass,
  User
} from 'lucide-react';
import { INSPIRING_STORIES, InspiringStory } from '@/data/emprendedoresData';

const THEMES = [
  'Todos',
  'Superación',
  'Liderazgo Femenino',
  'Innovación Joven',
  'Tradición Familiar',
  'Impacto Comunitario',
] as const;

export default function HistoriasInspiradorasSection() {
  const [selectedTheme, setSelectedTheme] = useState<string>('Todos');
  const [activeStoryModal, setActiveStoryModal] = useState<InspiringStory | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredStories = selectedTheme === 'Todos'
    ? INSPIRING_STORIES
    : INSPIRING_STORIES.filter(s => s.themeTag === selectedTheme);

  const handleShare = (story: InspiringStory) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${story.highlightQuote}" - Conoce la historia de ${story.authorName} (${story.businessName}) en Ciudades Creativas Nicaragua`);
      setCopiedId(story.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section id="historias-inspiradoras" className="py-16 lg:py-24 bg-gradient-to-b from-white via-amber-50/40 to-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold shadow-sm mb-3">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500 animate-pulse" />
            <span>Voces que Abren Camino &bull; Experiencias Reales</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Historias que Conmueven e Inspiran
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Emprender en Nicaragua es un acto de valentía y arraigo cultural. Escucha y lee los testimonios sinceros de quienes transformaron la incertidumbre en progreso para sus familias y comunidades.
          </p>

          {/* Theme Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {THEMES.map((theme) => {
              const isActive = selectedTheme === theme;
              return (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.03]'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  {theme}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stories Grid / Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              {/* Card Top: Hero image with Quote badge */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={story.heroImageUrl}
                  alt={story.businessName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Theme Tag & City */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${story.badgeColor}`}>
                    {story.themeTag}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                    📍 {story.city}
                  </span>
                </div>

                {/* Listen Time / Audio Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-amber-300 font-medium bg-slate-950/70 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{story.listenTime}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Quote icon & Emotive Pull Quote */}
                  <div className="relative pl-6 mb-3">
                    <Quote className="w-5 h-5 text-rose-400 absolute left-0 top-0 opacity-60" />
                    <p className="text-sm sm:text-base font-semibold text-slate-800 italic leading-snug">
                      &ldquo;{story.highlightQuote}&rdquo;
                    </p>
                  </div>

                  {/* Impact Metric Pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-teal-50/80 border border-teal-200/60 text-teal-900 text-xs font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span>{story.fullStory.impactMetric}</span>
                  </div>
                </div>

                {/* Author Info & Button */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-rose-300 flex-shrink-0">
                        <Image
                          src={story.avatarUrl}
                          alt={story.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{story.authorName}</div>
                        <div className="text-xs text-slate-500">{story.businessName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveStoryModal(story)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group-hover:bg-rose-600"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Leer Historia Completa</span>
                    </button>

                    <button
                      onClick={() => handleShare(story)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copiar cita inspiradora"
                    >
                      {copiedId === story.id ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FULL STORY READER MODAL ================= */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="relative h-64 w-full bg-slate-900 flex-shrink-0">
              <Image
                src={activeStoryModal.heroImageUrl}
                alt={activeStoryModal.businessName}
                fill
                className="object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

              <button
                onClick={() => setActiveStoryModal(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${activeStoryModal.badgeColor}`}>
                    {activeStoryModal.themeTag}
                  </span>
                  <span className="text-xs text-slate-200">
                    📍 {activeStoryModal.city} &bull; {activeStoryModal.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {activeStoryModal.businessName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Por {activeStoryModal.authorName}
                </p>
              </div>
            </div>

            {/* Modal Content - 3 Story Chapters */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Highlight Emotive Banner */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 relative">
                <Quote className="w-6 h-6 text-amber-600 mb-2" />
                <p className="text-base sm:text-lg font-bold italic text-slate-800 leading-snug">
                  &ldquo;{activeStoryModal.highlightQuote}&rdquo;
                </p>
              </div>

              {/* Chapter 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm tracking-wide uppercase">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-extrabold">1</span>
                  <h4>El Sueño Inicial y el Primer Paso</h4>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pl-8">
                  {activeStoryModal.fullStory.start}
                </p>
              </div>

              {/* Chapter 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm tracking-wide uppercase">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-extrabold">2</span>
                  <h4>El Momento de Prueba & Cómo Salimos Adelante</h4>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pl-8">
                  {activeStoryModal.fullStory.turningPoint}
                </p>
              </div>

              {/* Chapter 3 */}
              <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm tracking-wide uppercase">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h4>Consejo de Oro para Quienes Empiezan Hoy</h4>
                </div>
                <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed mt-2 italic">
                  &ldquo;{activeStoryModal.fullStory.goldenAdvice}&rdquo;
                </p>
              </div>

              {/* Impact Metric Banner */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Impacto logrado: {activeStoryModal.fullStory.impactMetric}</span>
              </div>

              {/* Footer action buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleShare(activeStoryModal)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedId === activeStoryModal.id ? '¡Cita copiada al portapapeles!' : 'Compartir Cita Inspiradora'}</span>
                </button>

                <button
                  onClick={() => setActiveStoryModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar Lectura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
