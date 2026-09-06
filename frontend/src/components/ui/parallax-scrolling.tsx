'use client';

import React from 'react';
import CiudadesCreativasHero from './CiudadesCreativasHero';

export { CiudadesCreativasHero };

export interface ParallaxComponentProps {
  title?: string;
  layer1?: string;
  layer2?: string;
}

/**
 * Reemplazo de ParallaxComponent por CiudadesCreativasHero para eliminar el efecto parallax
 * y scroll-hijacking en todas las vistas, manteniendo compatibilidad de exportación.
 */
export function ParallaxComponent(_props: ParallaxComponentProps) {
  return <CiudadesCreativasHero />;
}

export default CiudadesCreativasHero;
