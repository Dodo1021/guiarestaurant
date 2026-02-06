"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string | null;
  estado: string;
  municipio: string;
  categoria: string[];
  precioPromedio: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  createdAt: string;
  status: string;
}

export default function PendientesPage() {
  const [pendientes, setPendientes] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendientes = async () => {
    try {
      const res = await fetch("/api/restaurants/pendientes");
      const data = await res.json();
      setPendientes(data.restaurants || []);
    } catch (error) {
      console.error("Error fetching pendientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (!confirm(action === "approve" 
      ? "¿Aprobar este restaurante? Aparecerá en la guía pública." 
      : "¿Rechazar este restaurante? Se eliminará permanentemente."
    )) {
      return;
    }

    setActionLoading(id);
    try {
      const res = await fetch(`/api/restaurants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      });

      if (res.ok) {
        setPendientes(prev => prev.filter(r => r.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Error al procesar");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pendientes por Revisar</h1>
          <p className="text-gray-600">
            {pendientes.length} {pendientes.length === 1 ? "solicitud" : "solicitudes"} pendientes
          </p>
        </div>
        <Link
          href="/admin/restaurants"
          className="text-orange-500 hover:text-orange-600"
        >
          ← Volver a Restaurantes
        </Link>
      </div>

      {pendientes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">¡Todo al día!</h2>
          <p className="text-gray-500">No hay solicitudes pendientes de revisión.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendientes.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-800">{restaurant.name}</h2>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Pendiente
                      </span>
                    </div>
                    
                    {restaurant.description && (
                      <p className="text-gray-600 mb-3">{restaurant.description}</p>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {/* Datos del negocio */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">📍 Ubicación</h3>
                        <p className="text-gray-600">{restaurant.address}</p>
                        <p className="text-gray-600">{restaurant.municipio}, {restaurant.estado}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">📞 Contacto del Negocio</h3>
                        <p className="text-gray-600">Tel: {restaurant.phone}</p>
                        {restaurant.email && <p className="text-gray-600">Email: {restaurant.email}</p>}
                      </div>

                      {/* Datos del propietario */}
                      <div className="space-y-2 bg-blue-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-blue-700">👤 Propietario</h3>
                        <p className="text-gray-700">{restaurant.ownerName}</p>
                        <p className="text-gray-600">{restaurant.ownerEmail}</p>
                        <p className="text-gray-600">{restaurant.ownerPhone}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">🏷️ Categorías</h3>
                        <div className="flex flex-wrap gap-1">
                          {restaurant.categoria.map((cat) => (
                            <span key={cat} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                        {restaurant.precioPromedio && (
                          <p className="text-gray-600">Precio: {restaurant.precioPromedio}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-4">
                      Solicitud recibida: {new Date(restaurant.createdAt).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => handleAction(restaurant.id, "approve")}
                    disabled={actionLoading === restaurant.id}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === restaurant.id ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Aprobar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAction(restaurant.id, "reject")}
                    disabled={actionLoading === restaurant.id}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === restaurant.id ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rechazar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
