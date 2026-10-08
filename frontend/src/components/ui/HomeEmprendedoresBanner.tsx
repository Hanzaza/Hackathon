'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  BookOpen, 
  Heart, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Download,
  Users,
  Compass,
  Scissors,
  RotateCcw,
  BadgeCheck,
  TrendingUp,
  ChevronRight,
  FileText,
  Award
} from 'lucide-react';
import { InfiniteRibbon } from '@/components/ui/infinite-ribbon';

export default function HomeEmprendedoresBanner() {
  const [isBroken, setIsBroken] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCutRibbon = () => {
    if (isBroken || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsBroken(true);
      setIsAnimating(false);
    }, 600);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBroken(false);
  };

  return (
    <section className="w-full pt-16 sm:pt-24 pb-12 overflow-hidden">
      
      {/* 1. ENCABEZADO DE SECCIÓN INSTITUCIONAL & PROFESIONAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight max-w-4xl mx-auto">
          ¿Sos emprendedor y deseás saber todo lo que necesitás para{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A8A7] via-teal-700 to-[#0F3A2E]">
            mejorar y ser parte de la red?
          </span>
        </h2>
        
        <p className="mt-3 text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal">
          {isBroken 
            ? 'Ruta oficial de formalización, visibilidad en el Mapa Interactivo y recursos de capacitación gratuita:'
            : 'Hacé clic en los listones para abrir la guía paso a paso y conocer los requisitos de integración:'}
        </p>
      </div>

      {/* 2. ÁREA INTERACTIVA: LISTONES ENVOLVENTES O CONTENIDO REVELADO */}
      <div className="relative w-full py-6 min-h-[340px] flex items-center justify-center">

        <AnimatePresence mode="wait">
          {!isBroken ? (
            /* ESTADO 1: LISTONES INFINITOS CRUZADOS INTERACTIVOS */
            <motion.div 
              key="ribbons-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="relative w-full py-12 cursor-pointer select-none group"
              onClick={handleCutRibbon}
            >
              {/* Fondo decorativo sutil y profesional */}
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-amber-500/5 to-transparent pointer-events-none" />

              {/* CONTENEDOR DE LA "X" DE LISTONES */}
              <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] flex items-center justify-center overflow-hidden">
                
                {/* LISTÓN 1: CINTA DORADA EN DIAGONAL NEGATIVA */}
                <div className={`absolute w-[120%] -left-[10%] transition-transform duration-700 ease-out ${isAnimating ? '-translate-x-full -rotate-12 opacity-0' : 'group-hover:scale-[1.01]'}`}>
                  <InfiniteRibbon 
                    duration={60} 
                    rotation={-6}
                    className="bg-amber-400 text-slate-950 font-black text-xs sm:text-sm py-3 shadow-lg border-y border-amber-500/40 tracking-wider"
                  >
                    • ¿TE GUSTARÍA SER EMPRENDEDOR DE LA RED? • TOCÁ AQUÍ PARA INAUGURAR TU RUTA • GUÍA OFICIAL GRATIS EN PDF • ASESORÍA MEFCCA & INTUR • CAPACITACIÓN EN COSTOS & MARCA
                  </InfiniteRibbon>
                </div>

                {/* LISTÓN 2: CINTA TEAL EN DIAGONAL POSITIVA */}
                <div className={`absolute w-[120%] -left-[10%] transition-transform duration-700 ease-out ${isAnimating ? 'translate-x-full rotate-12 opacity-0' : 'group-hover:scale-[1.01]'}`}>
                  <InfiniteRibbon 
                    duration={52} 
                    reverse={true} 
                    rotation={6}
                    className="bg-[#007F7E] text-white font-black text-xs sm:text-sm py-3 shadow-xl border-y border-teal-600 tracking-wider"
                  >
                    • FORMALIZACIÓN SIMPLE • TU LOCAL EN EL MAPA INTERACTIVO • CONTACTO DIRECTO POR WHATSAPP • HISTORIAS DE ÉXITO • HACÉ CLIC Y CORTÁ EL LISTÓN
                  </InfiniteRibbon>
                </div>

                {/* BOTÓN CENTRAL: TIJERA / CORTE DE INAUGURACIÓN */}
                <div className="relative z-20 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="pointer-events-auto flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-slate-950 text-white border-2 border-amber-400 shadow-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-all cursor-pointer"
                  >
                    <Scissors className="w-5 h-5 text-amber-400 group-hover:text-slate-950 transition-transform" />
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">
                      {isAnimating ? 'Inaugurando...' : 'Tocar para Cortar el Listón'}
                    </span>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          ) : (
            /* ESTADO 2: CONTENIDO REVELADO ("CÓMO PUEDO SER EMPRENDEDOR") */
            <motion.div 
              key="content-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              {/* Contenedor con color sólido oficial #0F3A2E */}
              <div className="relative rounded-3xl bg-[#0F3A2E] text-white p-6 sm:p-10 lg:p-12 border border-teal-500/30 shadow-2xl overflow-hidden">
                
                <div className="relative z-10">
                  
                  {/* Barra Superior del Contenedor Revelado */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold">
                        <BadgeCheck className="w-6 h-6 text-teal-300" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold">
                          Ruta de Integración Oficial
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                          Paso a Paso: Cómo ser Emprendedor de la Red
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-colors cursor-pointer"
                      title="Volver a ver listones"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Volver a ver listón</span>
                    </button>
                  </div>

                  {/* 4 PASOS CLAVE PARA EL EMPRENDEDOR EN TARJETAS SÓLIDAS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    
                    {/* PASO 1: TARJETA VISUAL DE DIPLOMA / CERTIFICADO DE ACREDITACIÓN BLANCO */}
                    <div className="relative p-5 rounded-3xl bg-white border-[3px] border-[#00A8A7] flex flex-col justify-between transition-all group/cert shadow-2xl hover:shadow-teal-400/20">
                      
                      {/* 4 Remaches / Tornillos ornamentales de las esquinas del certificado */}
                      <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-teal-50 border-2 border-[#00A8A7] shadow-xs" />
                      <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-teal-50 border-2 border-[#00A8A7] shadow-xs" />
                      <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-teal-50 border-2 border-[#00A8A7] shadow-xs" />
                      <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-teal-50 border-2 border-[#00A8A7] shadow-xs" />

                      {/* Marco interior ornamental tipo diploma / pergamino */}
                      <div className="rounded-2xl bg-gradient-to-b from-[#F0FDF4]/40 via-white to-[#F0FDFA]/50 border border-[#00A8A7]/40 p-4 relative mb-3 shadow-xs">
                        
                        {/* Líneas decorativas clásicas de encabezado de diploma */}
                        <div className="flex flex-col gap-1 mb-3 opacity-40">
                          <div className="w-16 h-1 rounded-full bg-[#00A8A7]" />
                          <div className="w-24 h-1 rounded-full bg-[#00A8A7]" />
                          <div className="w-20 h-1 rounded-full bg-[#00A8A7]" />
                        </div>

                        {/* Cabecera del Certificado: Número + Insignia Oficial */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#00A8A7]/15 text-[#007F7E] flex items-center justify-center font-black text-xs border border-[#00A8A7]/30">
                            01
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#007F7E] font-black text-[10px] tracking-wider uppercase shadow-xs">
                            <BadgeCheck className="w-3 h-3 text-[#00A8A7]" />
                            Certificado Oficial
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-950 mb-1.5 flex items-center gap-1.5">
                          <span>Acreditación Gratuita</span>
                        </h4>
                        
                        <p className="text-xs text-slate-600 leading-relaxed font-medium pr-8">
                          Completá el registro institucional de tu taller o negocio creativo con respaldo municipal.
                        </p>

                        {/* Sello de Roseta Oficial de Acreditación (Dentro del marco del certificado) */}
                        <div className="absolute bottom-3 right-3 pointer-events-none z-10">
                          <div className="relative flex flex-col items-center">
                            {/* Medallón Dorado con Borde en Relieve e Ícono Oficial */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-[0_3px_8px_rgba(217,119,6,0.35)] border-2 border-amber-200 flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-500 to-amber-600 flex items-center justify-center border border-amber-300/60 shadow-inner">
                                <Award className="w-4 h-4 text-amber-100 drop-shadow-xs" />
                              </div>
                            </div>
                            {/* Dos Cintas Carmesí Colgantes con Corte en V */}
                            <div className="flex gap-1 -mt-1">
                              <div className="w-2 h-3 bg-gradient-to-b from-rose-700 to-rose-900 border-x border-rose-950 shadow-xs rotate-[-14deg] rounded-b-xs" />
                              <div className="w-2 h-3 bg-gradient-to-b from-rose-700 to-rose-900 border-x border-rose-950 shadow-xs rotate-[14deg] rounded-b-xs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link 
                        href="/emprendedores#sumar-emprendimiento"
                        className="pt-2 text-xs font-black text-[#007F7E] hover:text-[#0F3A2E] flex items-center justify-between group-hover/cert:translate-x-0.5 transition-all border-t border-slate-100"
                      >
                        <span>Registrar mi taller</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* PASO 2: TARJETA VISUAL DE MAPA CON RUTA Y PINES */}
                    <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#092B3A] via-[#06202C] to-[#041720] border-[3px] border-[#29B6F6]/60 hover:border-[#29B6F6] flex flex-col justify-between transition-all group/map shadow-xl hover:shadow-cyan-500/25 overflow-hidden">
                      
                      {/* Marco / Ilustración del Mapa con Ruta y Pines */}
                      <div className="rounded-2xl bg-[#041A26] border border-[#29B6F6]/40 p-2.5 relative mb-3 overflow-hidden shadow-inner">
                        
                        {/* Ilustración Vectorial del Mapa con Fondo de Océano Azul */}
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#0F4264] flex items-center justify-center">
                          <svg 
                            viewBox="0 0 240 140" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/map:scale-105"
                          >
                            <defs>
                              {/* Gradiente de Océano */}
                              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0B3C5D" />
                                <stop offset="50%" stopColor="#155E8D" />
                                <stop offset="100%" stopColor="#09314D" />
                              </linearGradient>
                            </defs>

                            {/* Fondo de Océano */}
                            <rect width="240" height="140" fill="url(#oceanGrad)" />

                            {/* Olas y corrientes marinas decorativas del océano */}
                            <path d="M0 20 Q60 12 120 20 T240 20" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.25" fill="none" strokeDasharray="6 6" />
                            <path d="M0 65 Q60 55 120 65 T240 65" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.2" fill="none" strokeDasharray="8 8" />
                            <path d="M0 120 Q60 110 120 120 T240 120" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.25" fill="none" strokeDasharray="6 6" />

                            {/* Fondo / Mancha de Tierra Verde Oliva Superior */}
                            <path 
                              d="M70 85 C90 40 150 35 220 60 C240 70 240 10 210 5 C150 0 90 15 50 45 Z" 
                              fill="#7FA04B" 
                              stroke="#97B862"
                              strokeWidth="1.2"
                            />
                            
                            {/* Mancha de Tierra Celeste / Turquesa Izquierda */}
                            <path 
                              d="M10 80 C10 60 50 55 110 75 C130 80 130 130 100 135 C40 145 10 125 10 80 Z" 
                              fill="#4D9CAB" 
                              stroke="#76BFCE"
                              strokeWidth="1.2"
                            />
                            
                            {/* Mancha de Parcela Naranja Ocre Derecha */}
                            <path 
                              d="M130 70 H215 C225 70 230 110 220 130 C190 145 140 140 130 130 Z" 
                              fill="#EFA65B" 
                              stroke="#F6BA7C"
                              strokeWidth="1.2"
                            />
                            
                            {/* Líneas de Calles / Cuadrícula Blanca */}
                            <path 
                              d="M125 40 V135 M125 70 H220" 
                              stroke="white" 
                              strokeWidth="5" 
                              strokeLinecap="round" 
                              opacity="0.95"
                            />
                            
                            {/* Ruta GPS Azul Neón Discontinua */}
                            <path 
                              d="M45 95 H95 C115 95 125 60 145 55 C165 50 180 75 160 105 C150 120 180 135 195 125" 
                              stroke="#00D2FF" 
                              strokeWidth="3.5" 
                              strokeDasharray="5 3" 
                              fill="none" 
                              strokeLinecap="round" 
                            />
                            
                            {/* Puntos / Waypoints de la Ruta */}
                            <circle cx="125" cy="60" r="4.5" fill="#0B2545" stroke="white" strokeWidth="1.5" />
                            <circle cx="195" cy="130" r="4.5" fill="#0B2545" stroke="white" strokeWidth="1.5" />
                            <circle cx="45" cy="100" r="4.5" fill="#0B2545" stroke="white" strokeWidth="1.5" />
                            
                            {/* PIN 1: SUPERIOR (Rojo Coral con sombra y centro blanco) */}
                            <g transform="translate(110, 5)" className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                              <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 36 15 36 C15 36 30 26 30 15 C30 6.7 23.3 0 15 0 Z" fill="#E53935" />
                              <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 36 15 36 V0 Z" fill="#C62828" opacity="0.35" />
                              <circle cx="15" cy="14" r="5.5" fill="white" />
                            </g>
                            
                            {/* PIN 2: IZQUIERDO (Rojo Coral) */}
                            <g transform="translate(30, 48)" className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                              <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 36 15 36 C15 36 30 26 30 15 C30 6.7 23.3 0 15 0 Z" fill="#E53935" />
                              <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 36 15 36 V0 Z" fill="#C62828" opacity="0.35" />
                              <circle cx="15" cy="14" r="5.5" fill="white" />
                            </g>
                            
                            {/* PIN 3: DERECHO (Naranja / Amarillo Dorado) */}
                            <g transform="translate(170, 70)" className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                              <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 36 15 36 C15 36 30 26 30 15 C30 6.7 23.3 0 15 0 Z" fill="#F59E0B" />
                              <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 36 15 36 V0 Z" fill="#D97706" opacity="0.35" />
                              <circle cx="15" cy="14" r="5.5" fill="white" />
                            </g>
                          </svg>
                        </div>

                        {/* Cabecera del Mapa: Número + Insignia */}
                        <div className="flex items-center gap-2 mt-2.5 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-[#29B6F6]/20 text-[#29B6F6] flex items-center justify-center font-black text-xs border border-[#29B6F6]/40">
                            02
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#29B6F6]/15 border border-[#29B6F6]/50 text-sky-200 font-black text-[10px] tracking-wider uppercase">
                            <MapPin className="w-3 h-3 text-[#29B6F6]" />
                            Mapa Interactivo
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mb-1">
                          Pin en el Mapa Interactivo
                        </h4>
                        
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Posicioná tu local en los circuitos turísticos con enlace directo a WhatsApp para atención a visitantes.
                        </p>
                      </div>

                      <Link 
                        href="/ciudades-creativas"
                        className="pt-2 text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center justify-between group-hover/map:translate-x-0.5 transition-all"
                      >
                        <span>Ver Mapa Inmersivo</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* PASO 3: TARJETA ESTILO DOCUMENTO PDF ROJIZO */}
                    <div className="relative p-5 rounded-3xl bg-gradient-to-br from-[#8B1E1E] via-[#731717] to-[#4D0F0F] border-2 border-red-400/60 hover:border-red-300 flex flex-col justify-between transition-all group/pdf shadow-xl hover:shadow-red-600/30 overflow-hidden">
                      
                      {/* Efecto Esquina Doblada de Documento / Dog-ear PDF */}
                      <div className="absolute top-0 right-0 w-9 h-9 pointer-events-none z-10">
                        <div className="absolute top-0 right-0 border-t-[32px] border-l-[32px] border-t-[#0F3A2E] border-l-red-950/80 shadow-md" />
                        <div className="absolute top-0 right-0 border-t-[28px] border-l-[28px] border-t-[#0F3A2E] border-l-red-200/50" />
                      </div>

                      {/* Marco interior tipo hoja de documento PDF */}
                      <div className="rounded-2xl bg-white/[0.08] border border-white/20 p-4 relative mb-3 shadow-inner">
                        
                        {/* Cabecera del PDF: Número + Insignia Blanca/Roja Oficial de PDF */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-black text-xs border border-white/30">
                            03
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white text-red-700 font-black text-[10px] tracking-wider uppercase shadow-md">
                            <FileText className="w-3.5 h-3.5 text-red-600" />
                            PDF Oficial
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                          <span>Guía Oficial del Emprendedor</span>
                        </h4>
                        
                        <p className="text-xs text-red-100/90 leading-relaxed font-medium">
                          Manual técnico descargable con cálculo de costos de producción, formalización simplificada y diseño de empaque.
                        </p>
                      </div>

                      <Link 
                        href="/emprendedores#guia-emprendedor"
                        className="pt-2 text-xs font-bold text-white hover:text-red-200 flex items-center justify-between group-hover/pdf:translate-x-0.5 transition-all border-t border-red-400/30"
                      >
                        <span className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-red-200" />
                          Descargar Documento PDF
                        </span>
                        <ChevronRight className="w-4 h-4 text-red-200" />
                      </Link>
                    </div>

                    {/* PASO 4: TARJETA VISUAL DE HISTORIAS & MENTORÍA (DAR IMPULSO & RED COLECTIVA) */}
                    <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#3A2204] via-[#261502] to-[#150A01] border-[3px] border-amber-400/60 hover:border-amber-300 flex flex-col justify-between transition-all group/mentoria shadow-xl hover:shadow-amber-500/25 overflow-hidden">
                      
                      {/* Marco / Ilustración del Impulso & Mentoría */}
                      <div className="rounded-2xl bg-[#231402] border border-amber-400/30 p-2.5 relative mb-3 overflow-hidden shadow-inner">
                        
                        {/* Ilustración Vectorial Inspirada en "Dar Impulso / Acompañamiento" */}
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gradient-to-b from-[#3A2204] to-[#150A01] flex items-center justify-center">
                          <svg 
                            viewBox="0 0 240 140" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-full h-full object-contain transition-transform duration-500 group-hover/mentoria:scale-105"
                          >
                            <defs>
                              {/* Gradiente de la Rampa / Flecha Ascendente de Impulso */}
                              <linearGradient id="rampImpulseGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                                <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.95" />
                              </linearGradient>

                              {/* Brillo de los Nodos de Conexión y Mentoría */}
                              <radialGradient id="glowPulseNode" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#F472B6" stopOpacity="0.9" />
                                <stop offset="45%" stopColor="#FB7185" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
                              </radialGradient>
                            </defs>

                            {/* 1. Flecha Curva Ascendente de Crecimiento & Impulso */}
                            <path 
                              d="M10 135 C50 120 100 110 160 95 C195 85 215 65 225 45 L220 50 L235 25 L210 32 L215 37 C205 55 185 75 150 85 C95 100 50 110 10 125 Z" 
                              fill="url(#rampImpulseGrad)" 
                            />
                            
                            {/* Línea guía de trayectoria punteada luminosa */}
                            <path 
                              d="M15 130 C70 115 130 102 225 35" 
                              stroke="#FDE047" 
                              strokeWidth="1.5" 
                              strokeDasharray="4 4" 
                              strokeOpacity="0.75"
                              fill="none" 
                            />

                            {/* Hilos / Filamentos de conexión en red de mentoría */}
                            <path d="M55 110 C85 85 105 75 125 55" stroke="#FB7185" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
                            <path d="M125 55 C145 75 160 85 185 92" stroke="#FB7185" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
                            <path d="M125 55 C120 85 110 100 95 112" stroke="#FB7185" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
                            <path d="M125 55 C140 70 150 78 152 100" stroke="#FB7185" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />

                            {/* FIGURA 1 (IZQUIERDA - Emprendedor que sube y recibe el impulso) */}
                            {/* Cabeza */}
                            <circle cx="92" cy="35" r="11" fill="#60A5FA" />
                            {/* Cuerpo y extremidades en avance */}
                            <path 
                              d="M87 47 C80 49 72 58 68 70 C66 74 70 76 73 73 C76 65 80 58 85 55 L83 75 L71 105 C69 110 73 113 77 110 L91 80 L96 76 L94 100 L95 112 C95 117 101 117 102 112 L103 82 C103 72 98 62 93 54 L108 55 C113 55 118 53 124 55 C126 56 127 54 125 52 C118 47 110 47 100 48 Z" 
                              fill="#60A5FA" 
                            />

                            {/* FIGURA 2 (DERECHA - Mentor que extiende la mano y da el impulso) */}
                            {/* Cabeza */}
                            <circle cx="152" cy="22" r="11" fill="#38BDF8" />
                            {/* Cuerpo y extremidades dando impulso */}
                            <path 
                              d="M148 34 C140 37 132 44 124 53 C122 55 125 57 127 56 C134 49 141 43 147 41 L146 58 L152 75 L150 95 C149 100 155 102 157 98 L160 76 L168 68 L180 88 C183 93 189 91 187 86 L175 66 C173 60 167 52 161 45 L170 42 C176 40 180 48 184 55 C186 58 190 56 188 53 C184 45 178 34 168 35 Z" 
                              fill="#38BDF8" 
                            />

                            {/* Nodos de Conexión & Puntos de Impulso */}
                            {/* 1. Nodo central: Apretón de Manos / Impulso de Mentoría */}
                            <circle cx="125" cy="54" r="16" fill="url(#glowPulseNode)" />
                            <circle cx="125" cy="54" r="5" fill="#FDA4AF" />
                            <circle cx="125" cy="54" r="2.5" fill="white" />

                            {/* 2. Nodos en puntos de apoyo y avance */}
                            <circle cx="55" cy="110" r="9" fill="url(#glowPulseNode)" />
                            <circle cx="55" cy="110" r="3" fill="#FDA4AF" />

                            <circle cx="95" cy="112" r="9" fill="url(#glowPulseNode)" />
                            <circle cx="95" cy="112" r="3" fill="#FDA4AF" />

                            <circle cx="152" cy="98" r="9" fill="url(#glowPulseNode)" />
                            <circle cx="152" cy="98" r="3" fill="#FDA4AF" />

                            <circle cx="185" cy="88" r="9" fill="url(#glowPulseNode)" />
                            <circle cx="185" cy="88" r="3" fill="#FDA4AF" />

                            {/* Partículas de inspiración y destellos */}
                            <circle cx="40" cy="80" r="1.5" fill="#F472B6" opacity="0.6" />
                            <circle cx="70" cy="30" r="1.5" fill="#38BDF8" opacity="0.6" />
                            <circle cx="180" cy="20" r="1.5" fill="#FCD34D" opacity="0.7" />
                            <circle cx="210" cy="70" r="1.5" fill="#FBBF24" opacity="0.8" />
                            <circle cx="140" cy="125" r="1.5" fill="#F472B6" opacity="0.5" />
                          </svg>
                        </div>

                        {/* Cabecera de la Tarjeta: Número + Insignia */}
                        <div className="flex items-center gap-2 mt-2.5 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xs border border-amber-400/50">
                            04
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/50 text-amber-200 font-black text-[10px] tracking-wider uppercase">
                            <Users className="w-3 h-3 text-amber-400" />
                            Mentoría & Red
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mb-1">
                          Historias & Mentoría
                        </h4>
                        
                        <p className="text-xs text-amber-100/85 leading-relaxed">
                          Conocé las experiencias de artesanos y productores consolidados sobre canales de comercialización y ferias.
                        </p>
                      </div>

                      <Link 
                        href="/emprendedores#historias-inspiradoras"
                        className="pt-2 text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center justify-between group-hover/mentoria:translate-x-0.5 transition-all"
                      >
                        <span>Leer testimonios</span>
                        <ChevronRight className="w-4 h-4 text-amber-300" />
                      </Link>
                    </div>

                  </div>

                  {/* PIE DE ACCIÓN PRINCIPAL */}
                  <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-slate-300 text-center sm:text-left">
                      ¿Deseás consultar el directorio completo o postular tu emprendimiento?
                    </p>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                      <Link
                        href="/emprendedores"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00A8A7] to-[#007F7E] hover:from-[#00BFBD] hover:to-[#009694] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                      >
                        <Store className="w-4 h-4" />
                        <span>Acceder al Espacio de Emprendedores</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </section>
  );
}
