import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navigation from "../src/components/ui/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos actualizados para The Stateless
export const metadata: Metadata = {
  title: "The Stateless | Ciudades Creativas",
  description: "Plataforma inmersiva de movilidad, cultura e innovación territorial en Nicaragua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // Eliminada la clase "dark" para forzar el esquema de colores claro
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Actualizado a fondo blanco (bg-white) y texto oscuro (text-slate-800) */}
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        
        {/* Tu nueva barra de navegación global */}
        <Navigation />
        
        {/* flex-grow para que ocupe todo el espacio sobrante */}
        {/* pt-16 es el margen superior de 64px para compensar la altura del Navigation fijo */}
        <main className="flex-grow pt-16">
          {children}
        </main>
        
      </body>
    </html>
  );
}