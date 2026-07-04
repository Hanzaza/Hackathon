'use client';

import dynamic from 'next/dynamic';

const MapaInmersivo = dynamic(() => import('@/components/map/MapaInmersivo'), {
  ssr: false,
});

export default function ClientMapaInmersivo() {
  return <MapaInmersivo />;
}
