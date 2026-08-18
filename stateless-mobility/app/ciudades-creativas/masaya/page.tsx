import Link from 'next/link';

export default function MasayaPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-8 pb-4">
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Link href="/ciudades-creativas" className="hover:text-purple-800 transition-colors">
            Ciudades Creativas
          </Link>
          <span>›</span>
          <span className="text-slate-900 font-bold">Masaya</span>
        </div>
      </div>

      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <span className="inline-block px-3 py-1 bg-purple-900 text-white text-xs font-black uppercase tracking-widest rounded-sm mb-4 transform -skew-x-12">
            Ciudad Creativa
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Masaya</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Masaya destaca por su energía cultural, su artesanía y la mezcla entre tradición y modernidad.
          </p>
        </div>
      </section>
    </main>
  );
}
