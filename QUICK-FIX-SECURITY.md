# Correcciones de Seguridad URGENTES - Guía de Implementación Rápida

**Tiempo estimado:** 2-3 horas
**Prioridad:** 🔴 CRÍTICA - Implementar ANTES de producción

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] 1. Proteger API POST /api/restaurants (15 min)
- [ ] 2. Proteger API PUT /api/restaurants/[id] (10 min)
- [ ] 3. Proteger API DELETE /api/restaurants/[id] (10 min)
- [ ] 4. Instalar y configurar Zod (30 min)
- [ ] 5. Implementar validación en POST (30 min)
- [ ] 6. Implementar validación en PUT (20 min)
- [ ] 7. Deshabilitar debug mode (2 min)
- [ ] 8. Generar NEXTAUTH_SECRET fuerte (5 min)
- [ ] 9. Verificar .gitignore (5 min)
- [ ] 10. Testing de seguridad (30 min)

---

## 🔴 FIX #1: Proteger API de Restaurantes (35 minutos)

### 1.1 Proteger POST /api/restaurants

**Archivo:** `app/api/restaurants/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // ← AGREGAR

export async function GET(request: NextRequest) {
  // ... código existente (no cambiar)
}

export async function POST(request: NextRequest) {
  // ✅ AGREGAR VERIFICACIÓN DE AUTENTICACIÓN
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const restaurant = await prisma.restaurant.create({
      data: body,
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Error al crear restaurante" },
      { status: 500 }
    );
  }
}
```

### 1.2 Proteger PUT y DELETE /api/restaurants/[id]

**Archivo:** `app/api/restaurants/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // ← AGREGAR

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ... código existente (no cambiar, GET es público)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ AGREGAR VERIFICACIÓN DE AUTENTICACIÓN
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar restaurante" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ AGREGAR VERIFICACIÓN DE AUTENTICACIÓN
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar restaurante" },
      { status: 500 }
    );
  }
}
```

---

## 🔴 FIX #2: Validación de Datos (80 minutos)

### 2.1 Instalar Zod

```bash
npm install zod
```

### 2.2 Crear Schema de Validación

**Crear archivo:** `lib/validations/restaurant.ts`

```typescript
import { z } from 'zod';

export const restaurantCreateSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(200, "Nombre muy largo"),
  description: z.string().max(1000, "Descripción muy larga").optional(),
  address: z.string().min(1, "Dirección es requerida").max(500),
  phone: z.string()
    .min(10, "Teléfono inválido")
    .regex(/^[\d\s\-\(\)\+]+$/, "Teléfono contiene caracteres inválidos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),

  estado: z.string().min(1, "Estado es requerido"),
  municipio: z.string().min(1, "Municipio es requerido"),
  codigoPostal: z.string().max(10).optional(),

  categoria: z.array(z.string()).max(10, "Máximo 10 categorías"),
  precioPromedio: z.string().optional(),

  website: z.string().url("URL inválida").optional().or(z.literal("")),
  facebook: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
  whatsapp: z.string().optional(),

  imagenes: z.array(z.string().url("URL de imagen inválida")).max(20, "Máximo 20 imágenes"),
  logo: z.string().url("URL de logo inválida").optional().or(z.literal("")),

  destacado: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export const restaurantUpdateSchema = restaurantCreateSchema.partial();

export type RestaurantCreate = z.infer<typeof restaurantCreateSchema>;
export type RestaurantUpdate = z.infer<typeof restaurantUpdateSchema>;
```

### 2.3 Aplicar Validación en POST

**Archivo:** `app/api/restaurants/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { restaurantCreateSchema } from "@/lib/validations/restaurant"; // ← AGREGAR

// ... GET no cambia

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // ✅ VALIDAR DATOS
    const validation = restaurantCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: validation.data, // ← Usar datos validados
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Error al crear restaurante" },
      { status: 500 }
    );
  }
}
```

### 2.4 Aplicar Validación en PUT

**Archivo:** `app/api/restaurants/[id]/route.ts`

```typescript
import { restaurantUpdateSchema } from "@/lib/validations/restaurant"; // ← AGREGAR

// ... GET y DELETE no cambian

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // ✅ VALIDAR DATOS
    const validation = restaurantUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: validation.data, // ← Usar datos validados
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar restaurante" },
      { status: 500 }
    );
  }
}
```

---

## 🔴 FIX #3: Deshabilitar Debug Mode (2 minutos)

**Archivo:** `lib/auth.ts`

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ... código existente
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // ... código existente
  },
  debug: process.env.NODE_ENV === 'development', // ✅ CAMBIAR ESTA LÍNEA
});
```

---

## 🔴 FIX #4: NEXTAUTH_SECRET Fuerte (5 minutos)

### 4.1 Generar Nueva Clave

```bash
# En terminal
openssl rand -base64 32
```

**Ejemplo de salida:**
```
vK8x2nP9mQ4wL6yR3tE5uI7oP1aS9dF4gH6jK8lZ0xC2vB5nM3qW7eR9tY0u
```

### 4.2 Actualizar en Producción

**En Coolify (Variables de entorno):**
```
NEXTAUTH_SECRET=vK8x2nP9mQ4wL6yR3tE5uI7oP1aS9dF4gH6jK8lZ0xC2vB5nM3qW7eR9tY0u
```

⚠️ **NO cambiar en `.env` local (desarrollo está OK)**

---

## 🔴 FIX #5: Verificar .gitignore (5 minutos)

**Archivo:** `.gitignore`

Verificar que incluya:

```gitignore
# Dependencias
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
*.production

