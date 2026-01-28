# Análisis de Escalabilidad y Límites - Guía Restaurant

**Fecha:** 2026-01-27
**Versión:** 1.0

---

## 📊 LÍMITES ACTUALES DEL SISTEMA

### 1. Capacidad de Restaurantes

#### Configuración Actual (Desarrollo)
- **Base de datos:** PostgreSQL local
- **Servidor:** Next.js en modo desarrollo
- **Hardware:** Mac local

#### Límites Teóricos

| Componente | Límite Teórico | Límite Práctico Recomendado |
|------------|----------------|----------------------------|
| **PostgreSQL Rows** | 1.6 mil millones | 10,000 - 50,000 restaurantes |
| **Prisma Performance** | Sin límite | 50,000 registros sin optimización |
| **Next.js API** | Depende del servidor | 1,000 requests/segundo |
| **Búsquedas** | Depende de índices | < 100ms hasta 10,000 registros |

#### Análisis Detallado por Escala

##### **< 100 restaurantes** ✅ SIN PROBLEMAS
- Rendimiento excelente
- Sin necesidad de optimización
- Búsquedas instantáneas (< 10ms)
- Costo mínimo

##### **100 - 1,000 restaurantes** ✅ ÓPTIMO
- Rendimiento muy bueno
- Búsquedas rápidas (< 50ms)
- Costo razonable
- Configuración actual suficiente

##### **1,000 - 10,000 restaurantes** 🟡 REQUIERE OPTIMIZACIÓN
- **Problemas potenciales:**
  - Búsquedas sin índices lentas (> 200ms)
  - Carga de imágenes puede ser lenta
  - Backups más lentos

- **Optimizaciones necesarias:**
  ```prisma
  // Agregar índices compuestos
  @@index([estado, municipio, activo])
  @@index([categoria, activo])
  @@fulltext([name, description]) // PostgreSQL 12+
  ```

- **Paginación obligatoria:**
  ```typescript
  // Implementar en /api/restaurants
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const restaurants = await prisma.restaurant.findMany({
    where,
    take: limit,
    skip: skip,
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
  });

  const total = await prisma.restaurant.count({ where });

  return NextResponse.json({
    restaurants,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
  ```

##### **10,000 - 50,000 restaurantes** 🟡 REQUIERE ARQUITECTURA MEJORADA
- **Problemas críticos:**
  - Base de datos necesita tuning
  - Búsqueda de texto completo lenta
  - Almacenamiento de imágenes considerable
  - Backups grandes (> 5GB)

- **Soluciones requeridas:**

1. **Implementar búsqueda con Elasticsearch o Algolia:**
   ```typescript
   // Opción 1: Algolia (más fácil)
   import algoliasearch from 'algoliasearch';

   const client = algoliasearch('APP_ID', 'ADMIN_KEY');
   const index = client.initIndex('restaurants');

   // Indexar al crear/actualizar
   await index.saveObject({
     objectID: restaurant.id,
     name: restaurant.name,
     estado: restaurant.estado,
     municipio: restaurant.municipio,
     ...
   });

   // Búsqueda ultrarrápida
   const { hits } = await index.search(searchTerm, {
     filters: `estado:${estado} AND municipio:${municipio}`
   });
   ```

2. **CDN para imágenes:**
   - Cloudinary
   - AWS CloudFront
   - Vercel Image Optimization

3. **Caché de resultados:**
   ```typescript
   import { Redis } from '@upstash/redis';

   const redis = Redis.fromEnv();

   export async function GET(request: NextRequest) {
     const cacheKey = `restaurants:${searchParams.toString()}`;

     // Buscar en caché
     const cached = await redis.get(cacheKey);
     if (cached) {
       return NextResponse.json(cached);
     }

     // Query a DB
     const restaurants = await prisma.restaurant.findMany({...});

     // Guardar en caché (5 minutos)
     await redis.set(cacheKey, restaurants, { ex: 300 });

     return NextResponse.json(restaurants);
   }
   ```

