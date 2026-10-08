'use client';

import React from 'react';
import { AnimatedMarqueeHero } from '@/components/ui/hero-3';

interface EmprendedoresHeroProps {
  onExploreClick?: () => void;
  onStoriesClick?: () => void;
  onRegisterClick?: () => void;
}

const EMPRENDEDORES_SHOWCASE_IMAGES = [
  "/emprendedores/emprendedora_bolsos.png", // Emprendedora con bolsos y accesorios artesanales
  "/emprendedores/taller_textil_capacitacion.png", // Taller de capacitación textil y confección
  "/emprendedores/diseno_trajes_folkloricos.png", // Confección y diseño de trajes folclóricos tradicionales
  "/emprendedores/taller_maquinas_costura.png", // Capacitación y tecnificación de artesanas textiles
  "/emprendedores/emprendedores_textiles_feria.png", // Emprendedores en feria comercial LAFISE / Mefcca
  "/emprendedores/showcase_cuero.png", // Bolsos y carteras de cuero artesanal nica
  "/emprendedores/showcase_chocolates.png", // Bombones finos y chocolates de cacao fino
  "/emprendedores/showcase_metal.png", // Arte en metal y lámparas de diseño
  "/emprendedores/showcase_salsas.png", // Salsas picantes y encurtidos tradicionales
  "/emprendedores/showcase_vinos.png", // Licores y vinos artesanales
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80", // Cerámica de San Juan de Oriente
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80", // Café de especialidad
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80", // Textiles y hamacas de Masaya
];

export default function EmprendedoresHero({
  onExploreClick,
  onStoriesClick,
  onRegisterClick,
}: EmprendedoresHeroProps) {
  const handleCta = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      const el = document.getElementById('sumar-emprendimiento');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AnimatedMarqueeHero
      tagline="Red Nacional de Ciudades Creativas • Nicaragua Emprende"
      title={
        <>
          El Corazón Creativo de{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-teal-300">
            Nuestra Identidad y Nuestras Manos
          </span>
        </>
      }
      description="Descubre los talleres tradicionales, los sabores ancestrales y las marcas emergentes que están transformando nuestras ciudades. Historias reales de valentía y perseverancia para inspirar a cada nuevo creador."
      ctaText="Sumar Mi Emprendimiento"
      onCtaClick={handleCta}
      images={EMPRENDEDORES_SHOWCASE_IMAGES}
    />
  );
}
