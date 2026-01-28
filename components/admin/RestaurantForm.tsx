"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Estado {
  codigo: string;
  nombre: string;
}

interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  estado: string;
  municipio: string;
  codigoPostal: string;
  categoria: string[];
  precioPromedio: string;
  imagenes: string[];
  logo: string;
  destacado: boolean;
  activo: boolean;
}

interface Props {
  restaurant?: any;
}

export default function RestaurantForm({ restaurant }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [estadoCodigo, setEstadoCodigo] = useState("");

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    address: restaurant?.address || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",
    website: restaurant?.website || "",
    facebook: restaurant?.facebook || "",
    instagram: restaurant?.instagram || "",
    whatsapp: restaurant?.whatsapp || "",
    estado: restaurant?.estado || "",
    municipio: restaurant?.municipio || "",
    codigoPostal: restaurant?.codigoPostal || "",
    categoria: restaurant?.categoria || [],
    precioPromedio: restaurant?.precioPromedio || "",
    imagenes: restaurant?.imagenes || [],
    logo: restaurant?.logo || "",
    destacado: restaurant?.destacado || false,
    activo: restaurant?.activo !== undefined ? restaurant.activo : true,
  });

  // Load estados on mount
  useEffect(() => {
    fetch("/api/estados")
      .then((res) => res.json())
      .then((data) => {
        setEstados(data);
        // If editing, find the estado codigo from the nombre
        if (restaurant?.estado) {
          const estadoExistente = data.find((e: Estado) => e.nombre === restaurant.estado);
          if (estadoExistente) {
            setEstadoCodigo(estadoExistente.codigo);
          }
        }
      })
      .catch((err) => console.error("Error loading estados:", err));
  }, [restaurant?.estado]);

  // Load municipios when estado changes
  useEffect(() => {
    if (estadoCodigo) {
      setLoadingMunicipios(true);
      fetch(`/api/estados/${estadoCodigo}`)
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
  }, [estadoCodigo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = restaurant
        ? "/api/restaurants/" + restaurant.id
        : "/api/restaurants";
      const method = restaurant ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        alert("Error al guardar restaurante");
      }
    } catch (error) {
      alert("Error al guardar restaurante");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...uploadedUrls],
      }));
    } catch (error) {
      alert("Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((img) => img !== url),
    }));
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const categorias = value.split(",").map((c) => c.trim()).filter(Boolean);
    setFormData({ ...formData, categoria: categorias });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigo = e.target.value;
    const estado = estados.find((est) => est.codigo === codigo);
    setEstadoCodigo(codigo);
    setFormData({
      ...formData,
      estado: estado?.nombre || "",
      municipio: "", // Reset municipio when estado changes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Información Básica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Nombre del Restaurante *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
              rows={3}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Dirección *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Ubicación</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              value={estadoCodigo}
              onChange={handleEstadoChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900 bg-white"
              required
            >
              <option value="">Selecciona un estado</option>
              {estados.map((estado) => (
                <option key={estado.codigo} value={estado.codigo}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Municipio *
            </label>
            <select
              value={formData.municipio}
              onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
              disabled={!estadoCodigo || loadingMunicipios}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {loadingMunicipios
                  ? "Cargando..."
                  : estadoCodigo
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

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              value={formData.codigoPostal}
              onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Información del Negocio</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Categorías (separadas por coma)
            </label>
            <input
              type="text"
              value={formData.categoria.join(", ")}
              onChange={handleCategoriaChange}
              placeholder="Mexicana, Mariscos, Internacional"
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Precio Promedio
            </label>
            <select
              value={formData.precioPromedio}
              onChange={(e) => setFormData({ ...formData, precioPromedio: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900 bg-white"
            >
              <option value="">Seleccionar</option>
              <option value="$">$ - Económico</option>
              <option value="$$">$$ - Moderado</option>
              <option value="$$$">$$$ - Caro</option>
              <option value="$$$$">$$$$ - Muy Caro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Redes Sociales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Sitio Web
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://"
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="https://facebook.com/"
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/"
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+52 1 234 567 8900"
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Imágenes</h2>

        <div className="mb-4">
          <label className="block text-sm sm:text-sm font-medium text-gray-700 mb-2">
            Subir Imágenes
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-gray-900"
          />
          {uploading && <p className="text-sm text-gray-600 mt-2">Subiendo imágenes...</p>}
        </div>

        {formData.imagenes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {formData.imagenes.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={"Imagen " + (index + 1)}
                  className="w-full h-28 sm:h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Configuración</h2>

        <div className="space-y-3 sm:space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.destacado}
              onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
              className="mr-2 w-4 h-4 sm:w-auto sm:h-auto"
            />
            <span className="text-sm sm:text-sm font-medium text-gray-700">Marcar como destacado</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="mr-2 w-4 h-4 sm:w-auto sm:h-auto"
            />
            <span className="text-sm sm:text-sm font-medium text-gray-700">Activo (visible en el sitio)</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-base sm:text-base"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3 bg-accent hover:bg-accent-light text-primary font-bold rounded-lg transition disabled:opacity-50 text-base sm:text-base"
        >
          {loading ? "Guardando..." : restaurant ? "Actualizar" : "Crear"} Restaurante
        </button>
      </div>
    </form>
  );
}
