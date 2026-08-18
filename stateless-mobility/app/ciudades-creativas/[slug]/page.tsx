
import Link from 'next/link';
import { notFound } from 'next/navigation';
import path from 'path';
import { promises as fs } from 'fs';

// Helper para normalizar nombres para URLs
const slugify = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const deslugify = (slug: string) => slug.replace(/-/g, ' ');

// Tipos para los props
interface PageProps {
  params: {
    slug: string;
  };
}

// Data type for the city features
interface CityFeature {
  properties: {
    nombre: string;
    tipo: string;
    descripcion?: string;
  };
}

async function getCiudadesData(): Promise<CityFeature[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'ciudades_limpias.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.features;
}

// ---- GENERACIÓN DE PÁGINAS ESTÁTICAS ----
// Le dice a Next.js qué páginas debe pre-construir
export async function generateStaticParams() {
  const features = await getCiudadesData();
  const creativeCities = features.filter(city => city.properties.tipo === 'Creativa');
  
  return creativeCities.map(city => ({
    slug: slugify(city.properties.nombre),
  }));
}

// ---- COMPONENTE DE LA PÁGINA ----
export default async function CreativeCityPage({ params }: PageProps) {
  const { slug } = await params;
  const cityName = deslugify(slug);

  const features = await getCiudadesData();

  // Buscamos la ciudad por su nombre (comparando sin distinción de mayúsculas)
  const city = features.find(c => c.properties.nombre.toLowerCase() === cityName.toLowerCase());

  // Si no se encuentra la ciudad, mostramos la página 404
  if (!city) {
    notFound();
  }

  const { nombre, descripcion } = city.properties;

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-24">
      
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
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-900 text-white text-xs font-black uppercase tracking-widest rounded-sm mb-4 transform -skew-x-12">
              Ciudad Creativa
            </span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900">
              {nombre}
            </h1>
            <h2 className="text-xl font-bold text-slate-700 mt-2">
              {/* Podrías añadir un subtítulo específico si lo tuvieras en tu JSON */}
              Cuna de Arte y Tradición
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-lg text-lg">
            {descripcion || `Descubre la magia y el encanto de ${nombre}, un epicentro de la cultura nicaragüense.`}
          </p>
        </div>
        <div className="flex-1 w-full flex justify-end">
          <div className="w-full max-w-md h-64 bg-slate-100 border border-slate-200 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-sm">
            <span className="text-slate-400 font-medium text-sm text-center px-4">
              [Imagen o ilustración destacada de {nombre}]
            </span>
          </div>
        </div>
      </section>

      {/* Contenido Adicional (simulado) */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-10">
            Explorá {nombre}
          </h3>
          <div className="text-center text-slate-500">
            <p>Contenido detallado sobre la ciudad, sus circuitos, agenda y más, iría en esta sección.</p>
            <p>Por ahora, esta es una página modelo generada dinámicamente.</p>
          </div>
        </div>
      </section>

    </main>
  );
}

