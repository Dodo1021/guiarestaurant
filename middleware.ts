import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting (en producción usar Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW: { [key: string]: number } = {
  "/api/registrar-negocio": 3, // 3 registros por minuto
  "/api/upload/public": 10, // 10 uploads por minuto
  default: 100, // 100 requests por minuto para otras rutas
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIP || "unknown";
}

function isRateLimited(ip: string, path: string): boolean {
  const key = `${ip}:${path}`;
  const now = Date.now();
  const entry = rateLimit.get(key);

  // Limpiar entradas expiradas cada 100 requests
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimit.entries()) {
      if (v.resetTime < now) rateLimit.delete(k);
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  const maxRequests = MAX_REQUESTS_PER_WINDOW[path] || MAX_REQUESTS_PER_WINDOW.default;
  
  return entry.count > maxRequests;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // Rate limiting para rutas sensibles
  if (pathname.startsWith("/api/")) {
    // Determinar límite específico de la ruta
    let limitPath = "default";
    for (const path of Object.keys(MAX_REQUESTS_PER_WINDOW)) {
      if (pathname.startsWith(path)) {
        limitPath = path;
        break;
      }
    }

    if (isRateLimited(ip, limitPath)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }
  }

  // Headers de seguridad para todas las respuestas
  const response = NextResponse.next();
  
  // Protección XSS
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Prevenir clickjacking
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  
  // Prevenir sniffing de MIME type
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto estáticos
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
