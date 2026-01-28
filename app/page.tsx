import SearchBar from "@/components/SearchBar";
import RestaurantGrid from "@/components/RestaurantGrid";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Image
                src="/image.png"
                alt="Guía Restaurant Logo"
                width={120}
                height={120}
                className="h-12 sm:h-14 md:h-16 w-auto"
                priority
              />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Guía Restaurant</h1>
                <p className="text-accent text-xs sm:text-sm italic">Sabor sin fronteras</p>
              </div>
            </div>
            <a
              href="mailto:hola@guiarestaurant.com"
              className="bg-accent hover:bg-accent-light text-primary font-semibold px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base"
            >
              Contacto
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Descubre los mejores restaurantes de México
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200">
            Tu directorio online de restaurantes, bares y cocinas
          </p>
          <Suspense fallback={
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
              <div className="h-32 flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              </div>
            </div>
          }>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
          </div>
        }>
          <RestaurantGrid />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white mt-8 sm:mt-12 md:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-sm sm:text-base mb-2">© 2026 Guía Restaurant - Sabor sin fronteras</p>
          <p className="text-xs sm:text-sm text-gray-300">
            #BuenProvecho #SaborSinFronteras #AmoGuiaRestaurant
          </p>
          <p className="mt-3 sm:mt-4">
            <a
              href="mailto:hola@guiarestaurant.com"
              className="text-accent hover:text-accent-light transition text-sm sm:text-base"
            >
              hola@guiarestaurant.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
