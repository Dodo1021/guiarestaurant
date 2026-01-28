"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantCard from "./RestaurantCard";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export default function RestaurantGrid() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      const estado = searchParams.get("estado");
      const municipio = searchParams.get("municipio");
      const search = searchParams.get("search");

      if (estado) params.set("estado", estado);
      if (municipio) params.set("municipio", municipio);
      if (search) params.set("search", search);
      params.set("page", currentPage.toString());
      params.set("limit", "20");

      try {
        const res = await fetch("/api/restaurants?" + params.toString());
        const data = await res.json();
        setRestaurants(data.restaurants || []);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams, currentPage]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  // Scroll al inicio cuando cambia la página
  useEffect(() => {
    if (topRef.current && currentPage > 1) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No se encontraron restaurantes</p>
        <p className="text-gray-500 mt-2">Intenta con otros filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div ref={topRef}>
      {/* Info de resultados */}
      {pagination && (
        <div className="mb-4 text-sm sm:text-base text-gray-600">
          Mostrando {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} de {pagination.total} restaurantes
        </div>
      )}

      {/* Grid de restaurantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant: any) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition text-sm sm:text-base font-medium"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Números de página */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNumber;
              if (pagination.totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNumber = pagination.totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition ${
                    currentPage === pageNumber
                      ? 'bg-accent text-primary'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.totalPages}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition text-sm sm:text-base font-medium"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
