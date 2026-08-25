"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';

const InteractiveSections = () => {
  const [activeTab, setActiveTab] = useState('arquitectura');
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 300;
    }
  };

  const cathedral = {
    name: 'Catedral de la Asunción',
    history: 'La Catedral de la Asunción de María de León, es una catedral de construcción barroca colonial ubicada en la ciudad de León, departamento de León, Nicaragua. Su construcción duró casi 100 años, entre 1747 y 1840. Es la catedral más grande de Centroamérica y una de las más conocidas en el continente americano por su distintiva arquitectura y su especial importancia cultural.',
    image: '/banners/circuitos/leon/catedral.png',
  };

  return (
    <div className="w-full">
      <div className="flex justify-center border-b border-slate-200">
        <button
          className={`px-6 py-3 font-semibold ${activeTab === 'arquitectura' ? 'text-purple-800 border-b-2 border-purple-800' : 'text-slate-600'}`}
          onClick={() => setActiveTab('arquitectura')}
        >
          Arquitectura
        </button>
        <button
          className={`px-6 py-3 font-semibold ${activeTab === 'cultura' ? 'text-purple-800 border-b-2 border-purple-800' : 'text-slate-600'}`}
          onClick={() => setActiveTab('cultura')}
        >
          Cultura y Tradición
        </button>
        <button
          className={`px-6 py-3 font-semibold ${activeTab === 'gastronomia' ? 'text-purple-800 border-b-2 border-purple-800' : 'text-slate-600'}`}
          onClick={() => setActiveTab('gastronomia')}
        >
          Gastronomía
        </button>
      </div>
      <div className="py-8">
        {activeTab === 'arquitectura' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-6">{cathedral.name}</h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
              <div className="relative w-full h-64 sm:h-80 lg:h-96">
                <Image
                  src={cathedral.image}
                  alt={cathedral.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="p-4 md:p-8">
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{cathedral.history}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'cultura' && (
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-8">Categorías de Cultura y Tradición en León</h3>
            <div className="relative w-full overflow-hidden">
              <div ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 px-4 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                {[
                  { name: 'Carnaval Desfile', img: '/banners/circuitos/leon/carnaval_desfile.png' },
                  { name: 'Gigantona', img: '/banners/circuitos/leon/gigantona.png' },
                  { name: 'Alfombras', img: '/banners/circuitos/leon/alfombras.png' },
                  { name: 'Artesanias', img: '/banners/circuitos/leon/artesanias.png' },
                  { name: 'Fiestas decembrinas', img: '/banners/circuitos/leon/cultura_tradicion.png' },
                  { name: 'Museos y Galerias', img: null },
                  { name: 'Musica y Danza', img: null },
                ].map((cat, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-5/6 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200"
                  >
                    <div className="relative w-full h-80 bg-slate-100 flex items-center justify-center">
                      {cat.img ? (
                        <Image
                          src={cat.img}
                          alt={cat.name}
                          width={256}
                          height={320}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="text-slate-500 p-4 text-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M5 11h14" />
                          </svg>
                          <span className="font-semibold text-sm">{cat.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-slate-800 font-bold text-center text-base uppercase tracking-wider">{cat.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={scrollLeft} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={scrollRight} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {activeTab === 'gastronomia' && (
          <div>
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-4">Gastronomía</h3>
            <p className="text-slate-600 text-center">
              Aquí se mostrará información sobre la gastronomía de León. 
              Por el momento, este es un texto de ejemplo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveSections;