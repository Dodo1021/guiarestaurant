# Límites en VPS Compartido con Múltiples Proyectos

**Escenario:** VPS con Coolify + MÚLTIPLES sitios web

---

## 🎯 RESPUESTA DIRECTA

**Si tienes MUCHOS proyectos en el mismo VPS, los límites de Guía Restaurant se REDUCEN significativamente.**

### Ejemplo Real:

**VPS individual (solo Guía Restaurant):**
- ✅ 1,000-2,000 restaurantes cómodamente

**VPS compartido (10 proyectos):**
- ⚠️ 200-500 restaurantes cómodamente
- Cada proyecto compite por: CPU, RAM, disco, ancho de banda

---

## 💻 RECURSOS DE VPS COMPARTIDOS

### Típico VPS de $10-20/mes:

```
┌─────────────────────────────────────┐
│  VPS ($10-20/mes)                   │
├─────────────────────────────────────┤
│  2 CPU cores                        │
│  2-4 GB RAM                         │
│  50-80 GB SSD                       │
│  1-2 TB transferencia/mes           │
└─────────────────────────────────────┘
          │
          ├─ Coolify (consume ~500 MB RAM)
          │
          ├─ PostgreSQL (consume ~200-500 MB RAM)
          │
          └─ Tus proyectos (dividen lo que queda)
```

### Si tienes 10 proyectos:

```
RAM disponible: 4 GB
- Coolify: 500 MB
- PostgreSQL: 500 MB
- Sistema: 500 MB
━━━━━━━━━━━━━━━━━
Disponible para apps: 2.5 GB

Dividido entre 10 proyectos:
= 250 MB por proyecto

Guía Restaurant necesita:
- Node.js: ~150 MB base
- Por cada request: ~10-50 MB
- Total cómodo: ~400-500 MB
```

**PROBLEMA:** Con 250 MB, Guía Restaurant solo puede manejar ~3-5 requests simultáneos.

---

## 📊 LÍMITES AJUSTADOS PARA VPS COMPARTIDO

### Escenario: VPS $20/mes con 5-10 proyectos

| Restaurantes | RAM necesaria | % del VPS | Factible? |
|--------------|---------------|-----------|-----------|
| **< 100** | 200-300 MB | 15% | ✅ SÍ |
| **100-200** | 300-400 MB | 20% | ✅ SÍ |
| **200-500** | 400-600 MB | 30% | ⚠️ Ajustado |
| **500-1,000** | 600-1000 MB | 50% | ❌ Difícil |
| **> 1,000** | > 1 GB | > 60% | ❌ NO |

### Factores que reducen los límites:

1. **Otros proyectos compiten por recursos**
   - Si uno de tus otros sitios tiene pico de tráfico
   - Guía Restaurant se ralentiza

2. **PostgreSQL compartida**
   - Si tienes UNA base de datos para todos los proyectos
   - Las queries de otros proyectos afectan a Guía Restaurant

3. **Disco compartido**
   - Si subes muchas imágenes en Guía Restaurant
   - Reduces espacio para otros proyectos

4. **Ancho de banda compartido**
   - 1 TB/mes dividido entre 10 proyectos = 100 GB/proyecto
   - Guía Restaurant con imágenes consume mucho

---

## 🎯 ESTRATEGIAS PARA VPS COMPARTIDO

### Opción 1: Optimizar Guía Restaurant (RECOMENDADO)

**Reducir consumo de recursos:**

1. **Imágenes en CDN (no en VPS)**
   ```
   ❌ Antes: Imágenes en /public/uploads/ (usa disco del VPS)
   ✅ Después: Imágenes en Cloudinary (gratis hasta 25 GB)

   Ahorro: 90% de uso de disco
   Ahorro: 80% de ancho de banda
   ```

2. **Caché agresivo**
   ```typescript
   // Cachear resultados de búsqueda por 10 minutos
   // Reduce carga en PostgreSQL
   ```

3. **Lazy loading estricto**
   ```typescript
   // Solo cargar imágenes cuando están visibles
   // Ya lo tienes con Next/Image ✅
   ```

4. **Límite de conexiones a PostgreSQL**
   ```typescript
   // Máximo 3 conexiones simultáneas para este proyecto
   // Dejar 7 para otros proyectos
   ```

### Opción 2: Separar Recursos Críticos

**PostgreSQL dedicada (recomendado si tienes > 5 proyectos):**

```
┌─────────────────────┐      ┌──────────────────┐
│  VPS Coolify        │      │  PostgreSQL      │
│  ($20/mes)          │─────▶│  Externa         │
│                     │      │  (Neon/Railway)  │
│  - 10 proyectos     │      │  $0-15/mes       │
│  - Next.js apps     │      └──────────────────┘
└─────────────────────┘
```

**Ventajas:**
- PostgreSQL no consume RAM del VPS
- Mejor rendimiento para todos los proyectos
- Backups automáticos (Neon/Railway)

**Servicios recomendados:**
- **Neon** (PostgreSQL): Free tier generoso → $15/mes pagado
- **Railway**: $5/mes por proyecto
- **Supabase**: Free tier 500 MB → $25/mes

### Opción 3: VPS Más Grande (si tu negocio crece)

```
VPS actual: $20/mes (2 GB RAM, 10 proyectos)
         ↓
VPS mejorado: $40/mes (4 GB RAM, 10 proyectos)
         ↓
= 400 MB por proyecto (vs 250 MB)
= Guía Restaurant maneja 500-1,000 restaurantes
```

### Opción 4: VPS Dedicado Solo para Guía Restaurant

**Cuando Guía Restaurant genere ingresos significativos:**

```
VPS #1: $20/mes              VPS #2: $20/mes
Coolify con 9 proyectos  +   Solo Guía Restaurant
pequeños                      + PostgreSQL dedicada

= $40/mes total
= Guía Restaurant tiene recursos completos
= Puede manejar 2,000-5,000 restaurantes
```

---

## 📊 ANÁLISIS DE COSTO-BENEFICIO

### Escenario A: Todo en un VPS ($20/mes)

```
Costo: $20/mes
Capacidad Guía Restaurant: 100-200 restaurantes
Otros proyectos: 9 sitios pequeños

Ventajas:
✅ Bajo costo
✅ Simple de administrar

Desventajas:
❌ Límite de restaurantes bajo
❌ Si Guía Restaurant crece, afecta otros proyectos
```

### Escenario B: PostgreSQL separada ($20 + $0/mes = $20/mes)

```
Costo: $20/mes (VPS) + $0/mes (Neon free tier)
Capacidad Guía Restaurant: 200-500 restaurantes
Otros proyectos: 9 sitios pequeños

Ventajas:
✅ Mismo costo
✅ Mejor rendimiento para todos
✅ Backups automáticos gratis

Desventajas:
⚠️ Ligeramente más complejo
```

### Escenario C: CDN + PostgreSQL externa ($20 + $0/mes = $20/mes)

```
Costo: $20/mes (VPS) + $0/mes (Neon + Cloudinary free tiers)
Capacidad Guía Restaurant: 500-1,000 restaurantes
Otros proyectos: 9 sitios pequeños

Ventajas:
✅ Mismo costo
✅✅ Mucha más capacidad
✅ Imágenes rápidas globalmente
✅ No usa disco del VPS

Desventajas:
⚠️ Dependes de servicios externos
```

---

## 🎯 RECOMENDACIÓN PARA TU CASO

### AHORA (Fase de Lanzamiento):

```
✅ VPS Coolify: $20/mes
✅ PostgreSQL: En el mismo VPS
✅ Imágenes: En el VPS (/public/uploads)
✅ 10 proyectos compartiendo recursos

Capacidad: 100-200 restaurantes
```

### Cuando llegues a 100 restaurantes:

```
✅ VPS Coolify: $20/mes
✅ PostgreSQL: Neon (gratis)  ← MOVER AQUÍ
✅ Imágenes: Cloudinary (gratis) ← MOVER AQUÍ
✅ 10 proyectos

Capacidad: 500-1,000 restaurantes
Costo adicional: $0
Tiempo de migración: 2-3 horas
```

### Cuando llegues a 500 restaurantes:

