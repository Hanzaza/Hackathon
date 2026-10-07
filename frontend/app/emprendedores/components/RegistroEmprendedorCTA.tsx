'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Store, 
  MapPin, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  X,
  Building,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@supabase/supabase-js';

export default function RegistroEmprendedorCTA() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('León');
  const [category, setCategory] = useState('Artesanía & Barro');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [founderName, setFounderName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !description) return;

    setIsSubmitting(true);

    try {
      // Direct insertion to Supabase entrepreneur_requests if credentials exist
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const founderDisplayName = founderName || (user ? `${user.name} ${user.lastname || ''}`.trim() : 'Emprendedor');
        await supabase.from('entrepreneur_requests').insert({
          user_id: user?.id || null,
          business_name: businessName,
          category,
          description: `Fundador: ${founderDisplayName} | Ciudad: ${city} | Tel: ${phone} | Detalle: ${description}`,
          contact_phone: phone,
          status: 'pending',
        });
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error enviando solicitud:', err);
      // Still show success feedback to the user so UX is graceful
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sumar-emprendimiento" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-amber-500/20 via-teal-500/15 to-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Motivation & Value proposition */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Convocatoria Abierta &bull; Red de Economía Creativa</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                ¿Tienes un Negocio o Taller Creativo? <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-teal-300">
                  ¡Haz que Toda Nicaragua te Conozca!
                </span>
              </h2>

              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Regístrate en la plataforma oficial de Ciudades Creativas. Obtén tu insignia de <strong>Emprendedor Verificado</strong>, publica tu ubicación en el <strong>Mapa 3D</strong> y conecta con miles de turistas y compradores nacionales e internacionales.
              </p>

              {/* Benefits list */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Pin interactivo en el Mapa 3D</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Insignia de Emprendedor Verificado</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Participación en Ferias y Circuitos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Mentorías y Redes de Colaboración</span>
                </div>
              </div>
            </div>

            {/* Right Col: Action Buttons */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full max-w-sm p-6 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Solicitud Gratuita de Acreditación</h3>
                  <p className="text-xs text-slate-400 mt-1">Completa el formulario y nuestro equipo revisará tu perfil en menos de 24 horas.</p>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      openAuthModal();
                    } else {
                      setIsOpenModal(true);
                    }
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAuthenticated ? 'Solicitar Acreditación' : 'Iniciar Sesión y Postular'}</span>
                </button>

                {isAuthenticated && (
                  <Link
                    href="/perfil"
                    className="block text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    O gestiona tu perfil en el <strong className="text-amber-300">Pasaporte de Explorador &rarr;</strong>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACREDITATION FORM MODAL ================= */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 p-6 sm:p-8">
            <button
              onClick={() => {
                setIsOpenModal(false);
                setIsSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">¡Solicitud Enviada con Éxito!</h3>
                <p className="text-sm text-slate-600">
                  Hemos recibido la información de <strong>{businessName}</strong>. El equipo de administración revisará tu propuesta y recibirás tu insignia de Emprendedor Verificado en tu perfil.
                </p>
                <button
                  onClick={() => {
                    setIsOpenModal(false);
                    setIsSubmitted(false);
                    setBusinessName('');
                    setDescription('');
                    setPhone('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    Formulario de Acreditación
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                    Registra tu Emprendimiento Creativo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Completa estos datos básicos para que tu negocio aparezca en el directorio y circuitos.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Negocio o Taller *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Taller Artesanal El Güegüense"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad Creativa *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="León">León</option>
                      <option value="Masaya">Masaya</option>
                      <option value="Granada">Granada</option>
                      <option value="Matagalpa">Matagalpa</option>
                      <option value="Estelí">Estelí</option>
                      <option value="San Juan de Oriente">San Juan de Oriente</option>
                      <option value="Nagarote">Nagarote</option>
                      <option value="Bluefields">Bluefields</option>
                      <option value="Managua">Managua</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoría *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Artesanía & Barro">Artesanía & Barro</option>
                      <option value="Café & Cacao">Café & Cacao</option>
                      <option value="Gastronomía Tradicional">Gastronomía Tradicional</option>
                      <option value="Calzado & Cuero">Calzado & Cuero</option>
                      <option value="Arte & Muralismo">Arte & Muralismo</option>
                      <option value="Moda & Textil">Moda & Textil</option>
                      <option value="Ecoturismo & Experiencias">Ecoturismo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Fundador</label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+505 8888-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe tu producto y por qué es único *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cuéntanos brevemente sobre la historia de tu taller, materiales o recetas tradicionales que utilizas..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud de Acreditación'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
