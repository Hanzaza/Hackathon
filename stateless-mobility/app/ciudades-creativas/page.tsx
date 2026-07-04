import ClientMapaInmersivo from './components/ClientMapaInmersivo';

export default function CiudadesCreativasPage() {
  return (
    // h-[calc(100vh-64px)] asegura que el mapa ocupe toda la pantalla restante
    // sin contar el espacio de la barra de navegación (64px)
    <main className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Título contextual para esta sección */}
      <div className="absolute top-6 left-6 z-10 p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Ciudades Creativas</h1>
        <p className="text-sm text-cyan-400 mt-1 uppercase tracking-wider font-semibold">
          Nicaragua en Movimiento
        </p>
      </div>
      

      {/* Aquí cargamos el componente del mapa */}
      <ClientMapaInmersivo />
      
    </main>
  );
}