```
✅ VPS Coolify: $20/mes (otros proyectos)
✅ VPS dedicado Guía Restaurant: $20/mes ← NUEVO VPS
✅ PostgreSQL: Neon pagado ($15/mes)
✅ Imágenes: Cloudinary pagado ($89/mes)

Capacidad: 2,000-5,000 restaurantes
Costo total: $144/mes
```

---

## ⚙️ CONFIGURACIÓN OPTIMIZADA PARA VPS COMPARTIDO

### 1. Limitar RAM de Next.js

**Archivo:** `package.json`

```json
{
  "scripts": {
    "start": "NODE_OPTIONS='--max-old-space-size=256' next start"
  }
}
```

Esto limita Next.js a 256 MB de RAM (deja más para otros proyectos).

### 2. Configurar Connection Pooling en Prisma

**Archivo:** `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=3"
    }
  }
})

export { prisma }
```

Limita a 3 conexiones simultáneas (si tienes 10 proyectos, total = 30 conexiones, dentro del límite de PostgreSQL).

### 3. Reducir Logs en Producción

**Archivo:** `next.config.js`

```javascript
module.exports = {
  // ... tu config actual

  // Reducir logs en producción
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
}
```

### 4. Deshabilitar Telemetría de Next.js

```bash
# En VPS (Coolify)
export NEXT_TELEMETRY_DISABLED=1
```

Ahorra ~10-20 MB de RAM.

---

## 📊 MONITOREO DE RECURSOS

### Comandos útiles en Coolify:

```bash
# Ver uso de RAM por contenedor
docker stats

# Ver cuánto ocupa cada proyecto en disco
du -sh /var/lib/docker/volumes/*

# Ver conexiones a PostgreSQL
docker exec -it postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

### Alertas recomendadas:

```
⚠️ RAM total > 80% del VPS
⚠️ Un proyecto usando > 40% de RAM
⚠️ Disco > 80% lleno
⚠️ PostgreSQL con > 80 conexiones activas
```

---

## 🎯 LÍMITES REALISTAS PARA TU ESCENARIO

### VPS $20/mes con 10 proyectos:

| Proyectos Activos | RAM por proyecto | Restaurantes en Guía Restaurant |
|-------------------|------------------|----------------------------------|
| 10 pequeños | 250 MB | 100-150 |
| 5 pequeños + 5 medianos | 200 MB | 50-100 |
| 1 grande + 9 pequeños | 400 MB | 200-500 |

### VPS $40/mes con 10 proyectos:

| Proyectos Activos | RAM por proyecto | Restaurantes en Guía Restaurant |
|-------------------|------------------|----------------------------------|
| 10 pequeños | 500 MB | 500-1,000 |
| 5 pequeños + 5 medianos | 400 MB | 200-500 |
| 1 grande + 9 pequeños | 800 MB | 1,000-2,000 |

---

## ✅ CHECKLIST DE OPTIMIZACIÓN

**Antes de llegar a 100 restaurantes:**
- [ ] Mover imágenes a Cloudinary (gratis)
- [ ] Implementar paginación
- [ ] Configurar connection pooling
- [ ] Limitar RAM de Next.js

**Antes de llegar a 200 restaurantes:**
- [ ] Mover PostgreSQL a Neon (gratis)
- [ ] Implementar caché básico
- [ ] Comprimir imágenes con sharp

**Si llegas a 500 restaurantes:**
- [ ] Considerar VPS dedicado ($20/mes adicional)
- [ ] O mejorar VPS actual a $40/mes

---

## 🎯 CONCLUSIÓN

**Para VPS compartido con múltiples proyectos:**

**Límites ajustados:**
- ✅ 100-200 restaurantes: Cómodo con optimizaciones
- ⚠️ 200-500 restaurantes: Posible con CDN + DB externa (gratis)
- ❌ > 500 restaurantes: Necesitas VPS dedicado o mejorado

**Clave del éxito:**
1. Mover imágenes a CDN (Cloudinary gratis)
2. Mover PostgreSQL a Neon (gratis)
3. Implementar paginación y caché

**Con estos 3 cambios (gratis), puedes llegar a 500-1,000 restaurantes en VPS compartido.**

¿Quieres que implemente estas optimizaciones?