##### **> 50,000 restaurantes** 🔴 REQUIERE REINGENIERÍA
- **No recomendado sin:**
  - Equipo de DevOps dedicado
  - Monitoreo 24/7
  - Presupuesto significativo (> $500 USD/mes)
  - Arquitectura de microservicios

---

### 2. Límites de Almacenamiento de Imágenes

#### Escenario Actual

**Asumiendo:**
- Promedio: 5 imágenes por restaurante
- Tamaño promedio: 500 KB por imagen optimizada
- Total por restaurante: ~2.5 MB

| Restaurantes | Espacio en Disco | Costo Aprox. (AWS S3) |
|--------------|------------------|------------------------|
| 100 | 250 MB | $0.01/mes |
| 500 | 1.25 GB | $0.03/mes |
| 1,000 | 2.5 GB | $0.06/mes |
| 5,000 | 12.5 GB | $0.29/mes |
| 10,000 | 25 GB | $0.58/mes |
| 50,000 | 125 GB | $2.88/mes |

#### Soluciones por Escala

**< 1,000 restaurantes:** ✅ Almacenamiento local en VPS (incluido en plan)

**1,000 - 10,000:** 🟡 Considerar CDN
- Cloudinary: 25 GB gratis/mes, luego $0.08/GB
- Vercel Image Optimization: Automático con deploy
- AWS S3 + CloudFront: ~$1-3/mes

**> 10,000:** 🔴 CDN obligatorio
- Cloudinary Pro: $89/mes (100 GB)
- AWS S3 + CloudFront: $5-20/mes según tráfico

#### Optimización de Imágenes (CRÍTICO)

**Implementar compresión automática:**

```typescript
// app/api/upload/route.ts
import sharp from 'sharp';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  // Optimizar imagen
  const optimized = await sharp(buffer)
    .resize(1200, 800, { // Max dimensions
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 80 }) // Comprimir a 80%
    .toBuffer();

  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
  await writeFile(join(process.cwd(), 'public/uploads', filename), optimized);

  return Response.json({ url: `/uploads/${filename}` });
}
```

**Ahorro esperado:** 60-80% de espacio

---

### 3. Límites de Conexiones a Base de Datos

#### PostgreSQL Connection Pool

**Configuración actual:**
```typescript
// lib/prisma.ts
const prisma = new PrismaClient()
```

**Problema:**
- Prisma crea hasta 10 conexiones por defecto
- Next.js en desarrollo recarga constantemente
- Puede agotar el pool de conexiones

