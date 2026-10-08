'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Compass, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-b from-[#182a4a] via-[#1c2e4c] to-[#14223b] text-white flex flex-col justify-between items-center text-center overflow-hidden select-none">
      
      {/* 1. LUZ Y BRILLO AMBIENTAL DE CIELO */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-teal-400/10 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 2. ÍCONOS CULTURALES VOLANDO POR EL CIELO (Guardabarrancos y Elementos de ROOTS) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        
        {/* Ave 1: Guardabarranco Principal Volando */}
        <motion.div
          className="absolute top-[18%] left-[-10%] w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-20"
          animate={{
            x: ['0vw', '120vw'],
            y: [0, -35, 10, -25, 0],
            rotate: [5, -8, 12, -4, 5],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/bird.png"
              alt="Guardabarranco Volando"
              fill
              className="object-contain"
              sizes="80px"
              priority
            />
          </div>
        </motion.div>

        {/* Ave 2: Segundo Guardabarranco Más Lejano */}
        <motion.div
          className="absolute top-[32%] left-[-15%] w-12 h-12 sm:w-14 sm:h-14 opacity-85 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] z-10"
          animate={{
            x: ['0vw', '130vw'],
            y: [0, 25, -20, 15, 0],
            rotate: [-3, 8, -6, 10, -3],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            delay: 7,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/bird.png"
              alt="Guardabarranco en las Nubes"
              fill
              className="object-contain scale-x-[-1]"
              sizes="60px"
            />
          </div>
        </motion.div>

        {/* Ícono 3: El Güegüense Flotando Suavemente */}
        <motion.div
          className="absolute top-[12%] left-[8%] sm:left-[14%] w-12 h-12 sm:w-16 sm:h-16 opacity-75 z-10"
          animate={{
            y: [0, -18, 0],
            rotate: [-4, 6, -4],
          }}
          transition={{
            duration: 5,
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

        {/* Ícono 4: Catedral Flotando en el Horizonte */}
        <motion.div
          className="absolute top-[14%] right-[8%] sm:right-[15%] w-12 h-12 sm:w-16 sm:h-16 opacity-70 z-10"
          animate={{
            y: [0, 16, 0],
            rotate: [3, -5, 3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/cathedral.png"
              alt="Catedral de León"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        </motion.div>

        {/* Ícono 5: Grano de Café / Estrella en el Aire */}
        <motion.div
          className="absolute top-[42%] left-[6%] sm:left-[12%] w-10 h-10 sm:w-14 sm:h-14 opacity-60 z-10"
          animate={{
            y: [0, -14, 0],
            rotate: [10, -10, 10],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/coffee-star.png"
              alt="Café de las Segovias"
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
        </motion.div>

        {/* Ícono 6: Guitarra Típica */}
        <motion.div
          className="absolute top-[40%] right-[7%] sm:right-[12%] w-10 h-10 sm:w-14 sm:h-14 opacity-65 z-10"
          animate={{
            y: [0, 18, 0],
            rotate: [-8, 8, -8],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/guitar.png"
              alt="Guitarra de Masaya"
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
        </motion.div>

        {/* Ícono 7: Cerámica Precolombina */}
        <motion.div
          className="absolute bottom-[28%] left-[20%] w-10 h-10 sm:w-12 sm:h-12 opacity-70 z-10"
          animate={{
            y: [0, -12, 0],
            rotate: [5, -5, 5],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/icons/roots/pottery.png"
              alt="Cerámica de San Juan de Oriente"
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
        </motion.div>

      </div>

      {/* 3. CONTENIDO CENTRAL PRINCIPAL (404, Texto y Botón) */}
      <div className="relative z-30 flex flex-col items-center justify-center flex-grow pt-24 pb-12 px-6 max-w-2xl mx-auto">
        
        {/* Número 404 Gigante y Nítido */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tight text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] leading-none"
        >
          404
        </motion.h1>

        {/* Mensaje de Navegación Perdida */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-4 sm:mt-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 max-w-lg mx-auto leading-snug">
            Oops! Parece que este destino se ha perdido entre las nubes de Nicaragua.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            La ruta o sitio que buscas no está disponible, pero el mapa cultural te espera para seguir explorando.
          </p>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-slate-900" />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/ciudades-creativas"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>Ver Mapa Inmersivo</span>
          </Link>
        </motion.div>

      </div>

      {/* 4. CAPAS DE NUBES EN LA PARTE INFERIOR (Multi-layered SVG Clouds) */}
      <div className="relative w-full h-44 sm:h-56 md:h-68 z-20 pointer-events-none select-none">
        
        {/* Capa 1: Nubes Azul Oscuro Fondo */}
        <div className="absolute -bottom-2 inset-x-0 h-40 sm:h-48 text-[#1b3459] opacity-90">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current">
            <path d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Capa 2: Nubes Azul Medio */}
        <div className="absolute -bottom-4 inset-x-0 h-36 sm:h-44 text-[#2b4c7e] opacity-95">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current">
            <path d="M0,192L60,181.3C120,171,240,149,360,165.3C480,181,600,235,720,240C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          </svg>
        </div>

        {/* Capa 3: Nubes Azul Turquesa Brillante */}
        <div className="absolute -bottom-2 inset-x-0 h-32 sm:h-38 text-[#2563eb]/70 opacity-80">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current">
            <path d="M0,128L80,149.3C160,171,320,213,480,213.3C640,213,800,171,960,160C1120,149,1280,171,1360,181.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
          </svg>
        </div>

        {/* Capa 4: Nubes Blancas Esponjosas en Primer Plano */}
        <div className="absolute -bottom-1 inset-x-0 h-24 sm:h-32 text-white">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full fill-current drop-shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
            <path d="M0,64L48,80C96,96,192,128,288,149.3C384,171,480,181,576,170.7C672,160,768,128,864,122.7C960,117,1056,139,1152,154.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

      </div>

    </main>
  );
}
