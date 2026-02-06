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
  logo?: string;
  destacado: boolean;
  facebook?: string;
  instagram?: string;
  website?: string;
  whatsapp?: string;
  horarios?: any;
}

const CATEGORIA_ICONS: { [key: string]: string } = {
  "Mexicana": "🌮",
  "Italiana": "🍝",
  "Japonesa": "🍣",
  "China": "🥡",
  "Americana": "🍔",
  "Mariscos": "🦐",
  "Tacos": "🌯",
  "Pizza": "🍕",
  "Hamburguesas": "🍔",
  "Café": "☕",
  "Bar": "🍺",
  "Postres": "🍰",
  "Vegetariana": "🥗",
  "Vegana": "🌱",
  "Comida Rápida": "🍟",
  "Buffet": "🍽️",
  "Desayunos": "🍳",
  "Parrilla": "🥩",
  "Árabe": "🧆",
  "Coreana": "🍜",
  "Peruana": "🐟",
  "Antojitos": "🫔",
  "Birria": "🍲",
  "Tortas": "🥪",
  "Alitas": "🍗",
  "Sushi": "🍱",
  "Helados": "🍦",
};

function isOpenNow(horarios: any): boolean {
  if (!horarios) return true; // Si no hay horarios, asumimos que está abierto
  
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const now = new Date();
  const diaActual = dias[now.getDay()];
  const horaActual = now.getHours() * 60 + now.getMinutes();
  
  const horarioDia = horarios[diaActual];
  if (!horarioDia || !horarioDia.abierto) return false;
  
  const [aperturaH, aperturaM] = horarioDia.apertura.split(":").map(Number);
  const [cierreH, cierreM] = horarioDia.cierre.split(":").map(Number);
  
  const apertura = aperturaH * 60 + aperturaM;
  const cierre = cierreH * 60 + cierreM;
  
  return horaActual >= apertura && horaActual <= cierre;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const mainImage = restaurant.imagenes[0] || "/placeholder.jpg";
  const isOpen = isOpenNow(restaurant.horarios);

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative">
      {/* Badge Destacado */}
      {restaurant.destacado && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <span>⭐</span> DESTACADO
        </div>
      )}

      {/* Badge Abierto/Cerrado */}
      <div className={`absolute top-3 right-3 z-20 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${
        isOpen 
          ? "bg-green-500 text-white" 
          : "bg-gray-500 text-white"
      }`}>
        {isOpen ? "🟢 Abierto" : "🔴 Cerrado"}
      </div>

      {/* Imagen principal con overlay gradient */}
      <div className="relative h-48 sm:h-52 md:h-56 bg-gray-200 overflow-hidden">
        <Image
          src={mainImage}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Logo superpuesto */}
        {restaurant.logo && (
          <div className="absolute bottom-3 left-3 w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white">
            <Image src={restaurant.logo} alt={`${restaurant.name} logo`} fill className="object-cover" />
          </div>
        )}

        {/* Precio badge */}
        {restaurant.precioPromedio && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-lg shadow text-lg">
            {restaurant.precioPromedio}
          </div>
        )}

        {/* Galería indicador */}
        {restaurant.imagenes.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {restaurant.imagenes.slice(0, 5).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Título */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {restaurant.name}
        </h3>

        {/* Ubicación */}
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <span>📍</span>
          {restaurant.municipio}, {restaurant.estado}
        </p>

        {/* Descripción */}
        {restaurant.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Categorías con iconos */}
        {restaurant.categoria.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {restaurant.categoria.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-xs px-2.5 py-1 rounded-full border border-orange-100"
              >
                <span>{CATEGORIA_ICONS[cat] || "🍴"}</span>
                {cat}
              </span>
            ))}
            {restaurant.categoria.length > 3 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{restaurant.categoria.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 pt-3 mt-auto">
          {/* Acciones */}
          <div className="flex items-center justify-between">
            {/* Redes sociales */}
            <div className="flex gap-2">
              {restaurant.whatsapp && (
                <a
                  href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition text-lg"
                  title="WhatsApp"
                >
                  💬
                </a>
              )}
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition text-lg"
                  title="Llamar"
                >
                  📞
                </a>
              )}
              {restaurant.instagram && (
                <a
                  href={restaurant.instagram.startsWith("http") ? restaurant.instagram : `https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition text-lg"
                  title="Instagram"
                >
                  📷
                </a>
              )}
              {restaurant.facebook && (
                <a
                  href={restaurant.facebook.startsWith("http") ? restaurant.facebook : `https://facebook.com/${restaurant.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition text-lg"
                  title="Facebook"
                >
                  📘
                </a>
              )}
            </div>

            {/* Ver más */}
            <Link
              href={`/restaurante/${restaurant.id}`}
              className="text-sm font-semibold text-primary hover:text-orange-600 transition flex items-center gap-1"
            >
              Ver más <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
