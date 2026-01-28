"use client";

import { useEffect, useState } from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: "🔍",
    title: "Búsqueda Inteligente",
    description: "Encuentra restaurantes por estado, municipio o nombre",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "⭐",
    title: "Restaurantes Destacados",
    description: "Los mejores lugares recomendados para ti",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: "📱",
    title: "100% Responsive",
    description: "Busca desde cualquier dispositivo, en cualquier lugar",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: "🗺️",
    title: "Todo México",
    description: "Restaurantes en todos los estados de la república",
    color: "from-red-500 to-pink-600",
  },
];

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Título de sección */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-3">
            ¿Por qué elegir Guía Restaurant?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            La forma más fácil y rápida de descubrir los mejores lugares para comer en México
          </p>
        </div>

        {/* Grid de features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                {/* Gradiente de fondo en hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                {/* Contenido */}
                <div className="relative">
                  {/* Icono */}
                  <div className="text-5xl sm:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* Título */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>

                {/* Borde decorativo animado */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA adicional */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-600 text-sm sm:text-base">
            ¿Tienes un restaurante?
            <a href="mailto:hola@guiarestaurant.com" className="text-accent hover:text-accent-light font-semibold ml-1 transition-colors">
              Contáctanos para aparecer aquí →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
