"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  estado: string;
  municipio: string;
  activo: boolean;
  destacado: boolean;
  createdAt: Date;
}

export default function RestaurantList({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("¿Estás seguro de eliminar " + name + "?")) {
      return;
    }

    setDeleting(id);
    try {
      await fetch("/api/restaurants/" + id, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      alert("Error al eliminar restaurante");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                      <div className="text-sm text-gray-500">
                        {restaurant.destacado && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-primary mr-2">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{restaurant.municipio}</div>
                  <div className="text-sm text-gray-500">{restaurant.estado}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full " +
                      (restaurant.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800")}
                  >
                    {restaurant.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={"/admin/restaurants/" + restaurant.id}
                    className="text-primary hover:text-accent mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(restaurant.id, restaurant.name)}
                    disabled={deleting === restaurant.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deleting === restaurant.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">
                  {restaurant.municipio}, {restaurant.estado}
                </p>
              </div>
              <span
                className={"px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 " +
                  (restaurant.activo
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800")}
              >
                {restaurant.activo ? "Activo" : "Inactivo"}
              </span>
            </div>

            {restaurant.destacado && (
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent text-primary">
                  Destacado
                </span>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <Link
                href={"/admin/restaurants/" + restaurant.id}
                className="flex-1 bg-primary hover:bg-primary-dark text-white text-center py-3 px-4 rounded-lg transition font-medium text-sm"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(restaurant.id, restaurant.name)}
                disabled={deleting === restaurant.id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition disabled:opacity-50 font-medium text-sm"
              >
                {deleting === restaurant.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
