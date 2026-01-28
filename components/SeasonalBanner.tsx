"use client";

import { getCurrentSeasonalBanner, defaultBanner } from "@/lib/seasonal-banners";
import { useEffect, useState } from "react";

export default function SeasonalBanner() {
  const [banner, setBanner] = useState(defaultBanner);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentBanner = getCurrentSeasonalBanner();
    setBanner(currentBanner || defaultBanner);

    // Animación de entrada
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      {/* Banner con gradiente */}
      <div className={`bg-gradient-to-r ${banner.gradient} py-3 sm:py-4`}>
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-center">
            {/* Emoji animado */}
            <span className="text-2xl sm:text-3xl md:text-4xl animate-bounce">
              {banner.emoji}
            </span>

            <div className="flex-1">
              {/* Título */}
              <h2 className={`text-base sm:text-lg md:text-xl font-bold ${banner.textColor} leading-tight`}>
                {banner.title}
              </h2>

              {/* Subtítulo - oculto en móviles muy pequeños */}
              <p className={`hidden sm:block text-xs sm:text-sm md:text-base ${banner.textColor} opacity-90 mt-0.5`}>
                {banner.subtitle}
              </p>
            </div>

            {/* Emoji decorativo */}
            <span className="hidden sm:block text-2xl sm:text-3xl md:text-4xl animate-bounce animation-delay-300">
              {banner.emoji}
            </span>
          </div>
        </div>
      </div>

      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
    </div>
  );
}
