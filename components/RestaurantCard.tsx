import Image from "next/image";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  estado: string;
  municipio: string;
  categoria: string[];
  precioPromedio?: string;
  imagenes: string[];
  destacado: boolean;
  facebook?: string;
  instagram?: string;
  website?: string;
  whatsapp?: string;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const mainImage = restaurant.imagenes[0] || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {restaurant.destacado && (
        <div className="bg-accent text-primary text-xs sm:text-xs font-bold px-2 sm:px-3 py-1 absolute z-10 m-2 rounded shadow-md">
          DESTACADO
        </div>
      )}

      {/* Responsive image height: smaller on mobile, larger on desktop */}
      <div className="relative h-40 sm:h-48 md:h-56 bg-gray-200">
        <Image
          src={mainImage}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Responsive padding */}
      <div className="p-3 sm:p-4 md:p-5">
        {/* Title and price with responsive text sizes */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary leading-tight">
            {restaurant.name}
          </h3>
          {restaurant.precioPromedio && (
            <span className="text-accent font-bold text-sm sm:text-base whitespace-nowrap">
              {restaurant.precioPromedio}
            </span>
          )}
        </div>

        {/* Description with responsive text */}
        {restaurant.description && (
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Location and phone with responsive spacing */}
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
          <p className="flex items-center">
            <span className="font-semibold mr-1.5 sm:mr-2 text-base">📍</span>
            <span className="truncate">{restaurant.municipio}, {restaurant.estado}</span>
          </p>
          <p className="flex items-center">
            <span className="font-semibold mr-1.5 sm:mr-2 text-base">📞</span>
            <span className="truncate">{restaurant.phone}</span>
          </p>

          {/* Category tags with responsive sizing */}
          {restaurant.categoria.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
              {restaurant.categoria.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="bg-secondary text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social icons with responsive sizing */}
        <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-3 border-t">
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition text-xl sm:text-2xl"
              title="Sitio web"
            >
              🌐
            </a>
          )}
          {restaurant.facebook && (
            <a
              href={restaurant.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition text-xl sm:text-2xl"
              title="Facebook"
            >
              📘
            </a>
          )}
          {restaurant.instagram && (
            <a
              href={restaurant.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition text-xl sm:text-2xl"
              title="Instagram"
            >
              📷
            </a>
          )}
          {restaurant.whatsapp && (
            <a
              href={"https://wa.me/" + restaurant.whatsapp.replace(/[^0-9]/g, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition text-xl sm:text-2xl"
              title="WhatsApp"
            >
              💬
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
