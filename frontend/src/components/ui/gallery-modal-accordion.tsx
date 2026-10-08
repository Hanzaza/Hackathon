// @ts-nocheck
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export interface GalleryItem {
  id: number | string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  slug?: string;
  logoSrc?: string;
}

export const itemsArr: GalleryItem[] = [
  {
    id: 1,
    url: "https://cdn.21st.dev/assets/mirror/61/61fba7967229af5763933d0010bb8898322f7caf4ddcec1fdc49631accdf6e8b.jpg",
    title: "Misty Mountain Majesty",
    description:
      "A breathtaking view of misty mountains shrouded in clouds, creating an ethereal landscape.",
    tags: ["Misty", "Mountains", "Clouds", "Ethereal", "Landscape"],
  },
  {
    id: 2,
    url: "https://cdn.21st.dev/assets/mirror/a0/a0347946f1279a5e7a11a9a2405813da15fc66c86c629096ce2f26fb12b3ba3c.jpg",
    title: "Winter Wonderland",
    description:
      "A serene winter scene with snow-covered trees and mountains, showcasing nature's pristine beauty.",
    tags: ["Winter", "Snow", "Trees", "Mountains", "Serene"],
  },
  {
    id: 3,
    url: "https://cdn.21st.dev/assets/mirror/7d/7d50d54afe86e8a3f5125ed1c1b2620b3908f8292d50929a5cbb4b47eb14ed1e.jpg",
    title: "Autumn Mountain Retreat",
    description:
      "A cozy cabin nestled in the mountains, surrounded by the vibrant colors of autumn foliage.",
    tags: ["Autumn", "Cabin", "Mountains", "Foliage", "Cozy"],
  },
  {
    id: 4,
    url: "https://cdn.21st.dev/assets/mirror/be/bec6215be6cd082c943700a58fd0b746c4bc609fffa1ef29aebdf541fdaa09e0.jpg",
    title: "Tranquil Lake Reflection",
    description:
      "A calm mountain lake perfectly reflecting the surrounding peaks and sky, creating a mirror-like surface.",
    tags: ["Lake", "Reflection", "Mountains", "Tranquil", "Mirror"],
  },
  {
    id: 5,
    url: "https://cdn.21st.dev/assets/mirror/61/61fba7967229af5763933d0010bb8898322f7caf4ddcec1fdc49631accdf6e8b.jpg",
    title: "Misty Mountain Peaks",
    description:
      "Majestic mountain peaks emerging from a sea of clouds, showcasing nature's grandeur.",
    tags: ["Misty", "Peaks", "Clouds", "Majestic", "Nature"],
  },
  {
    id: 6,
    url: "https://cdn.21st.dev/assets/mirror/c0/c05c68bbab0df750341e0ae3e45ca956271fe8be03e2edf123f9d9e27f34da9b.jpg",
    title: "Golden Hour Glow",
    description:
      "A stunning mountain landscape bathed in the warm light of the golden hour, highlighting every contour.",
    tags: ["Golden Hour", "Mountains", "Landscape", "Warm", "Scenic"],
  },
  {
    id: 7,
    url: "https://cdn.21st.dev/assets/mirror/e7/e7c75c01704af7934b2c19c8875aad5253a73ff3196152279d82f4228c0938d8.jpg",
    title: "Snowy Mountain Highway",
    description:
      "A winding road cutting through a snowy mountain landscape, inviting adventure and exploration.",
    tags: ["Snow", "Road", "Mountains", "Winter", "Adventure"],
  },
  {
    id: 8,
    url: "https://cdn.21st.dev/assets/mirror/1b/1b29107c1e2de6ee99816c6579659f4580c56da822fabfc510a0e24c714f1680.jpg",
    title: "Foggy Mountain Forest",
    description:
      "A mysterious and enchanting forest shrouded in fog, with mountains looming in the background.",
    tags: ["Fog", "Forest", "Mountains", "Mysterious", "Enchanting"],
  },
  {
    id: 9,
    url: "https://cdn.21st.dev/assets/mirror/62/6258a4502bcab2019b7968a8430d40388dca8095e260bd71214e0b58d1174755.jpg",
    title: "Sunset Mountain Silhouette",
    description:
      "A dramatic silhouette of mountain peaks against a vibrant sunset sky, creating a stunning contrast.",
    tags: ["Sunset", "Silhouette", "Mountains", "Dramatic", "Sky"],
  },
  {
    id: 10,
    url: "https://cdn.21st.dev/assets/mirror/d2/d27844e08ea18a79be6997dc69bc2c5413bb0d356d8a7f7e3048adf7469852d9.jpg",
    title: "Alpine Meadow Bliss",
    description:
      "A lush alpine meadow dotted with wildflowers, set against a backdrop of towering mountain peaks.",
    tags: ["Alpine", "Meadow", "Wildflowers", "Mountains", "Peaceful"],
  },
  {
    id: 11,
    url: "https://cdn.21st.dev/assets/mirror/e2/e230c01d8a7cd574141858578e59e1a5bc4900adfe3b76491fef7946b47f2719.jpg",
    title: "Mountain Lake Serenity",
    description:
      "A serene mountain lake surrounded by pine forests, reflecting the calm beauty of the wilderness.",
    tags: ["Lake", "Mountains", "Forest", "Reflection", "Serenity"],
  },
];

