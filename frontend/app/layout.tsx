import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navigation from "../src/components/ui/Navigation";
import SplashScreen from "../src/components/ui/SplashScreen";
import AuthModal from "../src/components/auth/AuthModal";
import { AuthProvider } from "../src/context/AuthContext";
import { UIProvider } from "../src/context/UIContext";

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
  title: "Roots | Ciudades Creativas de Nicaragua",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logos/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/Logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        <AuthProvider>
          <UIProvider>
            {/* Pantalla de carga inicial estilo Splash con Logo grande centrado */}
            <SplashScreen />

            {/* Barra de navegación global */}
            <Navigation />

            {/* Modal / Card interactivo de Login y Registro */}
            <AuthModal />
            
            {/* Contenido principal */}
            <main className="flex-grow">
              {children}
            </main>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}