import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AppProviders from "../src/components/providers/AppProviders";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const dynamic = 'force-dynamic';

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
      className={`${montserrat.variable} font-sans h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logos/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/Logo.png" />
      </head>
      <body className={`${montserrat.className} font-sans min-h-full flex flex-col bg-white text-slate-800`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}