export const NICARAGUA_CITIES_GALLERY: GalleryItem[] = [
  {
    id: "bluefields",
    url: "/logos/logo1.png",
    title: "Bluefields",
    description: "Cuna de la danza, el Maypole y la riqueza multicultural caribeña con profunda identidad ancestral.",
    tags: ["Caribe Sur", "Maypole", "Multicultural", "Gastronomía"],
    slug: "bluefields",
    logoSrc: "/logos/bluefields.png"
  },
  {
    id: "masaya",
    url: "/logos/logo2.png",
    title: "Masaya",
    description: "Capital del folclore nacional, cuna de las artesanías milenarias, marimbas y arte popular.",
    tags: ["Folclore", "Hamacas", "Artesanías", "Marimba"],
    slug: "masaya",
    logoSrc: "/logos/masaya.png"
  },
  {
    id: "san-juan-de-oriente",
    url: "/logos/logo3.png",
    title: "San Juan de Oriente",
    description: "Santuario milenario del diseño precolombino, barro ancestral y la cerámica utilitaria y decorativa.",
    tags: ["Cerámica", "Barro", "Pueblos Blancos", "Precolombino"],
    slug: "san-juan-de-oriente",
    logoSrc: "/logos/san-juan-de-oriente.png"
  },
  {
    id: "leon",
    url: "/logos/logo4.png",
    title: "León",
    description: "Capital de la literatura, poesía dariana, imponente catedral colonial, muralismo y volcanes.",
    tags: ["Poesía", "Catedral", "Muralismo", "Tradición"],
    slug: "leon",
    logoSrc: "/logos/leon.png"
  },
  {
    id: "granada",
    url: "/logos/logo5.png",
    title: "Granada",
    description: "La Gran Sultana, joya colonial de Nicaragua a orillas del Gran Lago, cuna del diseño y arquitectura.",
    tags: ["Colonial", "Lago Cocibolca", "Isletas", "Diseño"],
    slug: "granada",
    logoSrc: "/logos/granada.png"
  },
  {
    id: "esteli",
    url: "/logos/logo6.png",
    title: "Estelí",
    description: "Diamante de las Segovias, capital del muralismo heroico, clima fresco, cuero y música norteña.",
    tags: ["Murales", "Las Segovias", "Guitarras", "Norteño"],
    slug: "esteli",
    logoSrc: "/logos/esteli.png"
  },
  {
    id: "juigalpa",
    url: "/logos/logo7.png",
    title: "Juigalpa",
    description: "Corazón ganadero de Chontales, cuna arqueológica con petroglifos milenarios y tradición taurina.",
    tags: ["Chontales", "Arqueología", "Montañas", "Ganadería"],
    slug: "juigalpa",
    logoSrc: "/logos/juigalpa.png"
  },
  {
    id: "managua",
    url: "/logos/logo8.png",
    title: "Managua",
    description: "Capital de la República, epicentro del arte contemporáneo, teatros, lagunas volcánicas y vida urbana.",
    tags: ["Capital", "Teatro", "Lagunas", "Contemporáneo"],
    slug: "managua",
    logoSrc: "/logos/managua.png"
  },
  {
    id: "matagalpa",
    url: "/logos/logo9.png",
    title: "Matagalpa",
    description: "Perla del Septentrión, cuna del café especial de altura, cascadas brumosas y memoria indígena.",
    tags: ["Café", "Montañas", "Septentrión", "Naturaleza"],
    slug: "matagalpa",
    logoSrc: "/logos/matagalpa.png"
  },
  {
    id: "nagarote",
    url: "/logos/logo10.png",
    title: "Nagarote",
    description: "Municipio azul y limpio por excelencia, cuna del quesillo tradicional y la calidez gastronómica.",
    tags: ["Quesillo", "Tradición", "Gastronomía", "Municipio Azul"],
    slug: "nagarote",
    logoSrc: "/logos/nagarote.png"
  },
];

