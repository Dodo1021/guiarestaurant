import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const CATEGORIA_ICONS: { [key: string]: string } = {
  "Mexicana": "🌮", "Italiana": "🍝", "Japonesa": "🍣", "China": "🥡",
  "Americana": "🍔", "Mariscos": "🦐", "Tacos": "🌯", "Pizza": "🍕",
  "Hamburguesas": "🍔", "Café": "☕", "Bar": "🍺", "Postres": "🍰",
  "Vegetariana": "🥗", "Vegana": "🌱", "Comida Rápida": "🍟", "Buffet": "🍽️",
  "Desayunos": "🍳", "Parrilla": "🥩", "Árabe": "🧆", "Coreana": "🍜",
  "Peruana": "🐟", "Antojitos": "🫔", "Birria": "🍲", "Tortas": "🥪",
  "Alitas": "🍗", "Sushi": "🍱", "Helados": "🍦",
};

async function getRestaurant(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id, status: "approved", activo: true },
  });
  return restaurant;
}

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await getRestaurant(params.id);

  if (!restaurant) {
    notFound();
  }

  const horarios = restaurant.horarios as any;
  const diasOrden = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Volver a la guía</span>
          </Link>
          <div className="flex items-center gap-3">
            {restaurant.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
              >
                <span>💬</span> WhatsApp
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Galería de imágenes */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto">
          {restaurant.imagenes.length > 0 ? (
            <div className="grid grid-cols-4 gap-1 h-[300px] sm:h-[400px] md:h-[500px]">
              {/* Imagen principal */}
              <div className="col-span-4 md:col-span-2 md:row-span-2 relative">
                <Image
                  src={restaurant.imagenes[0]}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Imágenes secundarias */}
              {restaurant.imagenes.slice(1, 5).map((img, i) => (
                <div key={i} className="hidden md:block relative">
                  <Image src={img} alt={`${restaurant.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] bg-gray-200 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Info principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                {restaurant.logo && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 shadow flex-shrink-0">
                    <Image src={restaurant.logo} alt="Logo" width={80} height={80} className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {restaurant.destacado && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">⭐ DESTACADO</span>
                    )}
                    {restaurant.precioPromedio && (
                      <span className="bg-gray-100 text-gray-700 font-bold px-2 py-1 rounded-full text-sm">
                        {restaurant.precioPromedio}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1">
                    <span>📍</span> {restaurant.address}
                  </p>
                  <p className="text-gray-500">
                    {restaurant.municipio}, {restaurant.estado}
                    {restaurant.codigoPostal && ` - C.P. ${restaurant.codigoPostal}`}
                  </p>
                </div>
              </div>

              {/* Categorías */}
              {restaurant.categoria.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.categoria.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      <span>{CATEGORIA_ICONS[cat] || "🍴"}</span>
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Descripción */}
              {restaurant.description && (
                <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
              )}
            </div>

            {/* Horarios */}
            {horarios && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🕐</span> Horarios
                </h2>
                <div className="space-y-2">
                  {diasOrden.map((dia) => {
                    const h = horarios[dia];
                    const isToday = new Date().toLocaleDateString("es-MX", { weekday: "long" }).toLowerCase() === dia.toLowerCase();
                    
                    return (
                      <div
                        key={dia}
                        className={`flex justify-between py-2 px-3 rounded-lg ${isToday ? "bg-orange-50 border border-orange-200" : ""}`}
                      >
                        <span className={`font-medium ${isToday ? "text-orange-700" : "text-gray-700"}`}>
                          {dia} {isToday && <span className="text-xs">(hoy)</span>}
                        </span>
                        {h?.abierto ? (
                          <span className="text-gray-600">{h.apertura} - {h.cierre}</span>
                        ) : (
                          <span className="text-gray-400">Cerrado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contacto */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📞</span> Contacto
              </h2>
              
              <div className="space-y-3">
                {/* Teléfono */}
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                    📞
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Teléfono</div>
                    <div className="font-semibold text-gray-800">{restaurant.phone}</div>
                  </div>
                </a>

                {/* WhatsApp */}
                {restaurant.whatsapp && (
                  <a
                    href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                      💬
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">WhatsApp</div>
                      <div className="font-semibold text-gray-800">Enviar mensaje</div>
                    </div>
                  </a>
                )}

                {/* Email */}
                {restaurant.email && (
                  <a
                    href={`mailto:${restaurant.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white text-xl">
                      ✉️
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-semibold text-gray-800 text-sm truncate">{restaurant.email}</div>
                    </div>
                  </a>
                )}

                {/* Website */}
                {restaurant.website && (
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
                  >
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                      🌐
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Sitio Web</div>
                      <div className="font-semibold text-gray-800">Visitar</div>
                    </div>
                  </a>
                )}
              </div>

              {/* Redes Sociales */}
              {(restaurant.facebook || restaurant.instagram) && (
                <>
                  <hr className="my-4" />
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Síguenos</h3>
                  <div className="flex gap-3">
                    {restaurant.facebook && (
                      <a
                        href={restaurant.facebook.startsWith("http") ? restaurant.facebook : `https://facebook.com/${restaurant.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl hover:bg-blue-700 transition"
                      >
                        📘
                      </a>
                    )}
                    {restaurant.instagram && (
                      <a
                        href={restaurant.instagram.startsWith("http") ? restaurant.instagram : `https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl hover:from-purple-700 hover:to-pink-600 transition"
                      >
                        📷
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer mini */}
      <footer className="bg-white border-t py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <Link href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
            ← Volver a Guía Restaurant
          </Link>
        </div>
      </footer>
    </div>
  );
}
