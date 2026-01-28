"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Estado {
  codigo: string;
  nombre: string;
}

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  const [filters, setFilters] = useState({
    estadoCodigo: "",
    estadoNombre: searchParams.get("estado") || "",
    municipio: searchParams.get("municipio") || "",
    search: searchParams.get("search") || "",
  });

  // Load estados on mount
  useEffect(() => {
    fetch("/api/estados")
      .then((res) => res.json())
      .then((data) => setEstados(data))
      .catch((err) => console.error("Error loading estados:", err));
  }, []);

  // Load municipios when estado changes
  useEffect(() => {
    if (filters.estadoCodigo) {
      setLoadingMunicipios(true);
      fetch(`/api/estados/${filters.estadoCodigo}`)
        .then((res) => res.json())
        .then((data) => {
          setMunicipios(data.municipios || []);
          setLoadingMunicipios(false);
        })
        .catch((err) => {
          console.error("Error loading municipios:", err);
          setLoadingMunicipios(false);
        });
    } else {
      setMunicipios([]);
    }
  }, [filters.estadoCodigo]);

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigo = e.target.value;
    const estado = estados.find((est) => est.codigo === codigo);
    setFilters({
      ...filters,
      estadoCodigo: codigo,
      estadoNombre: estado?.nombre || "",
      municipio: "", // Reset municipio when estado changes
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filters.estadoNombre) params.set("estado", filters.estadoNombre);
    if (filters.municipio) params.set("municipio", filters.municipio);
    if (filters.search) params.set("search", filters.search);

    router.push("/?" + params.toString());
  };

  return (
    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 backdrop-blur-sm border border-gray-100">
        {/* Título del formulario */}
        <div className="text-center mb-2 sm:mb-4">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl">🔍</span>
            Encuentra tu restaurante ideal
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Estado Select */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-sm sm:text-base">📍</span>
              Estado
            </label>
            <select
              value={filters.estadoCodigo}
              onChange={handleEstadoChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-gray-900 bg-white hover:border-accent/50 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
            >
              <option value="">Todos los estados</option>
              {estados.map((estado) => (
                <option key={estado.codigo} value={estado.codigo}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio Select */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-sm sm:text-base">🏙️</span>
              Municipio
            </label>
            <select
              value={filters.municipio}
              onChange={(e) => setFilters({ ...filters, municipio: e.target.value })}
              disabled={!filters.estadoCodigo || loadingMunicipios}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-accent/50 text-sm sm:text-base font-medium shadow-sm hover:shadow-md disabled:hover:shadow-sm"
            >
              <option value="">
                {loadingMunicipios
                  ? "Cargando..."
                  : filters.estadoCodigo
                  ? "Todos los municipios"
                  : "Selecciona un estado primero"}
              </option>
              {municipios.map((municipio) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-sm sm:text-base">🍽️</span>
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ej: Tacos del..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-gray-900 placeholder-gray-400 hover:border-accent/50 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Botón de búsqueda mejorado */}
        <button
          type="submit"
          className="group relative w-full bg-gradient-to-r from-accent via-yellow-400 to-accent hover:from-accent-light hover:via-yellow-300 hover:to-accent-light text-primary font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-lg sm:text-xl">🔎</span>
            Buscar Restaurantes
            <span className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>

          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
        </button>

        {/* Texto de ayuda */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
          💡 Tip: Puedes buscar por estado, municipio o nombre del restaurante
        </p>
      </div>
    </form>
  );
}
