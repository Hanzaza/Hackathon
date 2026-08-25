import Link from 'next/link';
import Image from 'next/image';
import InteractiveSections from './components/InteractiveSections';

// Hardcoded content for León
const cityContent = {
  subtitle: "Corazón intelectual y revolucionario de Nicaragua.",
  description: "León es un centro de cultura, arte y política. Hogar de la universidad más antigua del país y de la imponente Catedral de la Asunción, patrimonio de la humanidad. Sus calles vibran con la energía de los estudiantes, los murales revolucionarios y la poesía de Rubén Darío.",
};

const nombre = 'León';

// ---- COMPONENTE DE LA PÁGINA ----
export default function LeonCreativeCityPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pt-4 lg:pt-24">
      
      {/* Miga de Pan (Breadcrumb) */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-8 pb-4">
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Link href="/ciudades-creativas" className="hover:text-purple-800 transition-colors">
            Ciudades Creativas
          </Link>
          <span>›</span>
          <span className="text-slate-900 font-bold">{nombre}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row items-start gap-12">
        <div className="flex-1 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-900 text-white text-xs font-black uppercase tracking-widest rounded-sm mb-4 transform -skew-x-12">
              Ciudad Creativa
            </span>
            <Image
              src="/logos/leon.png"
              alt="Logo de León"
              width={200}
              height={100}
              className="mx-auto md:mx-0 mb-4"
            />
            <h2 className="text-xl font-bold text-slate-700 mt-2">
              {cityContent.subtitle}
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-lg text-lg">
            {cityContent.description}
          </p>
        </div>
        <div className="flex-1 w-full flex justify-end">
          <div className="w-full max-w-md h-80 relative overflow-hidden rounded-3xl shadow-sm">
            <Image
              src="/banners/circuitos/leon/principal.png"
              alt="Imagen destacada de León"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Contenido Adicional Detallado */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <InteractiveSections />
      </section>

      {/* Footer Banner para León */}
      <section className="mt-16 max-w-full overflow-hidden">
        <div className="relative w-full h-28 md:h-48">
          <Image
            src="/banners/circuitos/leon/footer_banner.png"
            alt="Circuito de León Banner"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}
