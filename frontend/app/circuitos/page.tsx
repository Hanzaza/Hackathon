"use client";

import { useRouter } from 'next/navigation';
import NicaraguaSVG from '../../src/components/map/NicaraguaSVG';

const departamentoToSlug: Record<string, string> = {
  "NILE": "leon",
  "NIES": "esteli",
  "NIAS": "bluefields",
  "NIRI": "rivas",
  "NIMS": "masaya",
  "NIGR": "granada",
  "NIMN": "managua",
  "NIMT": "matagalpa",
  "NICO": "juigalpa", 
};

export default function CircuitosPage() {
  const router = useRouter();

  const handleSelectDepartamento = (idDepartamento: string) => {
    const slug = departamentoToSlug[idDepartamento];
    if (slug) {
      router.push(`/ciudades-creativas/${slug}`);
    } else {
      console.warn(`No slug found for department: ${idDepartamento}`);
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-slate-800 font-sans pt-4 lg:pt-28 pb-32 flex flex-col items-center justify-center">
      <NicaraguaSVG onSelect={handleSelectDepartamento} />
    </main>
  );
}