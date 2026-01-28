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
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estado Select */}
          <div>
            <select
              value={filters.estadoCodigo}
              onChange={handleEstadoChange}
              className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Selecciona un estado</option>
              {estados.map((estado) => (
                <option key={estado.codigo} value={estado.codigo}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio Select */}
          <div>
            <select
              value={filters.municipio}
              onChange={(e) => setFilters({ ...filters, municipio: e.target.value })}
              disabled={!filters.estadoCodigo || loadingMunicipios}
              className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingMunicipios
                  ? "Cargando..."
                  : filters.estadoCodigo
                  ? "Selecciona un municipio"
                  : "Primero selecciona estado"}
              </option>
              {municipios.map((municipio) => (
                <option key={municipio} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Nombre del restaurante"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-accent hover:bg-accent-light text-primary font-bold py-3 sm:py-3 px-6 rounded-lg transition transform hover:scale-105 text-sm sm:text-base"
        >
          Buscar Restaurantes
        </button>
      </div>
    </form>
  );
}
