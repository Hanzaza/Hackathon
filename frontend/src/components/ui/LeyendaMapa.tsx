// src/components/ui/LeyendaMapa.tsx

import Link from 'next/link';

// Definimos los datos de las ciudades creativas directamente en el componente
const ciudadesCreativas = [
  { nombre: 'Bluefields', color: '#3b82f6', slug: 'bluefields' },
  { nombre: 'Masaya', color: '#10b981', slug: 'masaya' },
  { nombre: 'San Juan de Oriente', color: '#f97316', slug: 'san-juan-de-oriente' },
  { nombre: 'León', color: '#ef4444', slug: 'leon' },
  { nombre: 'Granada', color: '#8b5cf6', slug: 'granada' },
  { nombre: 'Estelí', color: '#d946ef', slug: 'esteli' },
  { nombre: 'Juigalpa', color: '#f59e0b', slug: 'juigalpa' },
  { nombre: 'Managua', color: '#6366f1', slug: 'managua' },
  { nombre: 'Matagalpa', color: '#14b8a6', slug: 'matagalpa' },
  { nombre: 'Nagarote', color: '#84cc16', slug: 'nagarote' },
];

export default function LeyendaMapa() {
  return (
    <aside className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg w-full md:w-80">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Ciudades Creativas</h3>
      <ul className="space-y-3">
        {ciudadesCreativas.map((ciudad) => (
          <li key={ciudad.slug} className="flex items-center gap-3">
            <span 
              className="h-5 w-5 rounded-full" 
              style={{ backgroundColor: ciudad.color }}
            ></span>
            <span className="font-medium text-slate-600">{ciudad.nombre}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-3">
          ¿Querés una vista más detallada?
        </p>
        <Link href="/ciudades-creativas" className="inline-block w-full text-center px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg transition-all">
          Explorá el Mapa Inmersivo
        </Link>
      </div>
    </aside>
  );
}
