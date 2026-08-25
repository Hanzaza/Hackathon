// @/components/emprendedores/Carousel.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const defaultImages = [
  "/emprendimientos/1.jpg",
  "/emprendimientos/2.jpg",
  "/emprendimientos/3.jpg",
  "/emprendimientos/4.jpg",
];

interface CarouselProps {
  images?: string[];
}

export default function Carousel({ images = defaultImages }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Emprendimiento ${index + 1}`}
          fill
          style={{ objectFit: "cover" }}
          className={`transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
