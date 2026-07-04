"use client";

import { useState } from 'react';
import Image from 'next/image'; // Import Image component
import { Filter, X, CalendarDays } from "lucide-react";
import { EventCard, Evento } from './components/EventCard';
import { FilterChip } from './components/ui/FilterChip';

// Datos de prueba (Mocks) para la agenda.
const EVENTOS_AGENDA: Evento[] = [
    {
        id: 1,
        titulo: "Noche de Mitos y Leyendas",
        ciudad: "León",
        lugar: "Plaza Sutiaba",
        fecha: "15 Ago",
        hora: "19:00 - 22:00",
        categoria: "Tradición",
        imagen: "https://images.unsplash.com/photo-1542296332-2a44733e56a9?w=1920&h=600&fit=crop&auto=format",
        colorTag: "bg-purple-100 text-purple-800",
    },
    {
        id: 2,
        titulo: "Festival de la Marimba",
        ciudad: "Masaya",
        lugar: "Mercado de Artesanías",
        fecha: "22 Ago",
        hora: "16:00 - 20:00",
        categoria: "Música",
        imagen: "https://images.unsplash.com/photo-1533174000255-8324508d4b33?w=800&h=500&fit=crop",
        colorTag: "bg-pink-100 text-pink-800",
    },
    {
        id: 3,
        titulo: "Taller de Cerámica Viva",
        ciudad: "San Juan de Oriente",
        lugar: "Taller Escuela de Cerámica",
        fecha: "28 Ago",
        hora: "09:00 - 12:00",
        categoria: "Arte y Taller",
        imagen: "https://images.unsplash.com/photo-1610719875571-0618059ffbd2?w=800&h=500&fit=crop",
        colorTag: "bg-amber-100 text-amber-800",
    },
    {
        id: 4,
        titulo: "Feria Gastronómica Colonial",
        ciudad: "Granada",
        lugar: "Plaza de la Independencia",
        fecha: "05 Sep",
        hora: "11:00 - 18:00",
        categoria: "Gastronomía",
        imagen: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop",
        colorTag: "bg-orange-100 text-orange-800",
    },
    {
        id: 5,
        titulo: "Ruta del Muralismo Abierto",
        ciudad: "Estelí",
        lugar: "Centro Histórico",
        fecha: "12 Sep",
        hora: "14:00 - 17:00",
        categoria: "Arte Urbano",
        imagen: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=500&fit=crop",
        colorTag: "bg-emerald-100 text-emerald-800",
    },
    {
        id: 6,
        titulo: "Festival Palo de Mayo Vibes",
        ciudad: "Bluefields",
        lugar: "Parque Reyes",
        fecha: "30 Sep",
        hora: "15:00 - 23:00",
        categoria: "Danza y Cultura",
        imagen: "https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=800&h=500&fit=crop",
        colorTag: "bg-cyan-100 text-cyan-800",
    }
];

const CIUDADES_FILTRO = ["León", "Masaya", "Granada", "Estelí", "Bluefields", "San Juan de Oriente", "Managua", "Matagalpa", "Juigalpa", "Rivas"];

export default function AgendaPage() {
    const [eventos, setEventos] = useState<Evento[]>(EVENTOS_AGENDA);
    const [filtroActivo, setFiltroActivo] = useState<string>("Todos");

    const handleFilter = (filtro: string) => {
        setFiltroActivo(filtro);
        if (filtro === "Todos") {
            setEventos(EVENTOS_AGENDA);
        } else {
            const eventosFiltrados = EVENTOS_AGENDA.filter(evento => evento.ciudad === filtro);
            setEventos(eventosFiltrados);
        }
    };

    return (
        <main className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans">

            {/* --- 1. HERO BANNER DE LA AGENDA --- */}
            <section className="relative w-full h-[400px] lg:h-[500px] bg-gradient-to-r from-purple-800 to-indigo-800">
                <Image
                    src="/banners/agenda/agenda-banner.jpg"
                    alt="Eventos culturales vibrantes"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="opacity-30"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-t from-slate-900/70 to-transparent">
                    <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-bold uppercase tracking-[0.15em] rounded-full mb-6 border border-white/30">
                        Agenda Cultural
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl mb-4">
                        Descubre y Vive la Cultura
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-100 font-medium max-w-3xl drop-shadow-lg">
                        Explora una vibrante colección de eventos, festivales y actividades en tus Ciudades Creativas.
                    </p>
                </div>
            </section>

            {/* --- 2. FRANJA DE BÚSQUEDA Y FILTROS --- */}
            <section className="w-full bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-16 z-20 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-grow items-center gap-3 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                        <FilterChip
                            label="Todos"
                            isActive={filtroActivo === "Todos"}
                            onClick={() => handleFilter("Todos")}
                        />
                        {CIUDADES_FILTRO.map(ciudad => (
                            <FilterChip
                                key={ciudad}
                                label={ciudad}
                                isActive={filtroActivo === ciudad}
                                onClick={() => handleFilter(ciudad)}
                            />
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-md w-full md:w-auto justify-center flex-shrink-0">
                        <Filter size={18} />
                        Más Filtros
                    </button>
                </div>
            </section>

            {/* --- 3. CUADRÍCULA DE EVENTOS --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {eventos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                        {eventos.map((evento) => (
                            <EventCard key={evento.id} evento={evento} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 flex flex-col items-center justify-center bg-white rounded-xl shadow-md border border-slate-200">
                        <CalendarDays size={48} className="text-purple-500 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-700 mb-3">
                            No hay eventos que coincidan con tu búsqueda.
                        </h2>
                        <p className="text-slate-500 max-w-md mb-8">
                            Parece que no encontramos eventos para esta selección. Prueba ajustando tus filtros o
                            explorando todas las actividades disponibles.
                        </p>
                        <button
                            onClick={() => handleFilter("Todos")}
                            className="mt-4 flex items-center mx-auto gap-2 px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-transform hover:scale-105 shadow-lg"
                        >
                            <X size={18} />
                            Ver todos los eventos
                        </button>
                    </div>
                )}

                {/* Botón de Cargar Más */}
                {filtroActivo === "Todos" && eventos.length > 0 && (
                    <div className="mt-16 text-center">
                        <button className="px-10 py-4 bg-white border-2 border-purple-600 text-purple-700 font-bold rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Cargar más eventos
                        </button>
                    </div>
                )}
            </section>

        </main>
    );
}