# Auditoría de Seguridad - Guía Restaurant

**Fecha:** 2026-01-27
**Estado:** VULNERABILIDADES CRÍTICAS ENCONTRADAS ⚠️

---

## 🚨 VULNERABILIDADES CRÍTICAS (Requieren atención INMEDIATA)

### 1. APIs de Administración SIN AUTENTICACIÓN

**Severidad:** 🔴 CRÍTICA
**Archivos afectados:**
- `app/api/restaurants/route.ts` (POST)
- `app/api/restaurants/[id]/route.ts` (PUT, DELETE)

**Problema:**
```typescript
// ❌ CUALQUIERA puede crear, editar y eliminar restaurantes
export async function POST(request: NextRequest) {
  const body = await request.json()
  const restaurant = await prisma.restaurant.create({ data: body })
  // NO HAY VERIFICACIÓN DE SESIÓN
}
```

**Impacto:**
- Cualquier persona con conocimientos básicos puede crear restaurantes falsos
- Pueden eliminar TODOS los restaurantes
- Pueden modificar información de restaurantes existentes
- Pueden marcar cualquier restaurante como "destacado" sin pagar

**Solución URGENTE:**

```typescript
// ✅ AGREGAR VERIFICACIÓN DE AUTENTICACIÓN
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // VERIFICAR SESIÓN
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  // Validar datos aquí
  const restaurant = await prisma.restaurant.create({ data: body });
  return NextResponse.json(restaurant, { status: 201 });
}
```

**Aplicar a:**
- POST `/api/restaurants`
- PUT `/api/restaurants/[id]`
- DELETE `/api/restaurants/[id]`

---

### 2. Sin Validación de Datos de Entrada

**Severidad:** 🔴 CRÍTICA
**Archivos afectados:** Todos los endpoints de API

**Problema:**
```typescript
// ❌ Acepta CUALQUIER dato sin validar
const body = await request.json()
await prisma.restaurant.create({ data: body })
```

**Impacto:**
- Pueden inyectar scripts maliciosos (XSS)
- Pueden corromper la base de datos con datos inválidos
- Pueden causar errores en la aplicación

**Solución:**

```typescript
import { z } from 'zod'; // npm install zod

// Esquema de validación
const restaurantSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  address: z.string().min(1).max(500),
  phone: z.string().regex(/^\+?[0-9\s\-()]+$/),
  email: z.string().email().optional(),
  estado: z.string().min(1),
  municipio: z.string().min(1),
  categoria: z.array(z.string()).max(10),
  website: z.string().url().optional(),
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  whatsapp: z.string().optional(),
  imagenes: z.array(z.string().url()).max(20),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();

  // VALIDAR DATOS
  const validation = restaurantSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: validation.error },
      { status: 400 }
    );
  }

  const restaurant = await prisma.restaurant.create({
    data: validation.data
  });

  return NextResponse.json(restaurant, { status: 201 });
}
```

---

### 3. NEXTAUTH_SECRET Débil en Producción

**Severidad:** 🔴 CRÍTICA
**Archivo:** `.env`

**Problema:**
```env
NEXTAUTH_SECRET="desarrollo-local-secreto-no-usar-en-produccion-12345"
```

**Impacto:**
- Las sesiones pueden ser falsificadas
- Robo de cuentas de administrador
- Acceso no autorizado al panel admin

**Solución para PRODUCCIÓN:**

```bash
# Generar clave segura (mínimo 32 caracteres aleatorios)
openssl rand -base64 32

# Resultado ejemplo:
# b8f7c3e9a2d4f6h1j3k5m7n9p0q2r4s6t8u0v2w4x6y8z0a2b4c6d8e0f2g4h6
```

**En Coolify:**
- Agregar variable de entorno con clave generada
- NUNCA usar la clave de desarrollo en producción

---

### 4. Debug Mode Activado

**Severidad:** 🟡 ALTA
**Archivo:** `lib/auth.ts`