# Variables de entorno - CRÍTICO
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel

# Prisma
prisma/*.db
prisma/*.db-journal

# OS
.DS_Store
*.swp
*.swo
*~

# IDEs
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Uploads (opcional, depende de tu estrategia)
public/uploads/*
!public/uploads/.gitkeep
```

**Verificar que .env NO esté en Git:**

```bash
git status
# .env NO debe aparecer en la lista
```

**Si .env aparece:**

```bash
# Removerlo del historial de Git
git rm --cached .env
git commit -m "Remove .env from version control"
```

---

## ✅ TESTING DE SEGURIDAD (30 minutos)

### Test 1: API Protegida

**Probar sin autenticación:**

```bash
# Debe retornar 401 Unauthorized
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "address": "Test Address",
    "phone": "1234567890",
    "estado": "Jalisco",
    "municipio": "Guadalajara",
    "categoria": ["Mexicana"],
    "imagenes": []
  }'
```

**Resultado esperado:**
```json
{
  "error": "No autorizado"
}
```

### Test 2: Validación de Datos

**Probar con datos inválidos (después de login):**

```typescript
// En el admin panel, intentar crear restaurante con:
{
  name: "", // Vacío - debe fallar
  phone: "abc", // No numérico - debe fallar
  email: "invalid-email", // Email inválido - debe fallar
}
```

**Resultado esperado:** Mensaje de error mostrando campos inválidos

### Test 3: Debug Mode

**Verificar en consola del servidor:**

1. Iniciar servidor: `npm run dev`
2. Hacer login
3. Verificar consola NO muestre logs de debug de NextAuth

**SI ves logs de debug:**
```
[auth][debug] session callback
[auth][debug] jwt callback
```

**Entonces debug está activado ❌ - verificar Fix #3**

### Test 4: .env en Git

```bash
# Debe retornar vacío
git ls-files | grep .env

# Si retorna algo, .env está en Git ❌
```

---

## 🎯 VERIFICACIÓN FINAL

Después de implementar todos los fixes:

```bash
# 1. Reiniciar servidor
npm run dev

# 2. Ir a http://localhost:3000/admin/login
# 3. Login con admin@guiarestaurant.com / admin123

# 4. Intentar crear restaurante
#    - Debe funcionar ✅

# 5. Cerrar sesión

# 6. Abrir consola del navegador (F12)

# 7. Intentar crear restaurante vía fetch:
fetch('http://localhost:3000/api/restaurants', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Hack Test',
    address: '123',
    phone: '123',
    estado: 'X',
    municipio: 'X',
    categoria: [],
    imagenes: []
  })
})
.then(r => r.json())
.then(console.log)

# Resultado esperado:
# { error: "No autorizado" }
```

---

## 📋 RESUMEN DE CAMBIOS

| Archivo | Cambios |
|---------|---------|
| `app/api/restaurants/route.ts` | + auth check, + validación |
| `app/api/restaurants/[id]/route.ts` | + auth check en PUT/DELETE, + validación |
| `lib/validations/restaurant.ts` | Nuevo archivo con schemas |
| `lib/auth.ts` | debug condicional |
| `.gitignore` | Verificar .env incluido |
| `.env` (producción) | NEXTAUTH_SECRET fuerte |

---

## 🚀 DEPLOY A PRODUCCIÓN

**DESPUÉS de implementar todos los fixes:**

```bash
# 1. Commit de cambios
git add .
git commit -m "Security fixes: auth, validation, secrets"

# 2. Push a repositorio
git push origin main

# 3. En Coolify:
#    - Agregar/actualizar variables de entorno:
#      NEXTAUTH_SECRET=<clave-generada-con-openssl>
#      NEXTAUTH_URL=https://tudominio.com
#      DATABASE_URL=<tu-postgres-url>

# 4. Coolify desplegará automáticamente

# 5. Verificar en producción:
#    - Login funciona
#    - Crear restaurante (con auth) funciona
#    - API pública funciona
#    - API sin auth retorna 401
```

---

## ⚠️ IMPORTANTE

**NO SALTAR NINGÚN FIX**

Todos los fixes son críticos. Saltarse aunque sea uno deja el sistema vulnerable.

**Orden recomendado:**
1. Fix #1 (Autenticación) - 35 min
2. Fix #2 (Validación) - 80 min
3. Fix #3 (Debug) - 2 min
4. Fix #4 (Secret) - 5 min
5. Fix #5 (.gitignore) - 5 min
6. Testing - 30 min

**Total: ~2.5 horas**

**Después de esto, tu sistema estará listo para producción.**
