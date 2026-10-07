'use client';

import React from 'react';
import EmprendedoresHero from './components/EmprendedoresHero';
import EmprendimientosCarousel from './components/EmprendimientosCarousel';
import HistoriasInspiradorasSection from './components/HistoriasInspiradorasSection';
import ConsejosYDecalogoSection from './components/ConsejosYDecalogoSection';
import DirectorioEmprendimientos from './components/DirectorioEmprendimientos';
import GuiaEmprendedorSection from './components/GuiaEmprendedorSection';
import RegistroEmprendedorCTA from './components/RegistroEmprendedorCTA';

export default function EmprendedoresPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20">
      {/* 1. Hero Section con métricas de impacto */}
      <EmprendedoresHero
        onExploreClick={() => scrollToSection('carrusel-emprendimientos')}
        onStoriesClick={() => scrollToSection('historias-inspiradoras')}
        onRegisterClick={() => scrollToSection('sumar-emprendimiento')}
      />

      {/* 2. Carrusel Interactivo de Emprendimientos Destacados */}
      <EmprendimientosCarousel />

      {/* 3. Muro de Historias Conmovedoras & Voces que Inspiran */}
      <HistoriasInspiradorasSection />

      {/* 4. Semillero de Consejos: El Decálogo para Emprendedores Creativos */}
      <ConsejosYDecalogoSection />

      {/* 5. Directorio y Buscador de Emprendedores por Ciudad */}
      <DirectorioEmprendimientos />

      {/* 6. Centro de Recursos: La Guía Oficial del Emprendedor */}
      <GuiaEmprendedorSection />

      {/* 7. Llamado a la Acción: Únete a la Red Creativa */}
      <RegistroEmprendedorCTA />
    </main>
  );
}