**Problema:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...
  debug: true,  // ❌ Expone información sensible en logs
});
```

**Impacto:**
- Los logs exponen información sensible
- Facilita ataques al revelar estructura interna

**Solución:**

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...
  debug: process.env.NODE_ENV === 'development', // ✅ Solo en desarrollo
});
```

---

### 5. Sin Rate Limiting

**Severidad:** 🟡 ALTA
**Archivos:** Todas las APIs

**Problema:**
- No hay límite de requests por IP/usuario
- Vulnerable a ataques de fuerza bruta
- Vulnerable a DoS (Denial of Service)

**Impacto:**
- Pueden intentar adivinar contraseñas indefinidamente
- Pueden saturar el servidor con requests
- Costos excesivos de base de datos

**Solución:**

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests por 10 segundos
  analytics: true,
});

// Usar en API routes
export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Demasiadas peticiones" },
      { status: 429 }
    );
  }

  // ... resto del código
}
```

**Alternativa sin Redis (más simple):**

```typescript
// lib/simple-rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count++;
  return { success: true };
}
```

---

### 6. Sin Protección CSRF

**Severidad:** 🟡 ALTA
**Archivos:** Formularios del admin

**Problema:**
- Los formularios no tienen tokens CSRF
- Vulnerable a Cross-Site Request Forgery

**Impacto:**
- Un sitio malicioso puede hacer que un admin autenticado cree/elimine restaurantes sin saberlo

**Solución:**
NextAuth incluye protección CSRF automática para sus rutas, pero las rutas de API custom no.

```typescript
// Usar headers de NextAuth para verificación
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // NextAuth maneja CSRF automáticamente en sus propias rutas
  // Para APIs custom, verificar el origin
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (origin && !origin.includes(host!)) {
    return NextResponse.json(
      { error: "Origen no permitido" },
      { status: 403 }
    );
  }

  // ... resto del código
}
```

---

### 7. Variables de Entorno Expuestas

**Severidad:** 🟡 ALTA
**Archivo:** `.env`

**Problema:**
- El archivo `.env` no está en `.gitignore` (si se sube al repo)
- Credenciales de desarrollo podrían filtrarse

**Solución:**

```bash
# Verificar que .env esté en .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Crear .env.example (SIN valores reales)
cat > .env.example << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/guiarestaurant"
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
EOF
```

---

### 8. Contraseña de Admin Predecible

**Severidad:** 🟡 ALTA
**Archivo:** `prisma/seed.ts`

**Problema:**
```typescript
password: await bcrypt.hash("admin123", 10)
```

**Impacto:**
- La contraseña es conocida públicamente (está en el código)
- Fácil de adivinar

**Solución:**

```typescript
// prisma/seed.ts
const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
if (adminPassword === "changeme123") {
  console.warn("⚠️  ADVERTENCIA: Usando contraseña de admin por defecto");
  console.warn("   Configura ADMIN_PASSWORD en .env para producción");
}

const hashedPassword = await bcrypt.hash(adminPassword, 12); // ✅ 12 rounds (más seguro)
```

```env
# .env (producción)
ADMIN_PASSWORD="Contraseña-Muy-Segura-2026!"
```

---

### 9. Sin Sanitización de Salida (XSS)

**Severidad:** 🟡 MEDIA
**Archivos:** Componentes que renderizan datos de usuario

**Problema:**
- Si alguien logra inyectar HTML/JavaScript malicioso en la base de datos
- React escapa automáticamente, PERO hay casos especiales

**Protección actual:**
✅ React escapa automáticamente el texto
❌ Si usas `dangerouslySetInnerHTML` estarías vulnerable

**Verificación:**
```bash
# Buscar usos peligrosos
grep -r "dangerouslySetInnerHTML" app/ components/
```

**Si encuentras resultados, sanitiza:**

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

```typescript
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(restaurant.description)
}} />
```

---

### 10. Base de Datos Sin Restricciones a Nivel de SQL

**Severidad:** 🟡 MEDIA
**Archivo:** `prisma/schema.prisma`

**Problema:**
- No hay restricciones CHECK en el schema
- Pueden insertar datos sin sentido (precios negativos, etc.)

**Solución:**

```prisma
model Restaurant {
  // ... campos existentes ...

  // Agregar restricciones SQL
  @@check("char_length(name) >= 1", name: "restaurant_name_not_empty")
  @@check("char_length(phone) >= 10", name: "restaurant_phone_valid")
}
```

---

## ✅ ASPECTOS SEGUROS (Funcionando correctamente)

### 1. ✅ Prisma ORM Protege Contra SQL Injection
- Prisma usa prepared statements
- No hay riesgo de inyección SQL directa

### 2. ✅ Passwords Hasheados con bcrypt
- Se usa bcrypt con salt
- Las contraseñas no se almacenan en texto plano

### 3. ✅ NextAuth Session Management
- Sesiones basadas en JWT
- Tokens firmados criptográficamente

### 4. ✅ React Escapa HTML Automáticamente
- Protección XSS en componentes
- No se usa `dangerouslySetInnerHTML`

---

## 📊 NIVEL DE SEGURIDAD ACTUAL

| Área | Estado | Puntuación |
|------|--------|------------|
| Autenticación | 🟡 Parcial | 6/10 |
| Autorización | 🔴 Crítico | 2/10 |
| Validación de Datos | 🔴 Crítico | 1/10 |
| Protección CSRF | 🟡 Parcial | 5/10 |
| Protección XSS | 🟢 Bueno | 8/10 |
| Rate Limiting | 🔴 Ausente | 0/10 |
| Secretos | 🟡 Regular | 4/10 |
| **TOTAL** | **🔴 INSEGURO** | **3.7/10** |

---

## 🛠️ PLAN DE REMEDIACIÓN PRIORITARIO

### Fase 1: URGENTE (Implementar HOY)
1. ✅ Agregar autenticación a POST/PUT/DELETE de restaurants
2. ✅ Cambiar NEXTAUTH_SECRET en producción
3. ✅ Deshabilitar debug mode en producción
4. ✅ Agregar .env a .gitignore

### Fase 2: ALTA PRIORIDAD (Esta semana)
5. ✅ Implementar validación de datos con Zod
6. ✅ Agregar rate limiting simple
7. ✅ Cambiar contraseña de admin por defecto
8. ✅ Verificar origin en requests

### Fase 3: MEJORAS (Siguiente sprint)
9. ✅ Implementar rate limiting con Redis (Upstash)
10. ✅ Agregar headers de seguridad HTTP
11. ✅ Configurar CORS estricto
12. ✅ Implementar logging de seguridad
13. ✅ Agregar restricciones SQL en Prisma

---

## 🔐 HEADERS DE SEGURIDAD HTTP

Agregar en `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

---

## 📱 CONSIDERACIONES PARA PRODUCCIÓN

### SSL/TLS
- ✅ Coolify proporciona HTTPS automático con Let's Encrypt
- ✅ Forzar HTTPS en NEXTAUTH_URL: `https://tudominio.com`

### Backups
- ⚠️ Configurar backups automáticos de PostgreSQL en Coolify
- ⚠️ Backup diario recomendado
- ⚠️ Retención mínima: 7 días

### Monitoreo
- ⚠️ Implementar logging de intentos de login fallidos
- ⚠️ Alertas de actividad sospechosa
- ⚠️ Monitoreo de uso de API

---

## 🎯 CHECKLIST DE SEGURIDAD PRE-PRODUCCIÓN

- [ ] Autenticación en todos los endpoints admin
- [ ] Validación de datos con Zod
- [ ] NEXTAUTH_SECRET único y fuerte (32+ caracteres)
- [ ] Debug mode deshabilitado
- [ ] Rate limiting implementado
- [ ] Headers de seguridad HTTP configurados
- [ ] .env NO está en el repositorio Git
- [ ] Contraseña de admin cambiada
- [ ] HTTPS habilitado (Coolify)
- [ ] Backups de base de datos configurados
- [ ] Logs de seguridad implementados
- [ ] CORS configurado correctamente
- [ ] Verificación de origin en APIs

---

**Próxima revisión recomendada:** Cada 3 meses o después de cambios mayores
