'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxComponentProps {
  title?: string;
  layer1?: string; // Capa 1: FONDO (Cielo)
  layer2?: string; // Capa 2: MEDIO (Volcán con transparencia)
}

export function ParallaxComponent({
  title = "Ciudades Creativas",
  layer1 = "/parallax/layer1.png",
  layer2 = "/parallax/layer2.png",
}: ParallaxComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const volcanoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Registrar el plugin de GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!containerRef.current || !stickyRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Movimiento cinemático ultra suave
          invalidateOnRefresh: true,
        },
      });

      // 1. Capa 1 (CIELO al fondo): Desplazamiento sutil hacia abajo
      if (skyRef.current) {
        tl.to(
          skyRef.current,
          {
            yPercent: 14,
            scale: 1.08,
            ease: 'none',
          },
          0
        );
      }

      // 2. TEXTO ("Ciudades Creativas"): Flota y asciende en 3D
      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            yPercent: -60,
            scale: 0.9,
            opacity: 0.15,
            ease: 'none',
          },
          0
        );
      }

      // 3. Capa 2 (VOLCÁN centrado): Sube cubriendo el texto
      if (volcanoRef.current) {
        tl.to(
          volcanoRef.current,
          {
            yPercent: 18,
            scale: 1.08,
            ease: 'none',
          },
          0
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220vh] sm:h-[260vh] bg-slate-950 text-white overflow-visible select-none"
    >
      {/* Contenedor Sticky fijo durante el recorrido del scroll */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-slate-950"
      >
        {/* ================= Z-INDEX 0: CAPA 1 - CIELO / FONDO ================= */}
        <div
          ref={skyRef}
          className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none will-change-transform z-0"
        >
          {layer1 ? (
            <img
              src={layer1}
              alt="Cielo Fondo"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-sky-600 via-sky-400 to-indigo-900" />
          )}
          {/* Sutil viñeta para profundidad visual */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* ================= Z-INDEX 10: TEXTO ÚNICO ("Ciudades Creativas") ================= */}
        <div
          ref={titleRef}
          className="relative z-10 flex flex-col items-center justify-center px-4 text-center w-full max-w-6xl mx-auto will-change-transform -translate-y-24 sm:-translate-y-32 md:-translate-y-36"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight text-white leading-[1.0] drop-shadow-[0_12px_45px_rgba(0,0,0,0.85)]">
            {title}
          </h1>
        </div>

        {/* ================= Z-INDEX 20: CAPA 2 - VOLCÁN PERFECTAMENTE CENTRADO ================= */}
        {layer2 && (
          <div
            ref={volcanoRef}
            className="absolute inset-x-0 bottom-0 w-full h-[105vh] sm:h-[110vh] md:h-[115vh] flex items-end justify-center pointer-events-none will-change-transform z-20"
          >
            <img
              src={layer2}
              alt="Volcán Capa Media"
              className="w-full h-full object-cover object-[center_bottom] max-w-none md:max-w-full"
            />
          </div>
        )}

        {/* ================= Z-INDEX 35: DEGRADADO DE TRANSICIÓN AL BANNER MORADO ================= */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-purple-900 via-purple-950/70 to-transparent z-35 pointer-events-none" />
      </div>
    </div>
  );
}

export default ParallaxComponent;
