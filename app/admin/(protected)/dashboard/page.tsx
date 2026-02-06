import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RestaurantList from "@/components/admin/RestaurantList";

export default async function DashboardPage() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pendientes = await prisma.restaurant.count({
    where: { status: "pending" },
  });

  const stats = {
    total: restaurants.filter((r) => r.status === "approved").length,
    activos: restaurants.filter((r) => r.activo && r.status === "approved").length,
    destacados: restaurants.filter((r) => r.destacado && r.status === "approved").length,
    pendientes,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Dashboard</h1>
        <Link
          href="/admin/restaurants/new"
          className="w-full sm:w-auto bg-accent hover:bg-accent-light text-primary font-bold py-3 px-5 sm:px-6 rounded-lg transition text-center text-sm sm:text-base"
        >
          + Nuevo Restaurante
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Total Restaurantes</h3>
          <p className="text-3xl sm:text-4xl font-bold text-primary mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Activos</h3>
          <p className="text-3xl sm:text-4xl font-bold text-secondary mt-2">{stats.activos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Destacados</h3>
          <p className="text-3xl sm:text-4xl font-bold text-accent mt-2">{stats.destacados}</p>
        </div>
        <Link href="/admin/pendientes" className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition border-2 border-transparent hover:border-yellow-400">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {stats.pendientes > 0 && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </>
              )}
            </span>
            Pendientes por Revisar
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-500 mt-2">{stats.pendientes}</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-primary">Todos los Restaurantes</h2>
        </div>
        <div className="p-4 sm:p-0">
          <RestaurantList restaurants={restaurants} />
        </div>
      </div>
    </div>
  );
}
