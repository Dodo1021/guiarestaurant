import SearchBar from "@/components/SearchBar";
import RestaurantGrid from "@/components/RestaurantGrid";
import SeasonalBanner from "@/components/SeasonalBanner";
import FeaturesSection from "@/components/FeaturesSection";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* Header con mejor diseño */}
      <header className="bg-gradient-to-r from-primary via-primary-dark to-secondary text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                <Image
                  src="/image.png"
                  alt="Guía Restaurant Logo"
                  width={120}
                  height={120}
                  className="relative h-10 sm:h-12 md:h-14 w-auto transform group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                  Guía Restaurant
                </h1>
                <p className="text-accent text-xs sm:text-sm font-medium italic">
                  Sabor sin fronteras
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/registrar-negocio"
                className="group relative bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">🏪 Registrar mi negocio</span>
              </a>
              <a
                href="mailto:hola@guiarestaurant.com"
                className="group relative bg-accent hover:bg-accent-light text-primary font-bold px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Contacto</span>
                <div className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Dinámico por Temporada */}
      <SeasonalBanner />

      {/* Hero Section Mejorado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-12 sm:py-16 md:py-20 lg:py-24">
        {/* Patrones de fondo animados */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        {/* Ondas decorativas */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 C150,50 350,50 600,25 C850,0 1050,0 1200,25 L1200,120 L0,120 Z"
              fill="rgb(248, 250, 252)"
              className="animate-wave"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-3 sm:px-4 text-center relative z-10">
          {/* Badge decorativo */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">🍽️</span>
            <span className="text-xs sm:text-sm font-semibold">Los mejores restaurantes de México</span>
          </div>

          {/* Título principal con animación */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">Descubre</span>{" "}
            <span className="inline-block animate-fade-in-up animation-delay-200 bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent">
              sabores únicos
            </span>
            <br />
            <span className="inline-block animate-fade-in-up animation-delay-400">
              en todo México
            </span>
          </h2>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 text-gray-100 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
            Tu directorio online de restaurantes, bares y cocinas.
            <span className="hidden sm:inline"> Encuentra el lugar perfecto para cada ocasión.</span>
          </p>

          {/* Buscador destacado */}
          <div className="max-w-5xl mx-auto animate-fade-in-up animation-delay-800">
            <Suspense
              fallback={
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                  <div className="h-32 flex items-center justify-center">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  </div>
                </div>
              }
            >
              <SearchBar />
            </Suspense>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 max-w-lg mx-auto mt-8 sm:mt-12 animate-fade-in-up animation-delay-1000">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-1">32</div>
              <div className="text-sm sm:text-base text-gray-200">Estados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-1">24/7</div>
              <div className="text-sm sm:text-base text-gray-200">Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Features */}
      <FeaturesSection />

      {/* Separador decorativo */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 text-3xl">
            <span className="animate-bounce">🍴</span>
            <span className="animate-bounce animation-delay-200">🥘</span>
            <span className="animate-bounce animation-delay-400">🍕</span>
            <span className="animate-bounce animation-delay-600">🍜</span>
            <span className="animate-bounce animation-delay-800">🌮</span>
          </div>
        </div>
      </div>

      {/* Main Content - Lista de Restaurantes */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        {/* Título de sección */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-3">
            Explora Nuestro Directorio
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Más de 1,000 restaurantes esperando por ti en toda la república mexicana
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Cargando restaurantes...</p>
            </div>
          }
        >
          <RestaurantGrid />
        </Suspense>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-primary-dark to-secondary text-white py-12 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              ¿Tienes un restaurante?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200">
              Únete a nuestra comunidad y llega a miles de clientes potenciales
            </p>
            <a
              href="mailto:hola@guiarestaurant.com"
              className="inline-block bg-accent hover:bg-accent-light text-primary font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-accent/50 transform hover:-translate-y-1"
            >
              ¡Contáctanos Ahora! →
            </a>
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="bg-gradient-to-r from-secondary via-primary-dark to-primary text-white py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Logo y descripción */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <Image
                src="/image.png"
                alt="Guía Restaurant Logo"
                width={60}
                height={60}
                className="h-10 sm:h-12 w-auto opacity-90"
              />
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold">Guía Restaurant</h3>
                <p className="text-accent text-xs sm:text-sm italic">Sabor sin fronteras</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
              El directorio más completo de restaurantes en México
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 my-6 sm:my-8"></div>

          {/* Copyright y redes */}
          <div className="text-center">
            <p className="text-xs sm:text-sm mb-2 sm:mb-3">
              © 2026 Guía Restaurant. Todos los derechos reservados.
            </p>
            <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
              #BuenProvecho #SaborSinFronteras #AmoGuiaRestaurant
            </p>
            <a
              href="mailto:hola@guiarestaurant.com"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition text-sm sm:text-base font-semibold"
            >
              <span>📧</span>
              hola@guiarestaurant.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
