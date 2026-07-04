"use client";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import { MapPin, Clock, ArrowRight } from "lucide-react";

export type Evento = {
    id: number;
    titulo: string;
    ciudad: string;
    lugar: string;
    fecha: string;
    hora: string;
    categoria: string;
    imagen: string;
    colorTag: string;
};

interface EventCardProps {
    evento: Evento;
}

export const EventCard: React.FC<EventCardProps> = ({ evento }) => {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">

            <div className="relative h-56 w-full overflow-hidden">
                <Image
                    src={evento.imagen}
                    alt={evento.titulo}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-center shadow-lg">
                    <span className="block text-xl font-black text-slate-900 leading-none">
                        {evento.fecha.split(' ')[0]}
                    </span>
                    <span className="block text-xs font-bold text-purple-700 uppercase mt-1">
                        {evento.fecha.split(' ')[1]}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${evento.colorTag}`}>
                        {evento.categoria}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {evento.titulo}
                </h3>

                <div className="space-y-3 mb-6 mt-auto">
                    <div className="flex items-start gap-3 text-slate-600">
                        <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-slate-800">{evento.ciudad}</p>
                            <p className="text-sm">{evento.lugar}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                        <Clock size={18} className="text-slate-400 shrink-0" />
                        <p className="text-sm font-medium">{evento.hora}</p>
                    </div>
                </div>

                <Link
                    href={`/agenda/${evento.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl group-hover:bg-purple-900 group-hover:text-white transition-colors border border-slate-100 group-hover:border-purple-900"
                >
                    Ver detalles
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
