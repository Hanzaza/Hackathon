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
    <div className="relative w-full h-[calc(100dvh-5.5rem)] lg:h-[100dvh] pt-0 lg:pt-20 overflow-hidden bg-slate-950 flex items-center justify-center">
      <div className="w-full h-full p-1 sm:p-3 lg:p-4 flex items-center justify-center">
        <MapaOrquestador />
      </div>
    </div>
  );
}