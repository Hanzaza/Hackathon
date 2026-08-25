'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface CityItem {
  name: string;
  slug: string;
  imageSrc: string;
}

const CITIES: CityItem[] = [
  { name: 'Bluefields', slug: 'bluefields', imageSrc: '/logos/logo1.png' },
  { name: 'Masaya', slug: 'masaya', imageSrc: '/logos/logo2.png' },
  { name: 'San Juan de Oriente', slug: 'san-juan-de-oriente', imageSrc: '/logos/logo3.png' },
  { name: 'León', slug: 'leon', imageSrc: '/logos/logo4.png' },
  { name: 'Granada', slug: 'granada', imageSrc: '/logos/logo5.png' },
  { name: 'Estelí', slug: 'esteli', imageSrc: '/logos/logo6.png' },
  { name: 'Juigalpa', slug: 'juigalpa', imageSrc: '/logos/logo7.png' },
  { name: 'Managua', slug: 'managua', imageSrc: '/logos/logo8.png' },
  { name: 'Matagalpa', slug: 'matagalpa', imageSrc: '/logos/logo9.png' },
  { name: 'Nagarote', slug: 'nagarote', imageSrc: '/logos/logo10.png' },
];

// Offsets progresivos para el efecto de apilamiento en scroll móvil
const STICKY_OFFSETS = [
  'top-20',
  'top-[5.5rem]',
  'top-24',
  'top-[6.5rem]',
  'top-28',
  'top-[7.5rem]',
  'top-32',
  'top-[8.5rem]',
  'top-36',
  'top-[9.5rem]',
];

export default function CityMobileStacking() {
  return (
    <div className="w-full sm:hidden">
      {/* Contenedor de tarjetas apilables completas */}
      <section className="relative w-full space-y-12 pb-16">
        {CITIES.map((city, index) => {
          const stickyClass = STICKY_OFFSETS[index % STICKY_OFFSETS.length];
          return (
            <div
              key={city.slug}
              className={`sticky ${stickyClass} transition-all duration-300 w-full`}
              style={{ zIndex: index + 1 }}
            >
              <Link
                href={`/ciudades-creativas/${city.slug}`}
                className="group block relative mx-auto w-full max-w-sm aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white border border-slate-200/80 shadow-[0_-8px_24px_rgba(0,0,0,0.12),0_16px_32px_rgba(0,0,0,0.18)] active:scale-[0.98] transition-transform duration-200"
              >
                {/* Imagen completa de la ciudad */}
                <Image
                  src={city.imageSrc}
                  alt={`Ciudad creativa ${city.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Sutil indicador con nombre de la ciudad en la parte inferior */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-purple-200 uppercase">
                      Ciudad Creativa
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight drop-shadow-sm">
                      {city.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-white/80 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {String(index + 1).padStart(2, '0')}/10
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </section>
    </div>
  );
}
