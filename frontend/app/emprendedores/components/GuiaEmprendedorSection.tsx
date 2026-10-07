'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  BookOpen, 
  Download, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

const CHAPTERS = [
  {
    num: '01',
    title: 'La Ruta del Emprendedor en Nicaragua',
    desc: 'Pasos para concebir, validar y estructurar tu idea de negocio con base en las fortalezas de tu ciudad.',
  },
  {
    num: '02',
    title: 'Formalización & Registro de Marca',
    desc: 'Guía práctica para trámites en MIFIC, DGI, alcaldías y registro de marcas y propiedad intelectual.',
  },
  {
    num: '03',
    title: 'Costos Reales y Precios Justos',
    desc: 'Plantillas para calcular mano de obra, materia prima, empaque y margen de rentabilidad sostenible.',
  },
  {
    num: '04',
    title: 'Acceso a Ferias & Plataformas Nacionales',
    desc: 'Cómo postular a Nicaragua Emprende, Nicaragua Diseña y ferias departamentales de MEFCCA e INTUR.',
  },
  {
    num: '05',
    title: 'Marketing Digital y Redes Creativas',
    desc: 'Fotografía de producto con smartphone, WhatsApp Business y presencia en los Circuitos Creativos.',
  },
];

export default function GuiaEmprendedorSection() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <section id="guia-emprendedor" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-amber-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: PDF Cover Preview */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-64 sm:w-72 h-88 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-300 group">
                <Image
                  src="/emprendedores/guia-emprendedor-caratula.jpg"
                  alt="Guía Oficial del Emprendedor de Nicaragua"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-md">
                  Edición Oficial
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/emprendedores/Guia-del-Emprendedor-2021.pdf"
                  download="Guia-del-Emprendedor-Nicaragua.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Guía Completa (PDF)</span>
                </a>

                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver en Línea</span>
                </button>
              </div>
            </div>

            {/* Right Column: Chapters & Information */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Herramienta Gratuita para Creadores</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                La Guía del Emprendedor: <br />
                <span className="text-amber-600">Del Sueño a la Realidad en Nicaragua</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                Un manual paso a paso compilado por especialistas de la Red de Economía Creativa (MEFCCA, INATEC, MIFIC, INTUR e INIFOM) para acompañarte en cada fase de crecimiento de tu negocio.
              </p>

              {/* Chapters list */}
              <div className="mt-6 space-y-3">
                {CHAPTERS.map((ch) => (
                  <div
                    key={ch.num}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-amber-50/50 hover:border-amber-200 transition-all flex items-start gap-3.5"
                  >
                    <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                      {ch.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ch.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{ch.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Online PDF Viewer Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Guía del Emprendedor de Nicaragua</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/emprendedores/Guia-del-Emprendedor-2021.pdf"
                  download="Guia-del-Emprendedor-Nicaragua.pdf"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-400 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe for PDF */}
            <div className="flex-1 w-full h-full bg-slate-100">
              <iframe
                src="/emprendedores/Guia-del-Emprendedor-2021.pdf"
                title="Guía del Emprendedor 2021"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
