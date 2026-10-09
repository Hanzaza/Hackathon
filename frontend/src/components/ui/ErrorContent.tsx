'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RefreshCw, Home, Compass } from 'lucide-react';

interface ErrorContentProps {
  reset?: () => void;
}

export default function ErrorContent({ reset }: ErrorContentProps) {
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-b from-[#182a4a] via-[#1c2e4c] to-[#14223b] text-white flex flex-col justify-between items-center text-center overflow-hidden select-none">
      
      {/* 1. LUZ Y BRILLO AMBIENTAL */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-400/10 via-rose-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 2. ÍCONOS CULTURALES EN EL CIELO */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[18%] left-[-10%] w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-20"
          animate={{
            x: ['0vw', '120vw'],
            y: [0, -30, 15, -20, 0],
            rotate: [5, -8, 12, -4, 5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/bird.png"
              alt="Guardabarranco"
              fill
              className="object-contain"
              sizes="80px"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-[14%] right-[10%] w-12 h-12 sm:w-16 sm:h-16 opacity-75 z-10"
          animate={{
            y: [0, 16, 0],
            rotate: [3, -5, 3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/gueguense.png"
              alt="El Güegüense"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        </motion.div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL (Error 500 amigable sin exponer código) */}
      <div className="relative z-30 flex flex-col items-center justify-center flex-grow pt-24 pb-12 px-6 max-w-2xl mx-auto">
        
        {/* Número 500 Suave y Elegante */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tight text-white/90 drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] leading-none"
        >
          500
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-4 sm:mt-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 max-w-lg mx-auto leading-snug">
            ¡Desvío momentáneo en la ruta cultural!
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Hemos tenido una pequeña pausa en la sincronización. No te preocupes, tus sellos y datos están seguros.
          </p>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          {reset && (
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_10px_25px_rgba(20,184,166,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              <span>Reintentar Conexión</span>
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-slate-200" />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/ciudades-creativas"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 font-bold text-xs sm:text-sm backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>Ver Mapa</span>
          </Link>
        </motion.div>

      </div>

      {/* 4. CAPAS DE NUBES DECORATIVAS INFERIORES */}
      <div className="relative w-full h-44 sm:h-56 md:h-68 z-20 pointer-events-none select-none">
        <div className="absolute -bottom-2 inset-x-0 h-40 sm:h-48 text-[#1b3459] opacity-90">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current">
            <path d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 inset-x-0 h-24 sm:h-32 text-white">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
            <path d="M0,64L48,80C96,96,192,128,288,149.3C384,171,480,181,576,170.7C672,160,768,128,864,122.7C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
      </div>

    </main>
  );
}
