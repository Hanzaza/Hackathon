'use client'; 

import dynamic from 'next/dynamic';

const MapaOrquestador = dynamic(() => import('@/components/map/MapaContenedor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
        Cargando Mapa Nacional...
      </span>
    </div>
  ),
});

export default function CiudadesCreativasPage() {
  return (
    <main className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      
      {/* Título contextual para esta sección */}
      <div className="absolute top-6 left-6 z-10 p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl pointer-events-none">
        <h1 className="text-2xl font-bold text-white">Ciudades Creativas</h1>
        <p className="text-sm text-cyan-400 mt-1 uppercase tracking-wider font-semibold">
          Nicaragua en Movimiento
        </p>
      </div>

      <MapaOrquestador />
    </main>
  );
}