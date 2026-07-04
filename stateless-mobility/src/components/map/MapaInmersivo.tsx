'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

import TarjetaInfo, { InfraestructuraData } from '../ui/TarjetaInfo';
import * as turf from '@turf/turf';
import { Feature } from 'geojson';

// Departamentos catalogados con Ciudades Creativas
const CREATIVE_CITIES_DEPTS = ['León', 'Estelí', 'Costa Caribe Sur', 'Rivas', 'Masaya', 'Granada', 'Managua', 'Matagalpa', 'Chontales'];

export default function MapaInmersivo() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<InfraestructuraData | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [-85.5, 12.8],
      zoom: 6.5,
      maxBounds: [[-88.5, 10.5], [-82.5, 15.5]]
    });

    map.current.on('load', async () => {
      try {
        const [depsRes, citiesRes] = await Promise.all([
          fetch('/data/departamentos_limpios.json'),
          fetch('/data/ciudades_limpias.json')
        ]);

        if (!depsRes.ok || !citiesRes.ok) {
          console.error('MapaInmersivo: Failed to fetch data');
          return;
        }

        const depsData = await depsRes.json();
        const citiesData = await citiesRes.json();

        if (!map.current) return;

        map.current.addSource('departamentos-source', { type: 'geojson', data: depsData });
        map.current.addSource('ciudades-source', { type: 'geojson', data: citiesData });

        map.current.addLayer({
          id: 'departamentos-layer',
          type: 'fill',
          source: 'departamentos-source',
          filter: ['==', 'admin_level', '4'],
          paint: {
            'fill-color': [
              'case',
              ['in', ['get', 'name'], ['literal', CREATIVE_CITIES_DEPTS]],
              '#fffb00',
              '#0ea5e9'
            ],
            'fill-opacity': 0.4,
            'fill-outline-color': '#fff'
          }
        });

        map.current.addLayer({
          id: 'departamentos-border',
          type: 'line',
          source: 'departamentos-source',
          filter: ['==', 'admin_level', '4'],
          paint: { 'line-color': '#ffffff', 'line-width': 1.5, 'line-opacity': 0.8 }
        });

        map.current.addLayer({
          id: 'municipios-border',
          type: 'line',
          source: 'departamentos-source', // <--- Tomamos los polígonos de aquí
          filter: ['==', 'admin_level', '6'], // <--- Solo dibujamos las líneas de los municipios
          layout: { 'visibility': 'none' },
          paint: { 'line-color': '#ffffff', 'line-width': 1, 'line-opacity': 0.5 }
        });

        map.current.addLayer({
          id: 'ciudades-glow',
          type: 'circle',
          source: 'ciudades-source',
          layout: { 'visibility': 'none' },
          paint: { 'circle-radius': 14, 'circle-color': '#fffb00', 'circle-opacity': 0.3 }
        });

        map.current.addLayer({
          id: 'ciudades-layer',
          type: 'circle',
          source: 'ciudades-source',
          layout: { 'visibility': 'none' },
          paint: { 'circle-radius': 6, 'circle-color': '#FFD700', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
        });

        map.current.on('click', 'departamentos-layer', (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const deptoName = feature.properties?.name;
          if (!map.current) return;

          map.current.setLayoutProperty('municipios-border', 'visibility', 'visible');
          map.current.setLayoutProperty('ciudades-layer', 'visibility', 'visible');
          map.current.setLayoutProperty('ciudades-glow', 'visibility', 'visible');
          map.current.setFilter('municipios-border', ['==', 'departamento', deptoName]);
          map.current.setFilter('ciudades-layer', ['all', ['==', 'departamento', deptoName], ['==', 'tipo', 'Creativa']]);
          map.current.setFilter('ciudades-glow', ['all', ['==', 'departamento', deptoName], ['==', 'tipo', 'Creativa']]);

          const bbox = turf.bbox(feature as Feature);
          map.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 40, duration: 1200 });
        });

        map.current.on('click', 'ciudades-layer', (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          e.originalEvent.stopPropagation();
          setPuntoSeleccionado({
            name: feature.properties?.nombre || "Ciudad",
            description: feature.properties?.descripcion || "Ciudad de la Red de Ciudades Creativas",
            status: feature.properties?.status || "Activo",
            tipo: feature.properties?.tipo || "Creativa"
          });
        });

        map.current.on('click', (e) => {
            if (!map.current) return;
            const features = map.current.queryRenderedFeatures(e.point, { layers: ['departamentos-layer'] });
            if (features.length === 0) {
              map.current.flyTo({ center: [-85.5, 12.8], zoom: 6.5 });
              map.current.setLayoutProperty('municipios-border', 'visibility', 'none');
              map.current.setLayoutProperty('ciudades-layer', 'visibility', 'none');
              map.current.setLayoutProperty('ciudades-glow', 'visibility', 'none');
              setPuntoSeleccionado(null);
            }
        });
      } catch (error) {
        console.error('MapaInmersivo: Error during map setup', error);
      }
    });

    return () => {
        map.current?.remove();
        map.current = null;
    }
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-screen min-h-[400px] rounded-xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
      <div
        ref={mapContainer}
        className="absolute top-0 left-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute z-10 w-full p-4 md:w-96 bottom-0 md:bottom-auto md:top-6 md:left-6 pointer-events-none">
        <div className="pointer-events-auto">
          {puntoSeleccionado && (
            <TarjetaInfo data={puntoSeleccionado} onClose={() => setPuntoSeleccionado(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
