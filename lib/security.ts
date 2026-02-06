// Utilidades de seguridad para Guía Restaurant

/**
 * Sanitiza texto para prevenir XSS
 * Elimina tags HTML y caracteres peligrosos
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  
  return input
    // Remover tags HTML
    .replace(/<[^>]*>/g, "")
    // Remover scripts
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    // Remover caracteres de control
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Escapar caracteres especiales HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Limitar longitud
    .substring(0, 5000)
    .trim();
}

/**
 * Sanitiza URL
 */
export function sanitizeUrl(input: string | undefined | null): string {
  if (!input) return "";
  
  const trimmed = input.trim().toLowerCase();
  
  // Solo permitir http, https
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    // Si no tiene protocolo, asumir https
    if (trimmed.includes(".") && !trimmed.includes(" ")) {
      return `https://${input.trim()}`;
    }
    return "";
  }
  
  // Bloquear javascript: y data:
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:")) {
    return "";
  }
  
  return input.trim().substring(0, 500);
}

/**
 * Sanitiza teléfono
 */
export function sanitizePhone(input: string | undefined | null): string {
  if (!input) return "";
  // Solo números, espacios, guiones, paréntesis y +
  return input.replace(/[^0-9\s\-\(\)\+]/g, "").substring(0, 20);
}

/**
 * Sanitiza email
 */
export function sanitizeEmail(input: string | undefined | null): string {
  if (!input) return "";
  return input.trim().toLowerCase().substring(0, 254);
}

/**
 * Valida que las URLs de imágenes sean de Cloudinary
 */
export function isValidCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("cloudinary.com") || 
           parsed.hostname.includes("res.cloudinary.com");
  } catch {
    return false;
  }
}

/**
 * Valida array de imágenes
 */
export function validateImageUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) return [];
  
  return urls
    .filter(url => typeof url === "string" && isValidCloudinaryUrl(url))
    .slice(0, 6); // Máximo 6 imágenes
}
