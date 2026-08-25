
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

// Tipos para el contenido enriquecido
interface Attraction {
  name: string;
  desc: string;
}

interface AgendaItem {
  event: string;
  date: string;
}

async function getCiudadesData(): Promise<CityFeature[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'ciudades_limpias.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.features;
}

// ---- GENERACIÓN DE PÁGINAS ESTÁTICAS ----
export async function generateStaticParams() {
  const features = await getCiudadesData();
  const creativeCities = features.filter(
    city => city.properties.tipo === 'Creativa' && city.properties.nombre.toLowerCase() !== 'león'
  );
  
  return creativeCities.map(city => ({
    slug: slugify(city.properties.nombre),
  }));
}

// ---- GENERACIÓN DE CONTENIDO ENRIQUECIDO ----
async function getCityContent(cityName: string) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const content = JSON.parse(fileContents);
  
  const cityKey = cityName.toLowerCase().replace(/ /g, '-');

  return content[cityKey] || {
    subtitle: "Una ciudad llena de encanto y creatividad.",
    description: `Descubre la magia y el encanto de ${cityName}, un epicentro de la cultura nicaragüense. Explora sus calles, conoce a su gente y déjate sorprender por su riqueza artística y natural.`,
    attractions: [],
    agenda: [],
    gastronomy: "La gastronomía local es rica y variada, un reflejo de su historia y su gente."
  };
}

// ---- COMPONENTE DE LA PÁGINA ----
export default async function CreativeCityPage({ params }: PageProps) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const features = await getCiudadesData();
  const city = features.find(c => slugify(c.properties.nombre) === slug);

  if (!city || city.properties.nombre.toLowerCase() === 'león') {
    notFound();
  }

  const { nombre } = city.properties;
  const cityContent = await getCityContent(nombre);

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pt-4 lg:pt-24 pb-32">
      
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
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900">
              {nombre}
            </h1>
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
            <div className="w-full h-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-slate-400 font-medium text-sm text-center px-4">
                [Imagen o ilustración destacada de {nombre}]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Adicional Detallado */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="border-t border-slate-200 pt-16">
          <h3 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Explorá {nombre}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* Principales Atractivos */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-2xl font-bold text-slate-800 mb-4">Principales Atractivos</h4>
              <ul className="space-y-4">
                {cityContent.attractions.map((item: Attraction) => (
                  <li key={item.name}>
                    <p className="font-semibold text-purple-800">{item.name}</p>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Agenda Cultural */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-2xl font-bold text-slate-800 mb-4">Agenda Cultural</h4>
              <ul className="space-y-4">
                {cityContent.agenda.map((item: AgendaItem) => (
                  <li key={item.event} className="flex items-center gap-4">
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">{item.date}</span>
                    <p className="text-slate-700">{item.event}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gastronomía */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-2xl font-bold text-slate-800 mb-4">Gastronomía</h4>
              <p className="text-slate-600">{cityContent.gastronomy}</p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