function Gallery({
  items,
  setIndex,
  index,
}: {
  items: GalleryItem[];
  setIndex: (index: number) => void;
  index: number;
}) {
  const router = useRouter();

  const handleCardClick = (item: GalleryItem, i: number) => {
    setIndex(i);
    const targetUrl = item.slug ? `/ciudades-creativas/${item.slug}#circuitos` : '/ciudades-creativas';
    router.push(targetUrl);
  };

  return (
    <div className="w-full flex items-center justify-center gap-1.5 md:gap-2.5 lg:gap-3 py-6 px-2 overflow-x-auto no-scrollbar">
      {items.map((item, i) => {
        const isSelected = index === i;
        const targetUrl = item.slug ? `/ciudades-creativas/${item.slug}#circuitos` : '/ciudades-creativas';

        return (
          <motion.div
            key={item.id || i}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-3xl overflow-hidden shrink-0 cursor-pointer transition-all duration-500 ease-out shadow-lg hover:shadow-2xl ${
              isSelected
                ? "w-[260px] md:w-[320px] lg:w-[360px] ring-4 ring-[#00A8A7] shadow-teal-500/25"
                : "w-[44px] sm:w-[54px] md:w-[68px] lg:w-[82px] opacity-75 hover:opacity-100 ring-1 ring-slate-200 hover:ring-[#00A8A7]/50"
            } h-[400px] md:h-[450px]`}
            onMouseEnter={() => {
              setIndex(i);
            }}
            onClick={() => handleCardClick(item, i)}
          >
            {/* Imagen de fondo */}
            <Image
              src={item.url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 320px, 420px"
              className="object-cover transition-transform duration-700 ease-out"
              priority={i < 4}
            />

            {/* Gradiente de overlay */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isSelected
                  ? "bg-gradient-to-t from-black/90 via-black/40 to-black/15"
                  : "bg-gradient-to-t from-black/75 via-black/25 to-transparent"
              }`}
            />

            {/* Contenido en tarjeta colapsada (vertical text / number) */}
            {!isSelected && (
              <div className="absolute inset-0 flex flex-col justify-between items-center py-5 px-1 pointer-events-none">
                <span className="text-[11px] font-black text-white/90 bg-black/45 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold text-white tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-md">
                  {item.title}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400" />
              </div>
            )}

            {/* Contenido en tarjeta expandida */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="absolute inset-0 p-6 flex flex-col justify-between text-white"
              >
                {/* Cabecera de la tarjeta expandida */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A8A7]/90 text-white font-black text-[11px] uppercase tracking-wider backdrop-blur-md shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {String(i + 1).padStart(2, "0")} · Ciudad Creativa
                  </span>
                  
                  {item.logoSrc && (
                    <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md p-1.5 border border-white/40 flex items-center justify-center shadow-md">
                      <Image
                        src={item.logoSrc}
                        alt="Logo"
                        width={26}
                        height={26}
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Pie de la tarjeta expandida */}
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-md mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-slate-200 line-clamp-2 leading-relaxed mb-3 drop-shadow-sm font-medium">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags?.slice(0, 3).map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white/95 border border-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Botón de acción directa al circuito */}
                  <Link
                    href={targetUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xs shadow-lg shadow-teal-900/40 transition-all hover:scale-[1.02] active:scale-95 group/btn"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-300" />
                      <span>Ver Circuitos & Ciudad</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AccordionModal({
  items = NICARAGUA_CITIES_GALLERY,
}: {
  items?: GalleryItem[];
}) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative w-full">
      <Gallery
        items={items}
        index={index}
        setIndex={setIndex}
      />
    </div>
  );
}