**Solución:**

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=5"
    }
  }
});
```

**Límites por plan de hosting:**

| Servicio | Conexiones Gratuitas | Plan Pagado |
|----------|----------------------|-------------|
| Railway | 20 | 100+ |
| Render | 10 | 100+ |
| Neon | 100 | 1000+ |
| Supabase | 100 | 400+ |
| AWS RDS | 85 (t3.micro) | Configurable |

**Para Coolify con PostgreSQL dedicado:**
- Configurar en `postgresql.conf`:
  ```
  max_connections = 100
  ```

---

### 4. Límites de Rendimiento de Búsquedas

#### Tiempos de Respuesta Esperados

| Restaurantes | Sin Índices | Con Índices | Con Caché |
|--------------|-------------|-------------|-----------|
| 100 | 5ms | 2ms | < 1ms |
| 1,000 | 50ms | 10ms | < 1ms |
| 10,000 | 500ms | 50ms | < 1ms |
| 50,000 | 2500ms ❌ | 200ms | < 1ms |

#### Índices Críticos

```prisma
model Restaurant {
  // ... campos ...

  // Índices actuales
  @@index([estado, municipio])
  @@index([categoria])
  @@index([destacado])

  // AGREGAR ESTOS:
  @@index([activo, destacado, createdAt]) // Para lista principal
  @@index([estado, activo]) // Para filtro por estado
  @@index([municipio, activo]) // Para filtro por municipio
}
```

**Aplicar:**
```bash
npm run db:push
```

---

### 5. Límites de Tráfico y Ancho de Banda

#### Coolify/VPS Típico

**Plan básico (~$5-10/mes):**
- Transferencia: 1-2 TB/mes
- Usuarios concurrentes: ~100-500

**Cálculo de consumo:**

**Por request de página principal:**
- HTML: 50 KB
- CSS/JS: 200 KB
- Imágenes (lazy load): 500 KB promedio
- **Total:** ~750 KB por visita

**Con 1 TB de transferencia:**
- ~1,400,000 requests/mes
- ~46,000 requests/día
- ~1,900 requests/hora

**Traducido a usuarios:**
- Asumiendo 5 páginas por sesión: ~9,000 usuarios/día
- **Capacidad más que suficiente para proyecto inicial**

---

## 💰 ANÁLISIS DE COSTOS POR ESCALA

### Escenario 1: Startup (< 500 restaurantes)

**Infraestructura:**
- VPS (Coolify): $5-10/mes
- Base de datos: Incluida
- Imágenes: Almacenamiento local
- **TOTAL:** $10/mes

### Escenario 2: Crecimiento (500 - 5,000 restaurantes)

**Infraestructura:**
- VPS (mejorado): $20-40/mes
- PostgreSQL dedicado: $15-25/mes
- Cloudinary (imágenes): $0-5/mes
- Backups: $5/mes
- **TOTAL:** $45-75/mes

### Escenario 3: Escalado (5,000 - 20,000 restaurantes)

**Infraestructura:**
- VPS (2x): $80/mes
- PostgreSQL gestionado: $50/mes
- Cloudinary Pro: $89/mes
- Redis (Upstash): $10/mes
- Algolia (búsqueda): $50/mes
- Monitoring: $20/mes
- Backups: $15/mes
- **TOTAL:** $314/mes

### Escenario 4: Enterprise (> 20,000 restaurantes)

**Infraestructura:**
- AWS/GCP Kubernetes: $300-500/mes
- RDS PostgreSQL: $200/mes
- CloudFront CDN: $50/mes
- Algolia: $200/mes
- Redis: $50/mes
- DevOps/Monitoring: $100/mes
- **TOTAL:** $900-1,100/mes

---

## 🎯 RECOMENDACIONES POR OBJETIVO

### Objetivo: Directorio Local (< 200 restaurantes)
**Status:** ✅ Configuración actual es PERFECTA
- Sin cambios necesarios
- Costo: ~$10/mes

### Objetivo: Ciudad Grande (200 - 2,000 restaurantes)
**Cambios necesarios:**
1. Implementar paginación
2. Optimizar imágenes con sharp
3. Agregar índices a Prisma
4. Rate limiting básico
5. CDN para imágenes (Cloudinary gratis)

**Costo estimado:** $15-30/mes

### Objetivo: Estatal (2,000 - 10,000 restaurantes)
**Cambios necesarios:**
1. Todo lo anterior +
2. PostgreSQL dedicado (Neon/Railway)
3. Cloudinary pagado
4. Redis para caché (Upstash)
5. Optimización de queries
6. Monitoreo (Sentry/LogRocket)

**Costo estimado:** $75-150/mes

### Objetivo: Nacional (10,000+ restaurantes)
**Cambios necesarios:**
1. Todo lo anterior +
2. Algolia para búsqueda
3. Múltiples instancias con load balancer
4. CDN obligatorio
5. Equipo DevOps
6. Arquitectura de microservicios

**Costo estimado:** $500-2,000/mes

---

## ⚠️ CUELLOS DE BOTELLA IDENTIFICADOS

### 1. Búsqueda de Texto (CRÍTICO a partir de 1,000)
**Problema:** Búsqueda con `ILIKE` es lenta
**Solución:** Algolia o PostgreSQL Full-Text Search

### 2. Carga de Imágenes (CRÍTICO a partir de 500)
**Problema:** Imágenes grandes ralentizan la página
**Soluciones:**
- Implementar lazy loading (ya implementado con Next/Image ✅)
- Comprimir imágenes (pendiente ❌)
- CDN (pendiente ❌)

### 3. Sin Paginación (CRÍTICO a partir de 100)
**Problema:** Carga TODOS los restaurantes en la página
**Impacto:**
- 100 restaurantes = ~300 KB JSON
- 1,000 restaurantes = ~3 MB JSON ❌ INACEPTABLE

**Solución:** Ver sección "Paginación obligatoria" arriba

### 4. Sin Caché (Impacto a partir de 1,000)
**Problema:** Cada búsqueda golpea la base de datos
**Solución:** Redis con TTL de 5 minutos

### 5. Upload de Imágenes Sin Límites
**Problema:** Un usuario puede subir 100 imágenes de 10 MB
**Solución:**
```typescript
// En upload route
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 10;

