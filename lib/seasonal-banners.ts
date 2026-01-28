/**
 * Sistema de banners dinámicos por temporada/fecha especial
 */

export interface SeasonalBanner {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  textColor: string;
  startDate: string; // MM-DD
  endDate: string;   // MM-DD
}

export const seasonalBanners: SeasonalBanner[] = [
  // Año Nuevo
  {
    id: 'new-year',
    title: '¡Feliz Año Nuevo! 🎊',
    subtitle: 'Descubre nuevos sabores para empezar el año con todo',
    emoji: '🎉',
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    textColor: 'text-white',
    startDate: '12-28',
    endDate: '01-07',
  },

  // San Valentín
  {
    id: 'valentines',
    title: '❤️ Feliz Día del Amor y la Amistad',
    subtitle: 'Encuentra el restaurante perfecto para tu cita romántica',
    emoji: '💕',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    textColor: 'text-white',
    startDate: '02-10',
    endDate: '02-15',
  },

  // Día de la Mujer
  {
    id: 'womens-day',
    title: '👑 ¡Feliz Día Internacional de la Mujer!',
    subtitle: 'Celebra a las mujeres que llenan de sabor nuestras vidas',
    emoji: '💐',
    gradient: 'from-purple-500 via-pink-400 to-rose-400',
    textColor: 'text-white',
    startDate: '03-06',
    endDate: '03-09',
  },

  // Día de las Madres (México: 10 de mayo)
  {
    id: 'mothers-day',
    title: '💐 ¡Feliz Día de las Madres!',
    subtitle: 'Sorprende a mamá con una comida inolvidable',
    emoji: '🌸',
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    textColor: 'text-white',
    startDate: '05-05',
    endDate: '05-11',
  },

  // Día del Padre (México: 3er domingo de junio)
  {
    id: 'fathers-day',
    title: '👔 ¡Feliz Día del Padre!',
    subtitle: 'Celebra a papá con su platillo favorito',
    emoji: '🎯',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    textColor: 'text-white',
    startDate: '06-13',
    endDate: '06-19',
  },

  // Independencia de México (15-16 septiembre)
  {
    id: 'independence',
    title: '🇲🇽 ¡Viva México! ¡Viva la Independencia!',
    subtitle: 'Celebra con los mejores sabores mexicanos',
    emoji: '🎊',
    gradient: 'from-green-600 via-white to-red-600',
    textColor: 'text-gray-900',
    startDate: '09-13',
    endDate: '09-17',
  },

  // Día de Muertos
  {
    id: 'day-of-dead',
    title: '💀 ¡Feliz Día de Muertos!',
    subtitle: 'Honra la tradición con los sabores de siempre',
    emoji: '🌺',
    gradient: 'from-orange-500 via-yellow-400 to-orange-600',
    textColor: 'text-gray-900',
    startDate: '10-28',
    endDate: '11-03',
  },

  // Navidad
  {
    id: 'christmas',
    title: '🎄 ¡Feliz Navidad!',
    subtitle: 'Encuentra el lugar perfecto para tus cenas navideñas',
    emoji: '🎅',
    gradient: 'from-red-600 via-green-600 to-red-700',
    textColor: 'text-white',
    startDate: '12-15',
    endDate: '12-26',
  },
];

/**
 * Obtiene el banner apropiado para la fecha actual
 */
export function getCurrentSeasonalBanner(): SeasonalBanner | null {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = String(now.getDate()).padStart(2, '0');
  const currentDate = `${currentMonth}-${currentDay}`;

  for (const banner of seasonalBanners) {
    if (isDateInRange(currentDate, banner.startDate, banner.endDate)) {
      return banner;
    }
  }

  return null;
}

/**
 * Verifica si una fecha está dentro de un rango
 * Maneja correctamente rangos que cruzan el año nuevo
 */
function isDateInRange(date: string, start: string, end: string): boolean {
  // Caso especial: rango cruza el año nuevo (ej: 12-28 a 01-07)
  if (start > end) {
    return date >= start || date <= end;
  }

  return date >= start && date <= end;
}

/**
 * Banner por defecto cuando no hay fecha especial
 */
export const defaultBanner: SeasonalBanner = {
  id: 'default',
  title: '¡Bienvenido a Guía Restaurant!',
  subtitle: 'Descubre los mejores restaurantes de México',
  emoji: '🍽️',
  gradient: 'from-primary via-primary-dark to-secondary',
  textColor: 'text-white',
  startDate: '01-01',
  endDate: '12-31',
};
