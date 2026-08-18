'use client';

import Link from 'next/link';
import { Award, BookOpen, CalendarDays, Lightbulb, Sparkles, Users, Zap } from 'lucide-react';

const MANUALES = [
  {
    titulo: 'Cómo definir tu propuesta de valor',
    descripcion: 'Aprendé a identificar con claridad qué problema resolvés y por qué tu idea es única.',
    color: 'bg-violet-500/10 border-violet-500 text-violet-200',
  },
  {
    titulo: 'Finanzas claras para tu emprendimiento',
    descripcion: 'Controlá costos, precios y flujo de caja con pasos sencillos y prácticos.',
    color: 'bg-emerald-500/10 border-emerald-500 text-emerald-200',
  },
  {
    titulo: 'Marketing digital para la comunidad',
    descripcion: 'Conectá con clientes locales y visitantes usando herramientas accesibles.',
    color: 'bg-sky-500/10 border-sky-500 text-sky-200',
  },
];

const EVENTOS_EMPRENDEDORES = [
  {
    nombre: 'Mercado Creativo en Masaya',
    fecha: '18 Agosto',
    ubicacion: 'Plaza de la Cultura',
    descripcion: 'Una jornada para mostrar tus productos, conectar con clientes y aprender de otros emprendedores.',
  },
  {
    nombre: 'Feria de Innovación en León',
    fecha: '02 Septiembre',
    ubicacion: 'Centro Cultural Sutiaba',
    descripcion: 'Exposición, charlas breves y networking para startups culturales y creativas.',
  },
  {
    nombre: 'Rueda de negocios Managua',
    fecha: '14 Septiembre',
    ubicacion: 'Casa de los Pueblos',
    descripcion: 'Enlace entre emprendedores, compradores y aliados de la región.',
  },
];

const TALLERES = [
  {
    titulo: 'Marca personal para tu emprendimiento',
    horario: '11:00 - 13:00',
    id: 'workshop-1',
  },
  {
    titulo: 'Ventas con storytelling',
    horario: '15:00 - 17:00',
    id: 'workshop-2',
  },
  {
    titulo: 'Fotografía de producto con celular',
    horario: '09:00 - 11:00',
    id: 'workshop-3',
  },
];

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      <section className="relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-purple-700">
                <Sparkles size={16} /> Emprendedores
              </span>
              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Construí tu emprendimiento con recursos, talleres y comunidad.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                En esta página encontrarás manuales prácticos, eventos de interés, talleres en vivo y herramientas para que tu idea crezca con impacto local.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  href="#manuales"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-purple-800 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-purple-700"
                >
                  Ver manuales
                </Link>
                <Link
                  href="#eventos"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-800 hover:text-purple-800"
                >
                  Próximos eventos
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-6 border border-slate-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-700">
                  <Award size={32} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Impulso para emprender</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">+120 herramientas gratuitas</p>
                </div>
              </div>

              <div className="mt-8 grid gap-5">
                <div className="rounded-3xl border border-slate-100 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-600">Resultados recientes</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">15 emprendimientos apoyados</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                      Actualizado 2026
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-white p-5">
                  <p className="text-sm text-slate-600">Informes de comunidad</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">Guías + casos de éxito</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="manuales" className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-purple-700 font-semibold">Manuales prácticos</p>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Todo lo que necesitás para lanzar y escalar tu negocio.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Accedé a guías paso a paso diseñadas específicamente para emprendedores culturales y creativos que quieren transformar una idea en un proyecto sostenible.
            </p>
          </div>

          <div className="grid gap-4">
            {MANUALES.map((manual) => (
              <article key={manual.titulo} className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-purple-200">
                <div className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold ${manual.color}`}>
                  <BookOpen size={18} />
                  Guía esencial
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">{manual.titulo}</h3>
                <p className="mt-3 text-slate-600 leading-7">{manual.descripcion}</p>
                <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900">
                  Leer completo <Zap size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="eventos" className="border-t border-slate-100 bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-purple-700 font-semibold">Eventos de interés</p>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                Conectate con actividades que impulsan tu crecimiento.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Participá en ferias, ruedas de negocios y exhibiciones donde podés potenciar tu red, obtener clientes y aprender mejores prácticas.
              </p>
            </div>

            <div className="space-y-5">
              {EVENTOS_EMPRENDEDORES.map((evento) => (
                <div key={evento.nombre} className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-700">{evento.fecha}</p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-900">{evento.nombre}</h3>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {evento.ubicacion}
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600 leading-7">{evento.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="talleres" className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-purple-700 font-semibold">Talleres destacados</p>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Capacitación práctica para potenciar tu negocio.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Aprendé herramientas aplicables desde el primer día: marca, ventas, fotografía y comunicación para emprendedores.
            </p>
          </div>

          <div className="space-y-5">
            {TALLERES.map((taller) => (
              <article key={taller.id} className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{taller.titulo}</h3>
                    <p className="mt-2 text-sm text-slate-600">{taller.horario}</p>
                  </div>
                  <span className="rounded-full bg-purple-50 px-4 py-2 text-sm text-purple-700">Online</span>
                </div>
                <p className="mt-4 text-slate-600 leading-7">
                  Un taller intensivo diseñado para emprendedores que quieren aplicar nuevas habilidades al instante.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-purple-700 font-semibold">Recursos adicionales</p>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                Accedé a la comunidad, programas de apoyo y espacios de aprendizaje.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Sumate a una red de emprendedores donde podés intercambiar experiencias, obtener asesorías y encontrar aliados estratégicos.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3 text-purple-700">
                  <Users size={24} />
                  <p className="font-semibold uppercase tracking-[0.24em] text-sm">Comunidad</p>
                </div>
                <p className="mt-4 text-slate-600 leading-7">
                  Conectate con emprendedores de todo el país y encontrá mentors, aliados y clientes potenciales.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-3 text-purple-700">
                  <Lightbulb size={24} />
                  <p className="font-semibold uppercase tracking-[0.24em] text-sm">Inspiración</p>
                </div>
                <p className="mt-4 text-slate-600 leading-7">
                  Conocé historias reales de emprendedores que transformaron su talento en proyectos sostenibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-purple-700 font-semibold">¿Listo para emprender?</p>
                <h2 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                  Sumate a nuestro programa de emprendedores y empezá hoy.
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                  Recibí contenido exclusivo, acceso a eventos y un acompañamiento paso a paso para potenciar tu proyecto.
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-100 bg-white p-6">
                  <p className="text-sm text-slate-600">Newsletter semanal</p>
                  <p className="mt-2 text-slate-900 font-semibold">Novedades, talleres y convocatorias.</p>
                </div>
                <button className="w-full rounded-full bg-purple-700 px-6 py-4 text-base font-semibold text-white shadow transition hover:bg-purple-800">
                  Suscribirme ahora
                </button>
                <Link href="#manuales" className="inline-flex w-full items-center justify-center rounded-full border border-purple-700 px-6 py-4 text-base font-semibold text-purple-700 transition hover:bg-purple-50">
                  Explorar manuales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