if (file.size > MAX_FILE_SIZE) {
  return Response.json(
    { error: "Archivo muy grande (máx 5 MB)" },
    { status: 400 }
  );
}
```

---

## 🔄 PLAN DE MIGRACIÓN A ESCALA

### Fase 1: Optimización Actual (Gratis)
**Implementar HOY:**
1. ✅ Agregar índices a Prisma
2. ✅ Implementar paginación
3. ✅ Validación de tamaño de archivos
4. ✅ Lazy loading de imágenes (ya existe)

**Impacto:** Capacidad para 1,000 restaurantes

### Fase 2: Optimización Avanzada ($15-30/mes)
**Cuando llegues a 500 restaurantes:**
1. ✅ Migrar imágenes a Cloudinary
2. ✅ Implementar compresión con sharp
3. ✅ PostgreSQL dedicado (Neon free tier)
4. ✅ Rate limiting

**Impacto:** Capacidad para 5,000 restaurantes

### Fase 3: Escalado Real ($75-150/mes)
**Cuando llegues a 2,000 restaurantes:**
1. ✅ Redis para caché
2. ✅ Algolia para búsqueda
3. ✅ Monitoreo profesional
4. ✅ Backups automáticos

**Impacto:** Capacidad para 20,000 restaurantes

---

## 📈 MÉTRICAS DE MONITOREO

### KPIs Críticos

```typescript
// Implementar logging
console.log({
  metric: 'search_performance',
  duration: Date.now() - startTime,
  results: restaurants.length,
  filters: { estado, municipio }
});
```

**Alertas recomendadas:**
- Tiempo de búsqueda > 500ms ⚠️
- Tiempo de carga de página > 3s ⚠️
- Tasa de error > 1% ⚠️
- Uso de disco > 80% ⚠️
- Conexiones DB > 80% del límite ⚠️

---

## 🎯 RESPUESTA DIRECTA: "¿Cuántos restaurantes puedo manejar?"

### Con la configuración ACTUAL (sin cambios):
**200-500 restaurantes cómodamente**

### Con optimizaciones SIMPLES (1 día de trabajo):
**1,000-2,000 restaurantes**

### Con optimizaciones AVANZADAS (1 semana de trabajo):
**5,000-10,000 restaurantes**

### Con reingeniería ($500+/mes en infra):
**50,000+ restaurantes**

---

## ✅ CHECKLIST DE OPTIMIZACIÓN

**Antes de llegar a 100 restaurantes:**
- [ ] Implementar paginación
- [ ] Validar tamaño de uploads
- [ ] Agregar índices de Prisma

**Antes de llegar a 500:**
- [ ] Comprimir imágenes (sharp)
- [ ] CDN para imágenes (Cloudinary)
- [ ] Rate limiting
- [ ] PostgreSQL dedicado

**Antes de llegar a 2,000:**
- [ ] Redis para caché
- [ ] Optimización de queries
- [ ] Monitoreo profesional
- [ ] Backups automáticos

**Antes de llegar a 10,000:**
- [ ] Algolia para búsqueda
- [ ] Load balancer
- [ ] Múltiples instancias
- [ ] Equipo DevOps

---

**Conclusión:** El sistema actual es excelente para empezar y crecer hasta 500-1,000 restaurantes con optimizaciones mínimas. Después de eso, necesitarás inversión en infraestructura proporcional al crecimiento.
