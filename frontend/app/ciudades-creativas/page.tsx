'use client'; 

import dynamic from 'next/dynamic';

const MapaOrquestador = dynamic(() => import('@/components/map/MapaContenedor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-slate-600 font-bold text-xs uppercase tracking-widest animate-pulse">
        Cargando Mapa Nacional...
      </span>
    </div>
  ),
});

export default function CiudadesCreativasPage() {
  return (
    <div className="relative w-full h-[calc(100dvh-5.5rem)] lg:h-[100dvh] pt-0 lg:pt-20 overflow-hidden bg-white flex items-center justify-center">
      <div className="w-full h-full p-1 sm:p-3 lg:p-4 flex items-center justify-center">
        <div className="w-full h-full rounded-[2.5rem] bg-white border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden relative backdrop-blur-xl">
          <MapaOrquestador />
        </div>
      </div>
    </div>
  );
}