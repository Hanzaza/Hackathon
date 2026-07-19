"use client";

import React, { useState } from 'react';
import NicaraguaSVG from './NicaraguaSVG';
import MapaInmersivo from '../map/MapaInmersivo'; // Ajusta la ruta si es diferente

// Definimos los 3 niveles de tu arquitectura
type NivelMapa = 'nacional' | 'departamental' | 'inmersivo';

export default function MapaContenedor() {
  // Estado 1: Controla qué capa estamos viendo (¡Inicia en 'nacional' por defecto!)
  const [nivelActual, setNivelActual] = useState<NivelMapa>('nacional');
  
  // Estado 2: Guarda qué departamento o municipio se seleccionó
  const [seleccion, setSeleccion] = useState<string | null>(null);

  // Función que recibe el clic desde NicaraguaSVG
  const manejarSeleccionNacional = (idDepartamento: string) => {
    setSeleccion(idDepartamento);
    
    // Aquí, en el futuro pasaremos a 'departamental' cuando tengas los SVGs listos.
    // Por ahora, para conectar todo, saltaremos directo al inmersivo para probar.
    setNivelActual('inmersivo'); 
  };

  // Función para el botón "Volver"
  const manejarRegreso = () => {
    if (nivelActual === 'inmersivo') {
      // En el futuro volverá al departamental, por ahora al nacional
      setNivelActual('nacional'); 
    } else if (nivelActual === 'departamental') {
      setNivelActual('nacional');
    }
  };

  return (
    <div className="w-full min-h-[600px] flex items-center justify-center relative">
      
      {/* NIVEL 1: Mapa Nacional SVG (Es el primero que se ve) */}
      {nivelActual === 'nacional' && (
        <div className="w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center p-4">
          <NicaraguaSVG onSelect={manejarSeleccionNacional} />
        </div>
      )}

      {/* NIVEL 2: Vista Departamental SVG (Preparado para cuando lo construyamos) */}
      {nivelActual === 'departamental' && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Vista del Departamento: {seleccion}</h2>
          <button onClick={manejarRegreso} className="bg-slate-800 text-white px-4 py-2 rounded">
            Volver
          </button>
          {/* Aquí irá tu SVG del departamento */}
        </div>
      )}

      {/* NIVEL 3: Detalle Municipal Inmersivo (MapLibre) */}
      {nivelActual === 'inmersivo' && (
        <div className="w-full h-full w-max-5xl p-4">
           {/* 
             Al instanciar MapaInmersivo, le pasamos la función manejarRegreso 
             para que su botón "Volver" sepa qué hacer 
           */}
          <MapaInmersivo 
            municipioId={seleccion || undefined} 
            onBack={manejarRegreso} 
          />
        </div>
      )}

    </div>
  );
}