'use client';

import { motion, AnimatePresence } from 'framer-motion';

// ¡IMPORTANTE! El 'export' aquí permite que otros archivos lo importen
export interface InfraestructuraData {
  name: string;
  description: string;
  tipo: string;
  status: string;
}

interface TarjetaProps {
  data: InfraestructuraData;
  onClose: () => void;
}

export default function TarjetaInfo({ data, onClose }: TarjetaProps) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border border-emerald-500/30 p-5 rounded-t-2xl shadow-2xl md:relative md:rounded-2xl md:w-80"
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-white">{data.name}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              ✕
            </button>
          </div>
          
          <p className="text-sm text-emerald-400 font-medium mb-4">
            {data.tipo} • {data.status}
          </p>

          <div className="space-y-3 text-sm text-gray-300 bg-black/40 p-3 rounded-xl border border-gray-800">
            <div className="flex justify-between">
              <span>Nivel de Congestión:</span> 
              <span className="font-mono text-amber-400">Moderado</span>
            </div>
            <div className="flex justify-between">
              <span>Detección (Visión Art.):</span> 
              <span className="font-mono text-white">14 Vehículos</span>
            </div>
            <div className="flex justify-between">
              <span>Ciclo de luz actual:</span> 
              <span className="font-mono text-emerald-400">Verde (45s)</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}