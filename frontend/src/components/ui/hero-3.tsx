"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  images: string[];
  className?: string;
  onCtaClick?: () => void;
}

// Reusable Button component styled with high-converting appeal
const ActionButton = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00A8A7] via-[#007F7E] to-[#0F3A2E] hover:from-[#00BFBD] hover:to-[#009694] text-white font-bold text-sm sm:text-base shadow-xl shadow-teal-950/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
  >
    {children}
  </motion.button>
);

// The main hero component
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  images,
  className,
  onCtaClick,
}) => {
  // Animation variants for the text content
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
  };

  // Duplicate images for a seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative w-full min-h-[90vh] lg:min-h-screen overflow-hidden bg-slate-950 text-white flex flex-col items-center justify-center text-center px-4 pt-28 sm:pt-36 lg:pt-40 pb-44 sm:pb-52 -mt-1",
        className
      )}
    >
      {/* Luces difusas sutiles de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/15 via-amber-500/10 to-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-4xl mx-auto">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-300 backdrop-blur-md"
        >
          {tagline}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight"
        >
          {typeof title === 'string' ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
        >
          {description}
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.6 }}
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
        </motion.div>
      </div>

      {/* Animated Image Marquee */}
      <div className="absolute bottom-0 left-0 w-full h-44 sm:h-56 md:h-64 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="flex gap-4 sm:gap-6"
          animate={{
            x: ["-100%", "0%"],
            transition: {
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-36 sm:h-48 md:h-56 flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -2 : 4)}deg`,
              }}
            >
              <img
                src={src}
                alt={`Muestra de Emprendimiento ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/10"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedMarqueeHero;
