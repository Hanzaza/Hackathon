import Image from 'next/image';
import Link from 'next/link';

export default function LeonCiudadCreativaPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans pb-20">
      
      {/* 1. HERO SECTION (Cabecera inmersiva) */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Fondo oscuro de fallback y superposición de gradiente */}
        <div className="absolute inset-0 bg-slate-900">
          {/* Aquí puedes poner una foto real de la Catedral de León */}
          {/* <Image src="/images/leon-hero.jpg" alt="Catedral de León" fill className="object-cover opacity-50" /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="text-purple-400 font-bold tracking-widest uppercase text-sm md:text-base mb-4 block">
            Red Nacional de Ciudades Creativas
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            León
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-light mb-8">
            Ciudad Creativa de la Literatura, la Arquitectura y la Revolución.
          </p>
          <Link 
            href="/#mapa-interactivo" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-full transition-all shadow-lg shadow-purple-900/50"
          >
            Ver en el Mapa Interactivo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      </section>

      {/* 2. INTRODUCCIÓN Y DATOS CLAVE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              La Cuna de Rubén Darío
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              León es un referente nacional e internacional de la creatividad literaria. Sus calles coloniales, su imponente Basílica Catedral patrimonio de la Humanidad y su vibrante vida universitaria impulsada por la UNAN-León, la convierten en un faro de cultura, arte y pensamiento.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Desde las coloridas alfombras de aserrín en Sutiaba hasta los murales que narran su historia, León respira arte en cada esquina.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="border-l-4 border-purple-700 pl-4">
                <p className="text-3xl font-extrabold text-slate-900">1524</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Fundación</p>
              </div>
              <div className="border-l-4 border-purple-700 pl-4">
                <p className="text-3xl font-extrabold text-slate-900">Lit.</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Categoría Principal</p>
              </div>
            </div>
          </div>
          
          {/* Collage de imágenes de León */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden bg-slate-100 shadow-2xl border border-slate-200 group">
            {/* <Image src="/images/leon-collage.jpg" alt="Cultura de León" fill className="object-cover group-hover:scale-105 transition-transform duration-700" /> */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-center px-6">
              Coloca aquí una foto de las alfombras de Sutiaba o la Catedral. <br/> src=stateless-mobility\public\logos\leon.png
            </div>
          </div>
        </div>
      </section>

      {/* 3. CIRCUITOS CREATIVOS */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Circuitos Creativos</h2>
            <p className="text-lg text-slate-600">
              Recorre las rutas diseñadas para conectar la historia, la gastronomía y el talento local de los artesanos leoneses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CircuitoCard 
              titulo="Ruta Dariana" 
              descripcion="Un recorrido por las casas, museos y calles que inspiraron al Príncipe de las Letras Castellanas."
              icono="✒️"
            />
            <CircuitoCard 
              titulo="Circuito Sutiaba" 
              descripcion="Descubre las raíces indígenas, el arte de las alfombras pasionarias y la rica tradición oral."
              icono="🎭"
            />
            <CircuitoCard 
              titulo="Ruta de Templos y Leyendas" 
              descripcion="Arquitectura barroca y neoclásica entrelazada con los mitos y leyendas más emblemáticos de la ciudad."
              icono="⛪"
            />
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">¿Listo para vivir la experiencia?</h2>
        <p className="text-lg text-slate-600 mb-8">
          Abre el mapa interactivo, selecciona los puntos de interés del municipio y planea tu recorrido por la Ciudad Creativa.
        </p>
        <Link 
          href="/#mapa-interactivo" 
          className="px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-full transition-all shadow-xl"
        >
          Explorar León en 3D
        </Link>
      </section>

    </main>
  );
}

// --- COMPONENTE AUXILIAR PARA LOS CIRCUITOS ---
function CircuitoCard({ titulo, descripcion, icono }: { titulo: string, descripcion: string, icono: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl hover:border-purple-200 transition-all hover:-translate-y-1">
      <div className="text-4xl mb-4 bg-purple-50 w-16 h-16 flex items-center justify-center rounded-2xl">
        {icono}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{titulo}</h3>
      <p className="text-slate-600 leading-relaxed">
        {descripcion}
      </p>
    </div>
  );
}