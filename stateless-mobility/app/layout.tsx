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
  icons: {
    icon: [
      { url: "/logos/Logo.png" },
      { url: "/logos/Logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logos/Logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/logos/Logo.png"],
    apple: [
      { url: "/logos/Logo.png" },
      { url: "/logos/Logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      <head>
        <link rel="icon" href="/logos/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/Logo.png" />
      </head>
      {/* Actualizado a fondo blanco (bg-white) y texto oscuro (text-slate-800) */}
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        
        {/* Tu nueva barra de navegación global */}
        <Navigation />
        
        {/* flex-grow para que ocupe todo el espacio sobrante sin margen superior artificial */}
        <main className="flex-grow pb-16 lg:pb-0">
          {children}
        </main>
        
      </body>
    </html>
  );
}