'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Quote, 
  MessageCircle, 
  ExternalLink, 
  Award, 
  X, 
  Store, 
  Compass, 
  CheckCircle2, 
  Pause, 
  Play 
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa6';
import { FEATURED_ENTREPRENEURS, FeaturedEntrepreneur } from '@/data/emprendedoresData';

const CATEGORIES = [
  'Todos',
  'Artesanía & Barro',
  'Café & Cacao',
  'Gastronomía Tradicional',
  'Calzado & Cuero',
  'Arte & Muralismo',
  'Moda & Textil',
] as const;

export default function EmprendimientosCarousel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeModalItem, setActiveModalItem] = useState<FeaturedEntrepreneur | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'Todos'
    ? FEATURED_ENTREPRENEURS
    : FEATURED_ENTREPRENEURS.filter(item => item.category === selectedCategory);

  // Scroll handler
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 360; // Approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          // Loop back to start
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlay, filteredItems.length]);

  return (
    <section id="carrusel-emprendimientos" className="py-16 lg:py-20 bg-slate-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>Orgullo de Nuestras Ciudades</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Carrusel de Emprendimientos Destacados
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Explora talleres con tradición viva, propuestas gastronómicas auténticas y proyectos innovadores que enriquecen los Circuitos Creativos de Nicaragua.
            </p>
          </div>

          {/* Controls: Prev/Next & Autoplay toggle */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              title={isAutoPlay ? "Pausar reproducción automática" : "Reanudar reproducción automática"}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm transition-all cursor-pointer"
            >
              {isAutoPlay ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[310px] sm:w-[350px] snap-start bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden"
            >
              {/* Image & Badges */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 310px, 350px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top badges: City & Verification */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.city}</span>
                  </div>

                  {item.isVerified && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/90 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verificado</span>
                    </div>
                  )}
                </div>

                {/* Bottom of image: Category & Established */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/90 font-semibold backdrop-blur-sm">
                    {item.category}
                  </span>
                  <span className="text-slate-200 font-medium">
                    Desde {item.yearEstablished}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating & Award */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({item.reviewsCount})</span>
                    </div>

                    {item.awardBadge && (
                      <span className="text-[11px] text-amber-700 font-semibold truncate max-w-[170px]" title={item.awardBadge}>
                        🏆 {item.awardBadge}
                      </span>
                    )}
                  </div>

                  {/* Business Name */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>

                  {/* Founder */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200">
                      <Image
                        src={item.founderAvatar}
                        alt={item.founder}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-slate-600 font-medium line-clamp-1">
                      {item.founder} &bull; <span className="text-slate-500">{item.founderRole}</span>
                    </span>
                  </div>

                  {/* Tagline / Quote */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    &ldquo;{item.quickQuote}&rdquo;
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.specialties.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {spec}
                      </span>
                    ))}
                    {item.specialties.length > 3 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        +{item.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="text-xs font-bold text-slate-800 hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Conocer Historia</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {item.whatsapp && (
                      <a
                        href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}?text=Hola!%20Vi%20su%20negocio%20${encodeURIComponent(item.name)}%20en%20Ciudades%20Creativas%20Nicaragua.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      href={`/ciudades-creativas/${item.citySlug}`}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                      title="Ver Ciudad en el Mapa"
                    >
                      <Compass className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header Image */}
            <div className="relative h-56 w-full bg-slate-900">
              <Image
                src={activeModalItem.imageUrl}
                alt={activeModalItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-xs font-bold">
                    {activeModalItem.category}
                  </span>
                  <span className="text-xs text-slate-200">
                    📍 {activeModalItem.city}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold">{activeModalItem.name}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Founder Spotlight */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0">
                  <Image
                    src={activeModalItem.founderAvatar}
                    alt={activeModalItem.founder}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{activeModalItem.founder}</div>
                  <div className="text-xs text-amber-800 font-medium">{activeModalItem.founderRole}</div>
                  <div className="text-[11px] text-slate-500">Fundado en el año {activeModalItem.yearEstablished}</div>
                </div>
              </div>

              {/* Inspiring quote */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white relative">
                <Quote className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-sm italic text-slate-200">
                  &ldquo;{activeModalItem.quickQuote}&rdquo;
                </p>
              </div>

              {/* Story & Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Sobre el Emprendimiento
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Especialidades & Productos Estrella
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalItem.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {activeModalItem.whatsapp && (
                    <a
                      href={`https://wa.me/${activeModalItem.whatsapp.replace(/[^0-9]/g, '')}?text=Hola!%20Vi%20su%20negocio%20${encodeURIComponent(activeModalItem.name)}%20en%20Ciudades%20Creativas%20Nicaragua.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Escribir por WhatsApp</span>
                    </a>
                  )}
                  {activeModalItem.instagram && (
                    <a
                      href={`https://instagram.com/${activeModalItem.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs sm:text-sm font-bold transition-colors"
                    >
                      <FaInstagram className="w-4 h-4" />
                      <span>{activeModalItem.instagram}</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/ciudades-creativas/${activeModalItem.citySlug}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Explorar {activeModalItem.city} en el Mapa</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
